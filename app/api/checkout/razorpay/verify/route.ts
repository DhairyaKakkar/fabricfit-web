import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getRazorpay } from '@/lib/razorpay';
import { createClient } from '@/lib/supabase/server';
import { fulfillPurchase } from '@/lib/fulfillment';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
    };

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // .trim() defends against a trailing newline/space in the env var — a very
    // common deploy mistake that breaks the HMAC while leaving the SDK's basic
    // auth (used for order creation) working, producing exactly the "order
    // succeeds but verify fails" symptom.
    const secret = (process.env.RAZORPAY_KEY_SECRET ?? '').trim();
    if (!secret) {
      console.error('[razorpay/verify] RAZORPAY_KEY_SECRET is not set');
      return NextResponse.json({ error: 'Payment configuration error' }, { status: 500 });
    }

    const expected = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const expectedBuf = Buffer.from(expected);
    const receivedBuf = Buffer.from(razorpay_signature);
    const valid =
      expectedBuf.length === receivedBuf.length &&
      crypto.timingSafeEqual(expectedBuf, receivedBuf);

    if (!valid) {
      console.error('[razorpay/verify] signature mismatch', {
        razorpay_order_id,
        razorpay_payment_id,
      });
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Signature is valid → the payment is genuine. From here on we ALWAYS return
    // success: fulfillment is best-effort (and the webhook is a backup), so a
    // transient DB/API blip never shows the user a scary error after they paid.
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const payment = await getRazorpay().payments.fetch(razorpay_payment_id);
        const notes = (payment.notes ?? {}) as Record<string, string>;

        // Security: the order must belong to the signed-in user.
        if (notes.user_id && notes.user_id !== user.id) {
          console.error('[razorpay/verify] order/user mismatch', {
            orderUser: notes.user_id,
            sessionUser: user.id,
          });
        } else if (notes.plan_id) {
          await fulfillPurchase({
            userId: user.id,
            planId: notes.plan_id,
            billingCycle: notes.billing_cycle ?? 'monthly',
            paymentId: razorpay_payment_id,
            customerId: typeof payment.contact === 'string' ? payment.contact : undefined,
          });
        }
      }
    } catch (err) {
      // Fulfillment failed but the payment is real — let the webhook handle it.
      console.error('[razorpay/verify] fulfillment failed (webhook will retry):', err);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[razorpay/verify] unexpected error:', err);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
