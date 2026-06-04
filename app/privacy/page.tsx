import type { Metadata } from 'next';
import Navbar from '@/components/nav/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy — TrialRoomStudio',
  description: 'How TrialRoomStudio collects, uses, and protects your personal data.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen pt-28 pb-24 px-6">
        <div className="max-w-3xl mx-auto">

          <div className="mb-12">
            <p
              className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3"
              style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.14em' }}
            >
              Legal
            </p>
            <h1
              className="text-4xl font-bold text-zinc-900 mb-3"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Privacy Policy
            </h1>
            <p className="text-sm text-zinc-400" style={{ fontFamily: 'var(--font-inter)' }}>
              Effective date: 1 June 2025 &nbsp;·&nbsp; Last updated: 4 June 2026
            </p>
            <div className="w-12 h-px bg-zinc-200 mt-6" />
          </div>

          <div className="prose prose-zinc max-w-none" style={{ fontFamily: 'var(--font-inter)' }}>

            <p className="text-sm text-zinc-600 leading-relaxed mb-8">
              TrialRoomStudio (&quot;<strong>we</strong>&quot;, &quot;<strong>us</strong>&quot;, or &quot;<strong>our</strong>&quot;) is an AI-powered virtual try-on platform. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you visit our website at <strong>trialroomstudio.com</strong> and use our platform (collectively, the &quot;<strong>Service</strong>&quot;).
            </p>
            <p className="text-sm text-zinc-600 leading-relaxed mb-8">
              By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree, please discontinue use of the Service immediately.
            </p>

            <Section title="1. Information We Collect">
              <Subsection title="1.1 Information You Provide Directly">
                <ul>
                  <li><strong>Account Registration:</strong> Company name, work email address, password (stored in hashed form), and the subscription plan you select.</li>
                  <li><strong>Payment Information:</strong> Billing details such as name, billing address, and payment card information. Card data is processed exclusively by our payment processor (Stripe) and is never stored on our servers.</li>
                  <li><strong>Try-On Content:</strong> Photographs or images you upload (customer photos, fabric swatches, garment images) for the purpose of generating AI-powered virtual try-on results.</li>
                  <li><strong>Support & Communications:</strong> Messages, emails, or WhatsApp communications you send to our team.</li>
                  <li><strong>Business Information:</strong> Showroom name, branch details, and fabric catalogue data you enter into the platform.</li>
                </ul>
              </Subsection>
              <Subsection title="1.2 Information Collected Automatically">
                <ul>
                  <li><strong>Usage Data:</strong> Pages visited, features used, time spent, click patterns, and navigation paths.</li>
                  <li><strong>Device & Browser Information:</strong> IP address, browser type and version, operating system, device identifiers, and screen resolution.</li>
                  <li><strong>Log Data:</strong> Server logs including timestamps, request paths, and error codes.</li>
                  <li><strong>Cookies & Local Storage:</strong> We use cookies and browser local storage to remember your currency preference, authentication session, and UI settings. See Section 7 for details.</li>
                  <li><strong>Approximate Location:</strong> We use your IP address to infer your country and automatically select the most relevant pricing currency. We do not collect precise GPS location.</li>
                </ul>
              </Subsection>
              <Subsection title="1.3 Information from Third Parties">
                <ul>
                  <li><strong>Authentication Providers:</strong> If you sign in using a supported OAuth provider, we receive a name, email address, and profile identifier from that provider.</li>
                  <li><strong>Payment Processor:</strong> Stripe may share transaction status, card type, and billing country with us.</li>
                </ul>
              </Subsection>
            </Section>

            <Section title="2. How We Use Your Information">
              <p>We use the information we collect for the following purposes:</p>
              <ul>
                <li><strong>Service Delivery:</strong> To create and manage your account, process payments, allocate credits, and generate AI virtual try-on results.</li>
                <li><strong>AI Model Processing:</strong> Images you upload are processed by our AI inference pipeline to produce virtual try-on outputs. Images may be temporarily cached on secure cloud infrastructure during processing and are subject to the retention policies in Section 6.</li>
                <li><strong>Billing & Subscriptions:</strong> To charge subscription fees, process credit top-ups, issue invoices, handle refunds, and enforce plan limits.</li>
                <li><strong>Platform Improvement:</strong> To analyse usage patterns, identify bugs, improve model accuracy, and develop new features. Aggregated and anonymised data may be used for research purposes in collaboration with NTU.</li>
                <li><strong>Communications:</strong> To send transactional emails (account creation, payment receipts, plan changes), product update announcements, and security alerts. You may opt out of marketing emails at any time.</li>
                <li><strong>Security & Fraud Prevention:</strong> To detect, investigate, and prevent abuse, unauthorised access, and fraudulent transactions.</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and enforceable government requests in Singapore and other jurisdictions where we operate.</li>
              </ul>
            </Section>

            <Section title="3. AI Processing and Virtual Try-On Data">
              <p>Our core Service involves processing photographs using artificial intelligence. We want to be transparent about this:</p>
              <ul>
                <li><strong>Image Processing:</strong> Customer photographs and fabric images you upload are sent to our AI inference servers to generate composite try-on images. These images are processed for the purpose specified by you (virtual try-on) and for no other purpose.</li>
                <li><strong>Biometric Data:</strong> Body shape estimations are derived from uploaded photographs to power the try-on feature. We do not create persistent biometric profiles tied to individuals.</li>
                <li><strong>Watermarked Output:</strong> On free-tier and PAYG plans, generated images carry a TrialRoomStudio watermark. Paid subscribers may remove the watermark as described in their plan.</li>
                <li><strong>You Remain Responsible:</strong> You are responsible for obtaining appropriate consent from individuals whose photographs you upload to our platform. You must ensure such individuals are aware that their images will be processed by AI systems.</li>
                <li><strong>No Training on Customer Data:</strong> We do not use the images or content you upload to train our general AI models without your explicit written consent.</li>
              </ul>
            </Section>

            <Section title="4. Sharing and Disclosure of Information">
              <p>We do not sell your personal information. We may share data in the following limited circumstances:</p>
              <ul>
                <li><strong>Service Providers:</strong> We engage trusted third-party vendors to operate our infrastructure, including cloud hosting (Amazon Web Services / Google Cloud), payment processing (Stripe), database services (Supabase), and email delivery (Resend). These vendors are contractually bound to process data only as instructed by us.</li>
                <li><strong>Research Partners:</strong> Anonymised, aggregated usage statistics may be shared with NTU for academic research purposes. No personally identifiable information is shared.</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required to do so by law, court order, or legitimate governmental authority in Singapore or applicable jurisdictions.</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of all or part of our business, your information may be transferred as part of that transaction. We will notify you via email and/or a prominent notice on the Service before your data is transferred.</li>
                <li><strong>Protection of Rights:</strong> We may disclose information to enforce our Terms and Conditions, protect the rights, property, or safety of TrialRoomStudio, our users, or the public.</li>
              </ul>
            </Section>

            <Section title="5. International Data Transfers">
              <p>
                Your data may be stored on servers located in India, the United States, or other countries where our cloud infrastructure providers operate. By using the Service, you consent to the transfer of your information to these countries, which may have different data protection laws than your country of residence.
              </p>
              <p>
                We rely on reputable cloud providers (including Amazon Web Services and Supabase) that maintain their own data-transfer safeguards. We choose providers that offer appropriate protections for personal data.
              </p>
            </Section>

            <Section title="6. Data Retention">
              <ul>
                <li><strong>Account Data:</strong> Retained for as long as your account is active, plus 90 days after account deletion to allow for dispute resolution.</li>
                <li><strong>Try-On History:</strong> Retained for the period specified by your plan (15 days for PAYG/free, 30 days for Starter, 90 days for Pro, 1 year for Business) from the date of creation. After this period, try-on images are permanently deleted.</li>
                <li><strong>Payment Records:</strong> Retained for 7 years to comply with Singapore financial regulations (Income Tax Act, GST Act).</li>
                <li><strong>Support Communications:</strong> Retained for 2 years from the date of the last interaction.</li>
                <li><strong>Anonymised Analytics:</strong> May be retained indefinitely in aggregated form.</li>
              </ul>
            </Section>

            <Section title="7. Cookies and Tracking Technologies">
              <p>We use the following types of cookies and local storage:</p>
              <ul>
                <li><strong>Strictly Necessary:</strong> Authentication tokens (managed via Supabase Auth) that keep you logged in. These cannot be disabled without breaking core functionality.</li>
                <li><strong>Preference:</strong> We store your selected currency (e.g., SGD, INR, AED, USD) in <code>localStorage</code> so you do not need to re-select it on each visit.</li>
                <li><strong>Analytics:</strong> If enabled, aggregated page-view analytics to help us understand usage patterns. We do not use Google Analytics or other third-party tracking pixels by default.</li>
              </ul>
              <p>You can clear cookies and local storage at any time through your browser settings. Note that doing so will log you out of the Service.</p>
            </Section>

            <Section title="8. Data Security">
              <p>We implement industry-standard technical and organisational measures to protect your data, including:</p>
              <ul>
                <li>TLS/HTTPS encryption for all data in transit.</li>
                <li>AES-256 encryption for sensitive data at rest.</li>
                <li>Role-based access controls (RBAC) limiting employee access to production data.</li>
                <li>Regular security audits and penetration testing.</li>
                <li>Passwords are hashed using bcrypt and are never stored in plaintext.</li>
                <li>Payment card data is handled exclusively by PCI-DSS compliant processors and never touches our servers.</li>
              </ul>
              <p>Despite our measures, no system is completely secure. We cannot guarantee absolute security, and you use the Service at your own risk.</p>
            </Section>

            <Section title="9. Your Rights">
              <p>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
              <ul>
                <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
                <li><strong>Deletion:</strong> Request deletion of your account and associated personal data, subject to legal retention obligations.</li>
                <li><strong>Portability:</strong> Request your data in a machine-readable format.</li>
                <li><strong>Objection / Restriction:</strong> Object to or request restriction of certain processing activities.</li>
                <li><strong>Withdraw Consent:</strong> Where processing is based on consent (e.g., marketing emails), withdraw that consent at any time.</li>
              </ul>
              <p>To exercise any of these rights, please contact us at <strong>privacy@trialroomstudio.com</strong> or via WhatsApp at <strong>+91 98847 44296</strong>. We will respond within 30 days.</p>
            </Section>

            <Section title="10. Children's Privacy">
              <p>
                The Service is intended for business use by professionals aged 18 and above. We do not knowingly collect personal information from individuals under the age of 18. If you believe a minor has provided us with personal information, please contact us immediately and we will delete such data.
              </p>
            </Section>

            <Section title="11. Links to Third-Party Websites">
              <p>
                Our website may contain links to third-party websites (e.g., WhatsApp, Stripe). We are not responsible for the privacy practices of those websites and encourage you to review their privacy policies. This Privacy Policy applies only to the TrialRoomStudio Service.
              </p>
            </Section>

            <Section title="12. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. When we make material changes, we will notify you by email (to the address on your account) and update the &quot;Last updated&quot; date at the top of this page. Your continued use of the Service after notification constitutes acceptance of the updated policy.
              </p>
            </Section>

            <Section title="13. Contact Us">
              <p>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
              <ul>
                <li><strong>Email:</strong> privacy@trialroomstudio.com</li>
                <li><strong>WhatsApp:</strong> +91 98847 44296</li>
              </ul>
              <p>We will respond to all data-related requests within 30 days.</p>
            </Section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2
        className="text-lg font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {title}
      </h2>
      <div className="text-sm text-zinc-600 leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3
        className="text-sm font-semibold text-zinc-800 mb-2"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        {title}
      </h3>
      <div className="text-sm text-zinc-600 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
