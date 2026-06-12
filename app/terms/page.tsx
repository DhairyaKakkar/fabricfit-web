import type { Metadata } from 'next';
import Navbar from '@/components/nav/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and Conditions governing use of the TrialRoomStudio virtual try-on platform.',
};

export default function TermsPage() {
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
              Terms &amp; Conditions
            </h1>
            <p className="text-sm text-zinc-400" style={{ fontFamily: 'var(--font-inter)' }}>
              Effective date: 1 June 2025 &nbsp;·&nbsp; Last updated: 4 June 2026
            </p>
            <div className="w-12 h-px bg-zinc-200 mt-6" />
          </div>

          <div className="prose prose-zinc max-w-none" style={{ fontFamily: 'var(--font-inter)' }}>

            <p className="text-sm text-zinc-600 leading-relaxed mb-8">
              These Terms and Conditions (&quot;<strong>Terms</strong>&quot;) constitute a legally binding agreement between you (&quot;<strong>User</strong>&quot;, &quot;<strong>you</strong>&quot;, or &quot;<strong>your</strong>&quot;) and the team behind TrialRoomStudio (&quot;<strong>TrialRoomStudio</strong>&quot;, &quot;<strong>we</strong>&quot;, &quot;<strong>us</strong>&quot;, or &quot;<strong>our</strong>&quot;). These Terms govern your access to and use of the TrialRoomStudio website at <strong>trialroomstudio.com</strong>, the web application, APIs, and any related services (collectively, the &quot;<strong>Service</strong>&quot;).
            </p>
            <p className="text-sm text-zinc-600 leading-relaxed mb-8">
              By creating an account, clicking &quot;I have read and agree to the Terms &amp; Conditions&quot;, or otherwise accessing or using the Service, you confirm that you are at least 18 years old, have the legal authority to enter into these Terms on behalf of yourself or your organisation, and agree to be bound by all provisions herein. If you do not agree to these Terms, you must not use the Service.
            </p>

            <Section title="1. Description of Service">
              <p>
                TrialRoomStudio provides an AI-powered virtual try-on platform designed for fabric showrooms, garment retailers, and textile businesses. The Service enables businesses to:
              </p>
              <ul>
                <li>Generate virtual try-on images combining customer photographs with fabric samples.</li>
                <li>Manage digital fabric catalogues and showroom branches.</li>
                <li>Export try-on results for marketing and customer presentations.</li>
                <li>Purchase subscription plans or credit packs for on-demand try-on generation.</li>
                <li>Top up credits mid-cycle when subscription credits are exhausted.</li>
              </ul>
              <p>
                The Service is intended for B2B (business-to-business) use. You are responsible for how you present try-on results to your end customers.
              </p>
            </Section>

            <Section title="2. Account Registration">
              <ul>
                <li><strong>Eligibility:</strong> You must be at least 18 years of age and represent a legitimate business to register an account.</li>
                <li><strong>Accurate Information:</strong> You agree to provide accurate, current, and complete information during registration and to keep it updated. Providing false information may result in immediate account termination.</li>
                <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your login credentials. You must notify us immediately at <strong>support@trialroomstudio.com</strong> if you suspect unauthorised access to your account.</li>
                <li><strong>One Account per Business:</strong> Each business entity may register one account. Branch access may be managed within a single account according to your plan limits.</li>
                <li><strong>Account Sharing:</strong> You may not share your account credentials with third parties outside your organisation.</li>
              </ul>
            </Section>

            <Section title="3. Free Trial">
              <ul>
                <li>New accounts receive one complimentary demo try-on (2 credits) at no charge. Additional trial credits may be granted on request, at TrialRoomStudio&apos;s discretion.</li>
                <li>No payment card is required to start a free trial.</li>
                <li>At the end of the free trial, your account automatically converts to Pay As You Go (PAYG) status unless you select a paid plan.</li>
                <li>Free trial credits that are unused at the end of the trial period expire and cannot be carried over.</li>
                <li>TrialRoomStudio reserves the right to modify or discontinue the free trial offer at any time without notice.</li>
                <li>Free trial accounts are subject to the PAYG plan limitations including TrialRoomStudio watermark on all outputs, 15-day try-on history, and no catalogue exports.</li>
              </ul>
            </Section>

            <Section title="4. Subscription Plans and Billing">
              <Subsection title="4.1 Plans">
                <p>We offer the following plan types: Pay As You Go (PAYG), Starter, Pro, and Business. Plan features, credit allocations, and pricing are described at <strong>trialroomstudio.com/pricing</strong> and are subject to change with 30 days' notice to existing subscribers.</p>
              </Subsection>
              <Subsection title="4.2 Credit System">
                <ul>
                  <li>The Service operates on a credit system. Credits are consumed each time you generate a virtual try-on output.</li>
                  <li><strong>Subscription Credits:</strong> Reset on your billing cycle date (not the 1st of the month). Unused subscription credits do not roll over to the next billing cycle and are forfeited upon reset.</li>
                  <li><strong>Top-Up Pack Credits:</strong> Credits purchased as standalone top-up packs (50, 100, 200, or 500 credit packs) never expire and stack with your subscription credits.</li>
                  <li><strong>Credit Consumption:</strong> Approximate credit rates per try-on type are shown on the pricing page and in the application. We reserve the right to adjust credit rates with 14 days' notice.</li>
                </ul>
              </Subsection>
              <Subsection title="4.3 Billing and Payment">
                <ul>
                  <li>Subscription fees are billed in advance on a monthly or annual basis, depending on the billing cycle you select.</li>
                  <li>All prices are displayed in your selected currency (SGD, INR, AED, or USD). Prices are inclusive of applicable taxes where required by law.</li>
                  <li>Payment is processed by Stripe. By providing payment details, you authorise us to charge the applicable fees.</li>
                  <li>Annual subscriptions are billed as a single lump sum at the start of the billing period.</li>
                  <li>If payment fails, we will retry up to three times over 7 days. If payment remains unsuccessful, your account may be downgraded or suspended.</li>
                </ul>
              </Subsection>
              <Subsection title="4.4 Refund Policy">
                <ul>
                  <li><strong>Subscriptions:</strong> Monthly subscriptions are non-refundable once a billing cycle has commenced. Annual subscriptions may be eligible for a pro-rated refund if cancelled within 14 days of the billing date, provided fewer than 20% of allocated credits have been used. Refund requests must be submitted to <strong>billing@trialroomstudio.com</strong>.</li>
                  <li><strong>Credit Packs:</strong> Credit packs are non-refundable once purchased, except where required by applicable consumer protection law.</li>
                  <li><strong>Service Downtime:</strong> In the event of significant platform downtime (exceeding 24 consecutive hours and directly caused by TrialRoomStudio), we may, at our discretion, issue credit compensation.</li>
                </ul>
              </Subsection>
              <Subsection title="4.5 Plan Changes and Cancellations">
                <ul>
                  <li>You may upgrade your plan at any time; the upgrade takes effect immediately and you will be charged a pro-rated amount for the remainder of the billing cycle.</li>
                  <li>Downgrading a plan takes effect at the next billing cycle. Features associated with the higher-tier plan remain accessible until the end of the current billing period.</li>
                  <li>You may cancel your subscription at any time from your account dashboard. Cancellation takes effect at the end of the current billing period. Your account will revert to PAYG status.</li>
                </ul>
              </Subsection>
            </Section>

            <Section title="5. Acceptable Use Policy">
              <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You must not:</p>
              <ul>
                <li>Upload images of individuals without their consent, or use the Service to process images that violate any person's privacy, dignity, or rights.</li>
                <li>Upload, generate, or distribute content that is obscene, defamatory, harassing, discriminatory, or otherwise unlawful.</li>
                <li>Use the Service to generate images that misrepresent products or deceive consumers in a manner that violates applicable consumer protection laws.</li>
                <li>Attempt to reverse-engineer, decompile, disassemble, or otherwise extract the source code, AI models, or proprietary algorithms underlying the Service.</li>
                <li>Use automated bots, scrapers, or scripts to access the Service in a manner that places an unreasonable load on our infrastructure.</li>
                <li>Resell, sublicense, or redistribute access to the Service or generated outputs as a standalone product without our prior written consent.</li>
                <li>Attempt to circumvent plan limits, credit consumption, or access controls through technical means.</li>
                <li>Violate any applicable laws or regulations, including but not limited to data protection laws, intellectual property laws, and advertising standards.</li>
              </ul>
              <p>
                Violation of this Acceptable Use Policy may result in immediate suspension or termination of your account without refund.
              </p>
            </Section>

            <Section title="6. Content and Intellectual Property">
              <Subsection title="6.1 Your Content">
                <p>You retain ownership of all images, fabric catalogues, and other content you upload to the Service (&quot;<strong>Your Content</strong>&quot;). By uploading content, you grant TrialRoomStudio a non-exclusive, worldwide, royalty-free licence to process, reproduce, and display Your Content solely for the purpose of providing the Service to you.</p>
              </Subsection>
              <Subsection title="6.2 AI-Generated Outputs">
                <p>Virtual try-on images generated by the Service using Your Content are owned by you, subject to the following conditions:</p>
                <ul>
                  <li>Generated images on free and PAYG plans carry a TrialRoomStudio watermark. Removal of this watermark without an eligible plan or add-on is a breach of these Terms.</li>
                  <li>You are solely responsible for ensuring you have the right to use any underlying fabric, garment, or photographic content when generating outputs.</li>
                  <li>You must not use AI-generated outputs in a manner that deceives or misleads consumers about the actual characteristics of a product.</li>
                </ul>
              </Subsection>
              <Subsection title="6.3 TrialRoomStudio Intellectual Property">
                <p>The Service, including its software, AI models, algorithms, design, trademarks, and brand assets, is the exclusive property of TrialRoomStudio Pte. Ltd. and its licensors. Nothing in these Terms grants you any right to use our trademarks, logos, or brand names without our prior written consent.</p>
              </Subsection>
            </Section>

            <Section title="7. Third-Party Services">
              <p>The Service integrates with third-party providers including Stripe (payments), Supabase (database and authentication), and cloud infrastructure providers. Your use of these third-party services is subject to their respective terms of service. We are not responsible for the actions, omissions, or privacy practices of any third-party service provider.</p>
            </Section>

            <Section title="8. Service Availability and Changes">
              <ul>
                <li>We aim to maintain 99.5% uptime but do not guarantee uninterrupted access to the Service.</li>
                <li>We reserve the right to modify, suspend, or discontinue any feature of the Service at any time, with reasonable notice where possible.</li>
                <li>Scheduled maintenance will be communicated via the platform or email where reasonably practicable.</li>
                <li>We reserve the right to update pricing with 30 days' prior written notice to active subscribers. Continued use of the Service after the effective date constitutes acceptance of the new pricing.</li>
              </ul>
            </Section>

            <Section title="9. Disclaimers">
              <p>
                THE SERVICE IS PROVIDED ON AN &quot;<strong>AS IS</strong>&quot; AND &quot;<strong>AS AVAILABLE</strong>&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p>
                We do not warrant that: (a) the Service will be error-free or uninterrupted; (b) AI-generated try-on results will be perfectly accurate or match actual physical garment outcomes; (c) the Service will meet your specific business requirements. Virtual try-on results are computer-generated approximations and should not be relied upon as definitive representations of the actual physical product.
              </p>
            </Section>

            <Section title="10. Limitation of Liability">
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, TRIALROOMSTUDIO SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, GOODWILL, OR BUSINESS INTERRUPTION, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.
              </p>
              <p>
                IN NO EVENT SHALL TRIALROOMSTUDIO&apos;S TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICE EXCEED THE AMOUNT YOU PAID TO TRIALROOMSTUDIO IN THE 12 MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM.
              </p>
              <p>
                Some jurisdictions do not allow the exclusion or limitation of certain damages, so the above limitations may not apply to you.
              </p>
            </Section>

            <Section title="11. Indemnification">
              <p>
                You agree to indemnify, defend, and hold harmless TrialRoomStudio and the individuals behind it from and against any claims, liabilities, damages, judgements, awards, losses, costs, expenses, or fees (including reasonable legal fees) arising out of or relating to: (a) your violation of these Terms; (b) Your Content; (c) your use of the Service in a manner not authorised by these Terms; or (d) your violation of any applicable law or the rights of any third party.
              </p>
            </Section>

            <Section title="12. Termination">
              <ul>
                <li>You may terminate your account at any time from your account dashboard or by contacting us at <strong>support@trialroomstudio.com</strong>.</li>
                <li>We may suspend or terminate your account immediately if you breach any material provision of these Terms, engage in fraudulent activity, or if required by law.</li>
                <li>Upon termination: (a) all licences granted to you under these Terms cease immediately; (b) your access to the Service is revoked; (c) unused subscription credits are forfeited; (d) unused top-up pack credits are forfeited without refund if the account was terminated for cause.</li>
                <li>Sections relating to intellectual property, disclaimers, limitation of liability, indemnification, and governing law survive termination.</li>
              </ul>
            </Section>

            <Section title="13. Governing Law and Dispute Resolution">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
              </p>
              <p>
                Any dispute, controversy, or claim arising out of or relating to these Terms or the Service shall first be attempted to be resolved through good-faith negotiation between the parties. If negotiation fails within 30 days, the dispute shall be subject to the exclusive jurisdiction of the courts located in India.
              </p>
              <p>
                Either party may seek injunctive or other equitable relief in a court of competent jurisdiction to prevent irreparable harm.
              </p>
            </Section>

            <Section title="14. General Provisions">
              <ul>
                <li><strong>Entire Agreement:</strong> These Terms, together with the Privacy Policy and any plan-specific terms, constitute the entire agreement between you and TrialRoomStudio regarding the Service.</li>
                <li><strong>Severability:</strong> If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.</li>
                <li><strong>Waiver:</strong> Failure to enforce any provision of these Terms shall not constitute a waiver of our right to enforce it in the future.</li>
                <li><strong>Assignment:</strong> You may not assign or transfer your rights or obligations under these Terms without our prior written consent. We may assign our rights and obligations without restriction.</li>
                <li><strong>Force Majeure:</strong> Neither party shall be liable for delays or failures in performance caused by events beyond their reasonable control, including natural disasters, government actions, internet outages, or AI infrastructure failures.</li>
              </ul>
            </Section>

            <Section title="15. Changes to These Terms">
              <p>
                We reserve the right to modify these Terms at any time. When we make material changes, we will notify you by email (at the address on your account) and display a prominent notice on the Service at least 14 days before the changes take effect. Your continued use of the Service after the effective date constitutes acceptance of the revised Terms. If you do not agree to the revised Terms, you must stop using the Service before the effective date.
              </p>
            </Section>

            <Section title="16. Contact Information">
              <p>For questions about these Terms, please contact us:</p>
              <ul>
                <li><strong>Email:</strong> legal@trialroomstudio.com</li>
                <li><strong>Support:</strong> support@trialroomstudio.com</li>
                <li><strong>WhatsApp:</strong> +91 98847 44296</li>
              </ul>
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
