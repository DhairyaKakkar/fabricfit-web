import { Resend } from 'resend';

export async function sendWelcomeEmail({
  to,
  companyName,
  planId,
}: {
  to: string;
  companyName: string;
  planId: string;
}) {
  if (!process.env.RESEND_API_KEY) return; // skip if not configured yet
  const resend = new Resend(process.env.RESEND_API_KEY);
  const appUrl = process.env.PHONE_APP_URL ?? '#';
  const planLabel = { starter: 'Starter', pro: 'Pro', business: 'Business' }[planId] ?? planId;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'FabricFit <onboarding@resend.dev>',
    to,
    subject: `Welcome to FabricFit ${planLabel} — your access is ready`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#09090b;">
        <h1 style="font-size:22px;font-weight:700;margin-bottom:4px;">Welcome, ${companyName}!</h1>
        <p style="color:#71717a;font-size:14px;margin-top:0;">Your <strong>${planLabel}</strong> subscription is now active.</p>

        <div style="background:#fafafa;border:1px solid #e4e4e7;border-radius:12px;padding:20px;margin:24px 0;">
          <p style="margin:0 0 12px;font-size:14px;font-weight:600;">Access your FabricFit app</p>
          <a href="${appUrl}"
             style="display:inline-block;background:#09090b;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;">
            Open the app →
          </a>
        </div>

        <p style="font-size:13px;color:#71717a;">
          Sign in with the same email address: <strong>${to}</strong>
        </p>

        <hr style="border:none;border-top:1px solid #f4f4f5;margin:24px 0;" />

        <p style="font-size:12px;color:#a1a1aa;">
          Questions? Reply to this email or visit your
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="color:#09090b;">dashboard</a>.
        </p>
      </div>
    `,
  });
}
