import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { escapeHtml } from '@/lib/escapeHtml';
import { rateLimit, clientIp } from '@/lib/rateLimit';

const MAX_FIELD = 200;

export async function POST(req: NextRequest) {
  if (!rateLimit(`trial:${clientIp(req)}`, { limit: 5, windowMs: 60_000 })) {
    return NextResponse.json({ error: 'Too many requests — please try again in a minute.' }, { status: 429 });
  }

  const { name, company, phone, email } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  for (const field of [name, company, phone, email]) {
    if (field && (typeof field !== 'string' || field.length > MAX_FIELD)) {
      return NextResponse.json({ error: 'One of the fields is too long.' }, { status: 400 });
    }
  }

  // Store the request (graceful if the table doesn't exist yet)
  try {
    const supabase = await createClient();
    await supabase.from('trial_requests').insert({
      name,
      company,
      phone,
      email,
      requested_at: new Date().toISOString(),
    });
  } catch {
    // Table may not exist yet — still return success so UX is not broken
  }

  // Notify the team via Resend
  try {
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'TrialRoomStudio <onboarding@resend.dev>',
        to: process.env.CONTACT_TO_EMAIL ?? 'hello@trialroomstudio.com',
        replyTo: email,
        subject: `New trial request from ${name}${company ? ` (${company})` : ''}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;color:#1c1206;">
            <h2 style="margin:0 0 12px;">New trial access request</h2>
            <p style="margin:4px 0;"><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p style="margin:4px 0;"><strong>Email:</strong> ${escapeHtml(email)}</p>
            ${company ? `<p style="margin:4px 0;"><strong>Company:</strong> ${escapeHtml(company)}</p>` : ''}
            ${phone ? `<p style="margin:4px 0;"><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
            <p style="margin:16px 0 0;font-size:13px;color:#71717a;">Reply to this email to reach them directly.</p>
          </div>`,
      });
    }
  } catch {
    // ignore email failures — request is already stored
  }

  return NextResponse.json({ ok: true });
}
