import type { Post } from './types';

const post: Post = {
  slug: 'saree-virtual-try-on',
  title: 'Saree Virtual Try-On: Showing the Drape Before the First Pleat',
  metaTitle: 'Saree Virtual Try-On: See the Drape Before Buying',
  metaDescription:
    'Why sarees are the hardest garment to judge from a folded bolt, and how saree virtual try-on shows drape, pallu and pleats in seconds at the counter.',
  keywords: [
    'saree virtual try-on',
    'saree draping visualization',
    'saree showroom technology',
    'AI saree try-on',
  ],
  date: '2026-04-28',
  category: 'Garment Guides',
  funnel: 'middle',
  excerpt:
    'A folded saree hides everything that sells it — the drape, the pallu, the pleats. Here is how virtual try-on closes that gap for saree retailers.',
  intro: `
    <p>No garment loses more in the fold than a saree. On the shelf it is a flat rectangle of fabric; on the body it is pleats, a falling pallu, a border that travels diagonally across the figure, and a drape that behaves completely differently in silk than in georgette. Everything that makes a customer say yes is invisible until the saree is worn — which is exactly why saree counters run on staff draping sarees over their own shoulder, one at a time, all day.</p>
    <p>Saree virtual try-on solves the visualisation problem at its root: photograph the saree, and AI shows it fully draped on a model in 15–20 seconds, while the customer is still standing at the counter.</p>
    <p>This guide covers why sarees are uniquely hard to judge flat, how the AI handles different weaves, and a counter workflow that saree retailers can adopt this week.</p>
  `,
  sections: [
    {
      h2: 'Why a folded saree is the hardest sell in fabric retail',
      html: `
        <p>Three things define how a saree looks worn, and none of them are visible on the bolt:</p>
        <h3>The drape</h3>
        <p>How the fabric falls — stiff and structured, or soft and clinging — changes the entire silhouette. A customer touching the fabric gets a hint; seeing it draped is the only real answer.</p>
        <h3>The pallu</h3>
        <p>On the shelf, the pallu is just the decorated end of the fold. Worn, it is the visual centrepiece of the saree — its scale, its fall over the shoulder, how its design reads at full length. Customers routinely buy a saree for the body and are surprised by the pallu, or the reverse.</p>
        <h3>The pleats and border path</h3>
        <p>Pleating compresses the body design and repeats the border vertically at the front. A border that looks proportionate on the open fabric can dominate or vanish once pleated. The diagonal path of the border across the torso is impossible to picture from a flat view.</p>
        <p>Staff draping over a shoulder helps, but it shows the fabric on the wrong body, half-draped, for thirty seconds — and it physically limits how many sarees a customer can “see worn” per visit.</p>
      `,
    },
    {
      h2: 'How saree virtual try-on handles different fabrics',
      html: `
        <p>The reason modern AI try-on works for sarees is that it generates the drape from the fabric’s visual character rather than applying one template to everything. In practice:</p>
        <ul>
          <li><strong>Silks and brocades</strong> render with the structure and sheen the fabric carries — fuller pleats, a pallu that holds its shape, zari that catches light.</li>
          <li><strong>Cottons</strong> show the crisper, more architectural fall that cotton saree buyers are specifically looking for.</li>
          <li><strong>Georgettes and chiffons</strong> appear with the soft, flowing, body-following drape that defines them — the quality that is most impossible to guess from a folded bolt.</li>
        </ul>
        <p>The input is just a phone photo. The one discipline that matters: photograph the saree so the border and pallu are visible along with the body, in natural light, since those regions drive the generated drape. (Photo technique is covered in <a href="/blog/how-to-photograph-fabric-for-your-catalogue">how to photograph fabric for your catalogue</a>, and the underlying mechanics in <a href="/blog/how-does-ai-virtual-try-on-work">how AI virtual try-on works</a>.)</p>
        <p>The honest framing for customers: it is a faithful visualisation of how the saree reads when worn — colour at scale, border path, pallu presence, drape character — not a millimetre-accurate simulation of one specific draping style.</p>
      `,
    },
    {
      h2: 'The in-store workflow for saree retailers',
      html: `
        <p>The tool earns its keep at two specific moments in a saree sale:</p>
        <h3>The shortlisting moment</h3>
        <p>A customer has pulled out eight sarees and is drowning. Instead of draping each over a shoulder, generate the draped look for her top three on the in-store Android app — about a minute of total wait. Comparing three worn sarees side by side on a screen collapses the shortlist faster than any amount of shelf comparison.</p>
        <h3>The hesitation moment</h3>
        <p>She loves the fabric but cannot commit — usually because she cannot picture the pallu or worries the colour is “too much” at full length. The draped image answers exactly those doubts, in the 15–20 seconds before the doubt hardens into “let me think about it.” This moment is where try-on most directly moves sales; the broader pattern is covered in <a href="/blog/how-virtual-try-on-increases-showroom-sales">how virtual try-on increases showroom sales</a>.</p>
        <p>Then one tap shares the look to her WhatsApp. Even if she leaves without buying, she leaves with an image of herself-adjacent proof of the saree worn — which is a far stronger follow-up asset than a photo of a folded bolt.</p>
      `,
    },
    {
      h2: 'Beyond the counter: catalogue and remote saree sales',
      html: `
        <p>The same generated looks compound outside the store:</p>
        <ul>
          <li><strong>WhatsApp enquiries.</strong> “Do you have soft silks under ₹10,000?” gets answered with draped looks, not bolt photos — and draped looks get replies.</li>
          <li><strong>Outstation and NRI buyers.</strong> Sarees are bought remotely for weddings constantly. A draped visualisation is what makes a remote buyer comfortable committing without touching the fabric.</li>
          <li><strong>Website.</strong> If you sell online, the web embed adds try-on to Shopify, WooCommerce or any site with one line of code, so browsers can see any saree draped without messaging you.</li>
        </ul>
        <p>Each new saree takes seconds to add: photograph it on arrival, generate the draped look, file it. The catalogue grows as stock arrives instead of waiting for a photoshoot budget.</p>
      `,
    },
    {
      h2: 'What it costs and how to start',
      html: `
        <p>For a saree retailer the entry point is deliberately low:</p>
        <ul>
          <li><strong>Pay As You Go</strong> — ₹25 per try-on, no monthly commitment. Good for testing on your fastest-moving sarees.</li>
          <li><strong>Starter</strong> — ₹2,500/month for 200 try-ons, enough for daily counter use plus catalogue building.</li>
          <li><strong>Pro</strong> — ₹4,500/month for 400 try-ons with multi-staff access, for busy counters where several salespeople generate looks simultaneously.</li>
        </ul>
        <p>Signup includes a free demo try-on with no credit card, and setup takes under 20 minutes — no IT person, no agency. The fastest way to judge whether the drape quality meets your standard is to <a href="/#try-demo">run the demo in your browser</a> right now, then check <a href="/pricing">full pricing</a> or <a href="/contact">ask for a walkthrough with your own sarees</a>.</p>
      `,
    },
  ],
  faq: [
    {
      q: 'Does saree try-on work for heavily embroidered or zari sarees?',
      a: 'Yes. If the photograph shows the work clearly — shot in natural light, close enough that the zari and embroidery are visible — the generated drape carries it through. The source photo quality is the main factor.',
    },
    {
      q: 'Can the customer see the saree on her own photo?',
      a: 'The standard counter workflow drapes the saree on a model, which answers the core questions — drape, pallu, border path, colour at scale — without the customer needing any app or account.',
    },
    {
      q: 'How long does one saree try-on take?',
      a: 'About 15–20 seconds from the fabric photo, which is why it works mid-conversation at the counter rather than as a separate process.',
    },
    {
      q: 'Where do the generated saree images go?',
      a: 'They stay in your showroom’s own account, deletable anytime, and can be shared to a customer’s WhatsApp with one tap. The customer needs nothing installed to view them.',
    },
  ],
};

export default post;
