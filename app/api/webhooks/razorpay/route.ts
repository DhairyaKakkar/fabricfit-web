import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { fulfillPurchase } from '@/lib/fulfillment';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('x-razorpay-signature') ?? '';

  const secret = (process.env.RAZORPAY_WEBHOOK_SECRET ?? '').trim();
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');

  const expectedBuf = Buffer.from(expected);
  const receivedBuf = Buffer.from(sig);
  const valid =
    expectedBuf.length === receivedBuf.length &&
    crypto.timingSafeEqual(expectedBuf, receivedBuf);

  if (!valid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity;
    const notes = payment.notes ?? {};

    if (!notes.user_id || !notes.plan_id) {
      return NextResponse.json({ ok: true });
    }

    // Idempotent — if the verify route already fulfilled this payment, this is a
    // no-op. Acts purely as a backup in case the user's browser never completed
    // the verify call.
    await fulfillPurchase({
      userId: notes.user_id,
      planId: notes.plan_id,
      billingCycle: notes.billing_cycle ?? 'monthly',
      paymentId: payment.id,
      customerId: payment.contact,
    });
  }

  return NextResponse.json({ ok: true });
}
