import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { name, company, phone, email } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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
            <p style="margin:4px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin:4px 0;"><strong>Email:</strong> ${email}</p>
            ${company ? `<p style="margin:4px 0;"><strong>Company:</strong> ${company}</p>` : ''}
            ${phone ? `<p style="margin:4px 0;"><strong>Phone:</strong> ${phone}</p>` : ''}
            <p style="margin:16px 0 0;font-size:13px;color:#71717a;">Reply to this email to reach them directly, or send their access code.</p>
          </div>`,
      });
    }
  } catch {
    // ignore email failures — request is already stored
  }

  return NextResponse.json({ ok: true });
}
