import { nanoid } from 'nanoid';
import type { Slide, ContentBlock, SlideLayout } from '@/types/presentation';

// ─────────────────────────────────────────────────
// Sample Deck Interface
// ─────────────────────────────────────────────────

export interface SampleDeck {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'education' | 'creative';
  themeId: string;
  slideCount: number;
  accentColor: string;
  slides: Slide[];
}

// ─────────────────────────────────────────────────
// Helper functions (same pattern as templates)
// ─────────────────────────────────────────────────

function textBlock(
  content: string,
  textStyle: 'title' | 'subtitle' | 'heading' | 'body' | 'caption',
  alignment: 'left' | 'center' | 'right',
  position: { x: number; y: number; width: number; height: number },
): ContentBlock {
  return {
    id: `block_${nanoid(8)}`,
    type: 'text',
    content,
    textStyle,
    alignment,
    position,
  };
}

function listBlock(
  variant: 'bullet' | 'numbered' | 'checklist',
  items: string[],
  position: { x: number; y: number; width: number; height: number },
): ContentBlock {
  return {
    id: `block_${nanoid(8)}`,
    type: 'list',
    variant,
    items: items.map((text) => ({ id: `item_${nanoid(6)}`, text })),
    position,
  };
}

function imageBlock(
  alt: string,
  query: string,
  position: { x: number; y: number; width: number; height: number },
): ContentBlock {
  return {
    id: `block_${nanoid(8)}`,
    type: 'image',
    src: '',
    alt,
    query,
    position,
  };
}

function chartBlock(
  chartType: 'bar' | 'line' | 'pie' | 'donut',
  data: Array<{ label: string; value: number; color?: string }>,
  position: { x: number; y: number; width: number; height: number },
  title?: string,
): ContentBlock {
  return {
    id: `block_${nanoid(8)}`,
    type: 'chart',
    chartType,
    data,
    title,
    position,
  };
}

function iconListBlock(
  items: Array<{ icon: string; title: string; description: string }>,
  columns: 2 | 3 | 4,
  position: { x: number; y: number; width: number; height: number },
): ContentBlock {
  return {
    id: `block_${nanoid(8)}`,
    type: 'icon-list',
    items: items.map((item) => ({ id: `item_${nanoid(6)}`, ...item })),
    columns,
    position,
  };
}

function quoteBlock(
  text: string,
  attribution: string,
  position: { x: number; y: number; width: number; height: number },
): ContentBlock {
  return {
    id: `block_${nanoid(8)}`,
    type: 'quote',
    text,
    attribution,
    position,
  };
}

function timelineBlock(
  items: Array<{ title: string; description: string; date?: string }>,
  orientation: 'horizontal' | 'vertical',
  position: { x: number; y: number; width: number; height: number },
): ContentBlock {
  return {
    id: `block_${nanoid(8)}`,
    type: 'timeline',
    items: items.map((item) => ({ id: `item_${nanoid(6)}`, ...item })),
    orientation,
    position,
  };
}

function slide(
  layout: SlideLayout,
  index: number,
  content: ContentBlock[],
  speakerNotes = '',
): Slide {
  return {
    id: `slide_${nanoid(8)}`,
    index,
    layout,
    content,
    background: { type: 'solid', value: '' },
    speakerNotes,
  };
}

// ─────────────────────────────────────────────────
// Sample 1: The Future of AI in Healthcare
// Theme: Forest | Category: Education | 6 slides
// ─────────────────────────────────────────────────

