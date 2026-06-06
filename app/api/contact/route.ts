import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { name, email, company, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Please fill in name, email and message.' }, { status: 400 });
  }

  // Store the message (graceful if the table doesn't exist yet)
  try {
    const supabase = await createClient();
    await supabase.from('contact_messages').insert({
      name,
      email,
      company: company ?? null,
      message,
      created_at: new Date().toISOString(),
    });
  } catch {
    // ignore — don't break UX if table is missing
  }

  // Email the team if Resend is configured
  try {
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'TrialRoomStudio <onboarding@resend.dev>',
        to: process.env.CONTACT_TO_EMAIL ?? 'hello@trialroomstudio.com',
        replyTo: email,
        subject: `New contact form message from ${name}${company ? ` (${company})` : ''}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;color:#1c1206;">
            <h2 style="margin:0 0 12px;">New contact message</h2>
            <p style="margin:4px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin:4px 0;"><strong>Email:</strong> ${email}</p>
            ${company ? `<p style="margin:4px 0;"><strong>Company:</strong> ${company}</p>` : ''}
            <p style="margin:16px 0 4px;"><strong>Message:</strong></p>
            <p style="white-space:pre-wrap;background:#fafafa;border:1px solid #eee;border-radius:8px;padding:12px;">${message}</p>
          </div>`,
      });
    }
  } catch {
    // ignore email failures
  }

  return NextResponse.json({ ok: true });
}