const aiHealthcare: SampleDeck = {
  id: 'ai-healthcare',
  name: 'The Future of AI in Healthcare',
  description: 'An in-depth look at how artificial intelligence is transforming diagnostics, drug discovery, and patient care across the global healthcare industry.',
  category: 'education',
  themeId: 'forest',
  slideCount: 6,
  accentColor: '#16A34A',
  slides: [
    slide('title', 0, [
      textBlock('The Future of AI in Healthcare', 'title', 'center', { x: 10, y: 25, width: 80, height: 20 }),
      textBlock('How Machine Learning Is Reshaping Diagnostics, Drug Discovery, and Patient Care', 'subtitle', 'center', { x: 15, y: 50, width: 70, height: 12 }),
      textBlock('2025 Industry Overview', 'caption', 'center', { x: 25, y: 66, width: 50, height: 6 }),
    ], 'Welcome the audience. Frame this as a look at where AI in healthcare stands today and where it is headed over the next decade.'),

    slide('title-content', 1, [
      textBlock('The Healthcare AI Landscape', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'Artificial intelligence is no longer experimental in healthcare. It is embedded in clinical workflows at the world\'s largest hospital systems and is accelerating research timelines at pharmaceutical companies from months to weeks.\n\nThe global healthcare AI market reached $20.9 billion in 2024 and is projected to surpass $148 billion by 2029, growing at a CAGR of 48.1% according to Markets and Markets. Over 520 AI-enabled medical devices have received FDA clearance as of early 2025, spanning radiology, cardiology, pathology, and ophthalmology.\n\nThis shift is driven by three converging forces: exponential growth in clinical data, dramatic improvements in model accuracy, and increasing regulatory clarity around AI-assisted decision-making.',
        'body', 'left', { x: 5, y: 22, width: 90, height: 70 },
      ),
    ], 'Set context with the macro numbers. Emphasize that this is not a future trend but a present reality.'),

    slide('two-column', 2, [
      textBlock('Key Applications', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'Medical Diagnostics\n\nGoogle DeepMind\'s AlphaFold has predicted the 3D structure of over 200 million proteins, accelerating drug target identification. PathAI\'s algorithms detect breast cancer metastases with 99.3% sensitivity in lymph node biopsies, outperforming pathologists in clinical trials.\n\nDrug Discovery\n\nInsilico Medicine advanced its AI-discovered drug INS018_055 for idiopathic pulmonary fibrosis to Phase II clinical trials in under 30 months, a process that typically takes 4-6 years. Recursion Pharmaceuticals uses computer vision across 22 petabytes of biological data to identify novel drug candidates.',
        'body', 'left', { x: 5, y: 22, width: 42, height: 70 },
      ),
      textBlock(
        'Patient Monitoring\n\nCurrent Health (acquired by Best Buy Health) deploys continuous RPM wearables that track SpO2, heart rate, temperature, and movement, reducing hospital readmissions by 38% in post-surgical patients.\n\nAdministrative Automation\n\nNuance\'s DAX Copilot, used by over 550,000 physicians, auto-generates clinical notes from patient conversations, saving an average of 7 minutes per encounter. Olive AI processes prior authorizations 10x faster than manual review.\n\nMental Health\n\nWoebot Health delivers CBT-based interventions through conversational AI, with RCTs showing clinically significant reductions in depression symptoms within two weeks.',
        'body', 'left', { x: 53, y: 22, width: 42, height: 70 },
      ),
    ], 'Walk through each application with specific company examples. Emphasize that these are deployed systems, not lab experiments.'),

    slide('title-content', 3, [
      textBlock('Market Growth and Investment', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      chartBlock('bar', [
        { label: '2021', value: 6.7, color: '#16A34A' },
        { label: '2022', value: 10.3, color: '#22C55E' },
        { label: '2023', value: 14.6, color: '#16A34A' },
        { label: '2024', value: 20.9, color: '#22C55E' },
        { label: '2025 (est)', value: 31.5, color: '#16A34A' },
        { label: '2029 (proj)', value: 148.4, color: '#15803D' },
      ], { x: 5, y: 20, width: 55, height: 72 }, 'Global Healthcare AI Market Size ($B)'),
      textBlock(
        'Venture funding in healthcare AI totaled $11.2 billion in 2024, with notable rounds including:\n\n- Tempus AI: $6.1B IPO valuation (genomic data + AI)\n- Viz.ai: $100M Series D (stroke detection)\n- Abridge: $150M Series C (clinical documentation)\n- Hippocratic AI: $53M Series A (patient-facing generative AI)\n\nThe FDA\'s evolving framework for AI/ML-based SaMD (Software as a Medical Device) is unlocking enterprise adoption by providing a clear path to market.',
        'body', 'left', { x: 63, y: 20, width: 32, height: 72 },
      ),
    ], 'Highlight the exponential growth curve. Mention that regulatory clarity is a key unlock for enterprise adoption.'),

    slide('title-content', 4, [
      textBlock('Challenges and Ethical Considerations', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      iconListBlock([
        {
          icon: 'shield',
          title: 'Data Privacy and Security',
          description: 'HIPAA compliance, cross-border data flows, and patient consent remain complex. The EU AI Act classifies most healthcare AI as "high risk," requiring extensive documentation and human oversight.',
        },
        {
          icon: 'scale',
          title: 'Algorithmic Bias',
          description: 'A 2023 Stanford study found that dermatology AI models trained primarily on lighter skin tones showed 15-25% lower accuracy for patients with darker skin. Diverse training data and rigorous auditing are essential.',
        },
        {
          icon: 'users',
          title: 'Physician Trust and Adoption',
          description: 'A 2024 AMA survey found that 65% of physicians see AI positively but only 38% trust it enough to change clinical decisions. Explainability and integration into existing EHR workflows are critical adoption levers.',
        },
        {
          icon: 'globe',
          title: 'Global Access and Equity',
          description: 'AI tools concentrated in wealthy health systems risk widening the care gap. Organizations like PATH and Dimagi are building open-source diagnostic AI for low-resource settings in sub-Saharan Africa and South Asia.',
        },
      ], 2, { x: 5, y: 20, width: 90, height: 72 }),
    ], 'Spend time on this slide. Acknowledge the real challenges and frame them as solvable but requiring intentional effort.'),

    slide('section-header', 5, [
      textBlock('What Comes Next', 'title', 'center', { x: 10, y: 15, width: 80, height: 15 }),
      textBlock(
        'By 2030, AI will not replace physicians. It will make every physician dramatically more effective. The winners will be health systems that treat AI as a clinical partner, invest in data infrastructure, and build trust through transparency.\n\nThree predictions for the next five years:\n1. Foundation models trained on multimodal clinical data will become standard in radiology and pathology.\n2. AI-first drug companies will bring 10+ novel molecules to Phase III, cutting average development costs by 40%.\n3. Ambient clinical intelligence will eliminate 80% of documentation burden, giving doctors an extra hour per day with patients.',
        'body', 'center', { x: 10, y: 38, width: 80, height: 55 },
      ),
    ], 'End with a forward-looking, optimistic-but-grounded view. Invite questions.'),
  ],
};

// ─────────────────────────────────────────────────
// Sample 2: MindFlow Series A Pitch
// Theme: Midnight | Category: Business | 8 slides
// ─────────────────────────────────────────────────

const mindflowPitch: SampleDeck = {
  id: 'mindflow-pitch',
  name: 'MindFlow Series A Pitch',
  description: 'Series A fundraising deck for MindFlow, a meditation and mental health app combining neuroscience-backed techniques with AI personalization.',
  category: 'business',
  themeId: 'midnight',
  slideCount: 8,
  accentColor: '#60A5FA',
  slides: [
    slide('title', 0, [
      textBlock('MindFlow', 'title', 'center', { x: 10, y: 25, width: 80, height: 20 }),
      textBlock('AI-Personalized Mental Wellness That Actually Sticks', 'subtitle', 'center', { x: 15, y: 50, width: 70, height: 10 }),
      textBlock('Series A | Confidential | February 2026', 'caption', 'center', { x: 25, y: 65, width: 50, height: 6 }),
    ], 'Introduce MindFlow with confidence. This slide should feel premium and calm, matching the product\'s positioning.'),

    slide('title-content', 1, [
      textBlock('The Problem', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'Mental health is the defining health crisis of this generation, and existing solutions are failing.\n\n1 in 5 adults in the U.S. experience a mental health condition each year, yet the average wait time to see a therapist is 48 days. 77% of counties in the U.S. have a severe shortage of mental health professionals.\n\nMeditation apps promised to fill the gap. They haven\'t. The top 5 meditation apps average 87% churn within the first 30 days. The reason is simple: generic 10-minute sessions don\'t meet people where they are. A new parent with sleep deprivation anxiety needs fundamentally different support than a CEO managing burnout.\n\nThe $7.3 billion mental wellness app market is growing at 15% annually, but retention remains broken. The company that solves personalization wins the category.',
        'body', 'left', { x: 5, y: 22, width: 90, height: 70 },
      ),
    ], 'Lead with the scale of the problem, then narrow to why current solutions fail. The retention stat is the key insight.'),

    slide('content-image-right', 2, [
      textBlock('The Solution', 'heading', 'left', { x: 5, y: 5, width: 45, height: 12 }),
      textBlock(
        'MindFlow is the first mental wellness app that adapts in real time to your emotional state, energy level, and life context.\n\nOur proprietary Adaptive Wellness Engine uses a combination of biometric signals (Apple Watch, Oura Ring), behavioral patterns, and self-reported mood data to dynamically generate personalized sessions.\n\nInstead of choosing from a static library, you open MindFlow and it already knows what you need: a 4-minute breathing exercise before your board meeting, a body scan for your commute home, or a sleep story tuned to your current stress level.\n\nContent is created by licensed clinical psychologists and narrated by professionals, then assembled dynamically using our AI engine.',
        'body', 'left', { x: 5, y: 22, width: 45, height: 70 },
      ),
      imageBlock('MindFlow app interface showing personalized session', 'meditation app mobile interface dark mode calming', { x: 55, y: 5, width: 40, height: 87 }),
    ], 'Explain the core differentiator clearly. The Adaptive Wellness Engine is the technical moat.'),

    slide('content-image-right', 3, [
      textBlock('Product Experience', 'heading', 'left', { x: 5, y: 5, width: 45, height: 12 }),
      textBlock(
        'Morning Check-In\nA 30-second mood and energy assessment that tunes your entire day of recommendations. No typing needed, just intuitive swipe-based input.\n\nAdaptive Sessions\nSessions range from 2 to 45 minutes. The AI adjusts pacing, background audio, and technique based on your real-time heart rate variability when connected to a wearable.\n\nProgress Insights\nWeekly Wellness Reports show trends in stress, sleep quality, and emotional resilience. Powered by validated clinical measures (PHQ-9, GAD-7) embedded naturally into the experience.\n\nCommunity Circles\nSmall-group guided sessions (8-12 people) matched by shared goals: managing grief, workplace stress, new parenthood, or chronic pain.',
        'body', 'left', { x: 5, y: 22, width: 45, height: 70 },
      ),
      imageBlock('MindFlow progress dashboard and weekly insights', 'health analytics dashboard mobile app wellness data', { x: 55, y: 5, width: 40, height: 87 }),
    ], 'Walk through the user journey. Highlight how each feature ties back to personalization and retention.'),

    slide('title-content', 4, [
      textBlock('Market Opportunity', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'TAM: $121 Billion\nGlobal behavioral health market including therapy, digital therapeutics, and wellness apps. Growing at 11.2% CAGR through 2030 (Grand View Research).\n\nSAM: $7.3 Billion\nMental wellness and meditation app market. Includes Calm ($2B+ valuation), Headspace (merged with Ginger/Headspace Health), and emerging players.\n\nSOM: $730 Million\nEnglish-speaking premium wellness consumers aged 22-55 who have tried and churned from at least one meditation app. Our ideal early adopter: health-conscious, wearable-connected, willing to pay $14.99/month for something that works.\n\nThe enterprise mental health benefit market adds a $4.2B adjacent opportunity. Employers spend an average of $15,000 per employee annually on mental-health-related productivity loss (WHO). MindFlow for Teams launches Q3 2026.',
        'body', 'left', { x: 5, y: 22, width: 90, height: 70 },
      ),
    ], 'Frame the market with TAM/SAM/SOM. Emphasize the enterprise opportunity as a future growth vector.'),

    slide('title-content', 5, [
      textBlock('Traction', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      listBlock('bullet', [
        '$2.4M ARR as of January 2026, up from $680K twelve months ago (253% YoY growth)',
        '180,000 registered users with 42,000 monthly active users (23% MAU/total ratio)',
        '62% Day-30 retention, 3.2x the industry average of 13% for meditation apps',
        'Net Revenue Retention of 118% driven by annual plan upgrades and family plan adoption',
        '4.8-star average rating across 14,200 App Store reviews; featured in "Apps We Love" twice',
        'LTV:CAC ratio of 4.7x ($196 LTV on $42 blended CAC); payback period under 3 months',
        'Strategic partnerships with Oura (wearable integration) and Aetna (pilot with 2,000 members)',
        '12 enterprise pilots in progress including Deloitte, Shopify, and Stripe',
      ], { x: 5, y: 22, width: 90, height: 65 }),
    ], 'Hit every number confidently. The Day-30 retention stat is the hero metric. Let it land.'),

    slide('two-column', 6, [
      textBlock('The Team', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'Dr. Priya Nair — CEO & Co-Founder\n\nClinical psychologist (Stanford PhD). Previously led digital therapeutics at Ginger/Headspace Health where she scaled the clinical program from 50K to 1.2M users. Published 18 peer-reviewed papers on digital mental health interventions.\n\nMarcus Chen — CTO & Co-Founder\n\nFormer ML engineering lead at Spotify\'s personalization team. Built the recommendation system that drives 35% of Spotify\'s total listening hours. MIT EECS. Holds 4 patents in adaptive content delivery.',
        'body', 'left', { x: 5, y: 22, width: 42, height: 70 },
      ),
      textBlock(
        'Sarah Kim — VP Product\n\nLed consumer product at Calm for 3 years. Oversaw the launch of Calm Health (B2B) and Daily Calm, which grew to 4M daily listens. Previously product at Instagram (Wellbeing team).\n\nTeam: 34 People\n\n14 Engineering, 6 Clinical Content, 5 Product & Design, 4 Data Science, 3 Marketing, 2 Operations. Advisory board includes Dr. Judson Brewer (Brown University, habit neuroscience) and the former Chief Medical Officer of Headspace.',
        'body', 'left', { x: 53, y: 22, width: 42, height: 70 },
      ),
    ], 'The team slide sells credibility. Emphasize relevant domain experience at Spotify (personalization), Headspace (mental health), and Calm (product).'),

    slide('section-header', 7, [
      textBlock('The Ask', 'title', 'center', { x: 10, y: 18, width: 80, height: 15 }),
      textBlock(
        'Raising $18M Series A\n\nLed by a partner who believes mental health personalization is a generational opportunity.\n\nUse of Funds\n40% Engineering & AI (expand ML team, real-time biometric models, voice AI)\n25% Growth (scale proven acquisition channels: podcast, influencer, Apple Search Ads)\n20% Clinical & Content (triple content library, pursue FDA SaMD pathway for anxiety module)\n15% Enterprise GTM (sales team buildout for MindFlow for Teams)\n\nMilestones to Series B (18 months)\n- $12M ARR with 500K MAU\n- 3 enterprise contracts > $200K ACV\n- FDA Breakthrough Device designation for anxiety module\n- International expansion: UK, Canada, Australia',
        'body', 'center', { x: 12, y: 38, width: 76, height: 55 },
      ),
    ], 'Close strong. State the raise amount, use of funds, and what success looks like. Leave time for Q&A.'),
  ],
};

// ─────────────────────────────────────────────────
// Sample 3: 2025 Year in Review
// Theme: Coral | Category: Business | 6 slides
// ─────────────────────────────────────────────────

const yearInReview: SampleDeck = {
  id: 'year-in-review',
  name: '2025 Year in Review',
  description: 'Annual performance review for Meridian Analytics, a B2B SaaS company, covering revenue, customer growth, product milestones, team culture, and 2026 goals.',
  category: 'business',
  themeId: 'coral',
  slideCount: 6,
  accentColor: '#F43F5E',
  slides: [
    slide('title', 0, [
      textBlock('Meridian Analytics', 'title', 'center', { x: 10, y: 22, width: 80, height: 18 }),
      textBlock('2025 Year in Review', 'subtitle', 'center', { x: 20, y: 45, width: 60, height: 10 }),
      textBlock('Presented to the Board of Directors | January 2026', 'caption', 'center', { x: 20, y: 60, width: 60, height: 6 }),
    ], 'Open with energy. 2025 was a breakout year. Set the tone.'),

    slide('title-content', 1, [
      textBlock('Revenue Highlights', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      chartBlock('bar', [
        { label: 'Q1', value: 3.1, color: '#F43F5E' },
        { label: 'Q2', value: 3.8, color: '#FB7185' },
        { label: 'Q3', value: 4.6, color: '#F43F5E' },
        { label: 'Q4', value: 5.7, color: '#E11D48' },
      ], { x: 5, y: 20, width: 50, height: 50 }, 'Quarterly ARR ($M)'),
      textBlock(
        'Full-year ARR grew from $2.6M to $5.7M, representing 119% year-over-year growth. We crossed the $5M ARR milestone in November, 4 months ahead of plan.\n\nKey revenue drivers:\n- Enterprise segment grew 184% ($3.4M ARR, 60% of total)\n- Average contract value increased from $18K to $31K\n- Net Revenue Retention hit 132%, up from 108% in 2024\n- Monthly gross churn decreased from 3.2% to 1.4%\n\nGross margin improved from 71% to 78% as we migrated infrastructure to a more efficient multi-tenant architecture.',
        'body', 'left', { x: 58, y: 20, width: 37, height: 72 },
      ),
    ], 'Lead with the numbers. The 119% growth rate and enterprise segment strength are the headlines.'),

    slide('title-content', 2, [
      textBlock('Customer Growth', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'We started 2025 with 84 paying customers. We ended with 312.\n\nMilestone Logos Signed This Year',
        'body', 'left', { x: 5, y: 22, width: 90, height: 16 },
      ),
      iconListBlock([
        {
          icon: 'building',
          title: 'Stripe',
          description: '$142K ACV. Replaced their internal analytics tooling. Expanded from 1 team to 4 within 6 months.',
        },
        {
          icon: 'building',
          title: 'HubSpot',
          description: '$98K ACV. Won a competitive bake-off against Looker and Mode. Now used by 120+ analysts.',
        },
        {
          icon: 'building',
          title: 'Shopify',
          description: '$210K ACV. Largest deal in company history. Multi-year contract with embedded analytics for their merchant dashboard.',
        },
        {
          icon: 'building',
          title: 'Notion',
          description: '$67K ACV. Started as a 10-seat pilot from a cold outbound email. Expanded company-wide in Q4.',
        },
      ], 2, { x: 5, y: 42, width: 90, height: 50 }),
    ], 'Name the logos. Enterprise buyers care about who else is using the product. These are credibility signals.'),

    slide('title-content', 3, [
      textBlock('Product Milestones', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      timelineBlock([
        {
          title: 'AI Query Builder',
          description: 'Natural language to SQL. Reduced time-to-insight from 25 minutes to under 90 seconds for non-technical users. 78% of queries now generated via AI.',
          date: 'March',
        },
        {
          title: 'Real-Time Dashboards',
          description: 'Sub-second refresh on datasets up to 500M rows. Built on a custom streaming architecture. Eliminated the #1 feature request from enterprise customers.',
          date: 'June',
        },
        {
          title: 'Embedded Analytics SDK',
          description: 'White-label analytics for SaaS products. React and Vue components. Adopted by 23 customers in the first quarter, unlocking our product-led expansion motion.',
          date: 'September',
        },
        {
          title: 'SOC 2 Type II + HIPAA',
          description: 'Achieved both certifications in Q4. Unlocked healthcare and financial services verticals. Pipeline from regulated industries grew 340% in 60 days.',
          date: 'November',
        },
      ], 'horizontal', { x: 5, y: 22, width: 90, height: 70 }),
    ], 'Walk through each product milestone chronologically. Connect each to a business outcome.'),

    slide('two-column', 4, [
      textBlock('Team and Culture', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'Headcount Growth\n\nStarted the year with 18 people. Ended with 47. Every hire made through a rigorous bar-raiser process.\n\nKey Hires\n- VP Engineering: Lena Voss (ex-Datadog, built their metrics pipeline serving 80K+ customers)\n- VP Sales: James Okafor (ex-Amplitude, took them from $10M to $50M ARR)\n- Head of Design: Maya Torres (ex-Figma, led the FigJam product design team)\n\nEmployee NPS: 82\nVoluntary attrition: 4.2% (industry avg: 13.2%)',
        'body', 'left', { x: 5, y: 22, width: 42, height: 70 },
      ),
      textBlock(
        'Culture Highlights\n\nFirst annual offsite in Bend, Oregon. 47 people. Three days of strategy, team-building, and an unexpectedly competitive kickball tournament.\n\nLaunched internal learning stipend: $2,500/year per employee for courses, conferences, and books. 89% utilization in the first quarter.\n\nDiversity metrics improved across the board: engineering team went from 22% to 38% women and non-binary. Leadership team is 50% people of color.\n\nShipped "Demo Fridays" — weekly 15-minute presentations where anyone in the company shows what they built that week. Highest-rated internal initiative in our annual survey.',
        'body', 'left', { x: 53, y: 22, width: 42, height: 70 },
      ),
    ], 'People are the company. Show that you invest in them. The low attrition and high NPS are proof points.'),

    slide('title-content', 5, [
      textBlock('2026 Goals', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      listBlock('numbered', [
        'Reach $14M ARR by December 2026 (145% YoY growth) with a path to cash-flow positive by Q4',
        'Close 10+ enterprise deals above $100K ACV, with at least 3 in healthcare or financial services',
        'Launch MeridianAI Copilot: conversational analytics assistant that generates dashboards, anomaly alerts, and executive summaries from natural language prompts',
        'Expand internationally with a London office and EU data residency to capture the $2.1B European analytics market',
        'Grow team to 75 people with an emphasis on solutions engineering and customer success to support enterprise expansion',
        'Achieve a Net Promoter Score of 60+ and maintain below 5% voluntary attrition as we scale',
      ], { x: 5, y: 22, width: 90, height: 65 }),
    ], 'End with ambition and clarity. Every goal is specific and measurable. This is the roadmap.'),
  ],
};

// ─────────────────────────────────────────────────
// Sample 4: Introduction to Design Systems
// Theme: Lavender | Category: Education | 6 slides
// ─────────────────────────────────────────────────

const designSystems: SampleDeck = {
  id: 'design-systems',
  name: 'Introduction to Design Systems',
  description: 'A comprehensive overview of design systems: what they are, why they matter, and how to build one. Covers real-world frameworks like Material Design, Primer, and Polaris.',
  category: 'education',
  themeId: 'lavender',
  slideCount: 6,
  accentColor: '#7C3AED',
  slides: [
    slide('title', 0, [
      textBlock('Introduction to Design Systems', 'title', 'center', { x: 10, y: 25, width: 80, height: 20 }),
      textBlock('Building Consistent, Scalable, and Accessible User Interfaces', 'subtitle', 'center', { x: 15, y: 50, width: 70, height: 10 }),
      textBlock('A Practical Guide for Product Teams', 'caption', 'center', { x: 25, y: 65, width: 50, height: 6 }),
    ], 'Frame design systems not as a design-only concern but as a product-wide investment. This deck is for designers, engineers, and product managers alike.'),

    slide('title-content', 1, [
      textBlock('What Is a Design System?', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'A design system is a collection of reusable components, guided by clear standards, that can be assembled to build any number of applications. It is not a style guide, not a component library, and not a Figma file. It is all of those things unified by shared principles, governance, and tooling.\n\nThink of it as the single source of truth for how your product looks, feels, and behaves. When an engineer in Berlin and a designer in Tokyo both need a date picker, they reach for the same component with the same API, the same accessibility features, and the same visual design.\n\nThe best design systems in the world share three traits:\n\n1. They are living products, not static documentation. They ship releases, have changelogs, and deprecate features.\n2. They reduce decision fatigue. Teams spend time on unique problems instead of reinventing buttons.\n3. They encode accessibility and inclusivity by default, not as an afterthought.',
        'body', 'left', { x: 5, y: 22, width: 90, height: 70 },
      ),
    ], 'Start with a clear definition that corrects common misconceptions. A design system is not just a Figma library.'),

    slide('two-column', 2, [
      textBlock('Core Components', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'Design Tokens\n\nThe atomic values that define your visual language: colors, typography scales, spacing units, border radii, shadows, and motion curves. Stored as platform-agnostic JSON and compiled to CSS custom properties, Swift constants, or Kotlin values.\n\nExample: Salesforce Lightning uses 2,400+ tokens to maintain consistency across web, iOS, and Android.\n\nComponent Library\n\nPre-built, tested, and accessible UI components: buttons, inputs, modals, data tables, navigation, tooltips. Each component has a defined API, documented props, keyboard navigation, and ARIA attributes.\n\nExample: GitHub Primer ships 60+ React components, each with Storybook documentation, visual regression tests, and accessibility audits.',
        'body', 'left', { x: 5, y: 22, width: 42, height: 70 },
      ),
      textBlock(
        'Design Assets\n\nFigma (or Sketch) component libraries that mirror the code 1:1. Auto-layout, variants, and component properties ensure that what designers create is exactly what engineers build.\n\nExample: Shopify Polaris maintains pixel-perfect Figma-to-React parity with automated sync tooling.\n\nDocumentation & Guidelines\n\nUsage guidelines, do/don\'t examples, content standards, and interaction patterns. Great documentation answers "when should I use this?" not just "what props does it accept?"\n\nGovernance\n\nContribution model, RFC process, versioning strategy, and deprecation policy. The best systems use an innersource model where any team can propose changes through a structured review process.',
        'body', 'left', { x: 53, y: 22, width: 42, height: 70 },
      ),
    ], 'Walk through each layer of the system. Use real examples from well-known design systems to make it tangible.'),

    slide('title-content', 3, [
      textBlock('Why Design Systems Matter', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      iconListBlock([
        {
          icon: 'zap',
          title: 'Ship 34% Faster',
          description: 'Teams using mature design systems report 34% faster development cycles (Sparkbox Design Systems Survey 2024). Engineers spend less time on UI decisions and more time on business logic.',
        },
        {
          icon: 'palette',
          title: 'Visual Consistency at Scale',
          description: 'Atlassian manages 15+ products (Jira, Confluence, Trello, Bitbucket) with a single design system. Without it, every product would slowly drift into its own visual dialect.',
        },
        {
          icon: 'accessibility',
          title: 'Accessibility by Default',
          description: 'When accessibility is baked into shared components, every product that uses them inherits WCAG 2.1 AA compliance. Microsoft Fluent UI includes built-in screen reader support, high contrast modes, and keyboard navigation across all components.',
        },
        {
          icon: 'refresh',
          title: 'Rebrand in Weeks, Not Months',
          description: 'When IBM updated their brand in 2021, Carbon Design System allowed them to propagate changes across hundreds of applications by updating design tokens. What would have taken 18 months took 6 weeks.',
        },
      ], 2, { x: 5, y: 20, width: 90, height: 72 }),
    ], 'This is the business case slide. Speak to the ROI. Use concrete numbers and real company examples.'),

    slide('title-content', 4, [
      textBlock('Building Your Own Design System', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'Phase 1: Audit and Inventory (Weeks 1-3)\nScreenshot every unique button, input, card, and color in your product. You will likely find 37 shades of blue and 12 different button styles. This visual chaos is your starting point. Tools: Figma\'s "Selection Colors" plugin, CSS Stats, Storybook\'s visual inventory.\n\nPhase 2: Define Tokens and Foundations (Weeks 4-6)\nEstablish your color palette, type scale, spacing system, and elevation levels. Use tools like Style Dictionary (by Amazon) to generate platform-specific outputs from a single source. Start with 8-12 semantic color tokens, not 64 hex values.\n\nPhase 3: Build Core Components (Weeks 7-14)\nStart with the 10 components that appear on 80% of screens: Button, Input, Select, Modal, Card, Avatar, Badge, Tooltip, Table, and Navigation. Build them in isolation using Storybook. Write accessibility tests with axe-core.\n\nPhase 4: Document and Launch (Weeks 15-18)\nCreate a documentation site (Docusaurus, Zeroheight, or custom). Include live code examples, design guidelines, and migration guides. Launch internally with an adoption champion in each product team.\n\nPhase 5: Govern and Evolve (Ongoing)\nEstablish a contribution model. Run office hours. Track adoption metrics. Ship monthly releases. Treat it as a product with users, a roadmap, and a feedback loop.',
        'body', 'left', { x: 5, y: 22, width: 90, height: 70 },
      ),
    ], 'This is the practical "how to" slide. Give people a concrete timeline they can adapt. Mention real tools.'),

    slide('title-content', 5, [
      textBlock('Resources and Inspiration', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      listBlock('bullet', [
        'Material Design 3 (Google) — material.io — The most comprehensive public design system. Excellent documentation on adaptive layouts, motion, and theming.',
        'Primer (GitHub) — primer.style — Open-source React components with exceptional accessibility. Their Storybook is a masterclass in component documentation.',
        'Polaris (Shopify) — polaris.shopify.com — The gold standard for Figma-to-code parity. Their contribution guidelines are worth studying.',
        'Carbon (IBM) — carbondesignsystem.com — Enterprise-grade system supporting web, mobile, and data visualization. Strong governance model for large organizations.',
        'Fluent UI (Microsoft) — fluent2.microsoft.design — Powers Office, Teams, and Azure. Demonstrates how one system can serve radically different product contexts.',
        'Lightning (Salesforce) — lightningdesignsystem.com — Pioneer of design tokens. Their token architecture influenced the entire industry.',
        'Radix UI — radix-ui.com — Headless, unstyled primitives for building accessible components. The best foundation if you want full design control.',
        'Book: "Design Systems" by Alla Kholmatova (Smashing Magazine) — The definitive guide to the principles, process, and culture of design systems.',
      ], { x: 5, y: 22, width: 90, height: 65 }),
    ], 'End with actionable resources. People should leave this presentation knowing exactly where to start.'),
  ],
};

// ─────────────────────────────────────────────────
// Export all sample decks
// ─────────────────────────────────────────────────

export const sampleDecks: SampleDeck[] = [
  aiHealthcare,
  mindflowPitch,
  yearInReview,
  designSystems,
];
