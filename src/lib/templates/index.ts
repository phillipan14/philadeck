import { nanoid } from 'nanoid';
import type { Slide, ContentBlock, SlideLayout } from '@/types/presentation';

export interface TemplateDefinition {
  name: string;
  description: string;
  category: 'business' | 'education' | 'creative';
  themeId: string;
  slideCount: number;
  slides: Slide[];
}

// Helper functions to create content blocks with unique IDs
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
// Template 1: Startup Pitch Deck
// ─────────────────────────────────────────────────
const startupPitchDeck: TemplateDefinition = {
  name: 'Startup Pitch Deck',
  description: 'A structured pitch deck for fundraising and investor meetings',
  category: 'business',
  themeId: 'midnight',
  slideCount: 8,
  slides: [
    slide('title', 0, [
      textBlock('Company Name', 'title', 'center', { x: 10, y: 30, width: 80, height: 20 }),
      textBlock('One line that captures what you do and why it matters', 'subtitle', 'center', { x: 20, y: 55, width: 60, height: 10 }),
    ]),
    slide('title-content', 1, [
      textBlock('The Problem', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      listBlock('bullet', [
        'Describe the pain point your target customer faces every day',
        'Explain why existing solutions fall short or cost too much',
        'Quantify the impact — time lost, revenue missed, or friction created',
      ], { x: 5, y: 22, width: 90, height: 65 }),
    ]),
    slide('content-image-right', 2, [
      textBlock('The Solution', 'heading', 'left', { x: 5, y: 5, width: 45, height: 12 }),
      textBlock(
        'Explain your product in plain language. What does it do, and how does it solve the problem better than anything else on the market?\n\nFocus on the core value proposition — the one thing that makes customers switch.',
        'body', 'left', { x: 5, y: 22, width: 45, height: 70 },
      ),
      imageBlock('Product screenshot or demo', 'product interface dashboard', { x: 55, y: 5, width: 40, height: 87 }),
    ]),
    slide('title-content', 3, [
      textBlock('Market Size', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'TAM (Total Addressable Market): $XX B\nThe entire revenue opportunity if you captured 100% of the market.\n\nSAM (Serviceable Addressable Market): $XX B\nThe segment you can realistically reach with your current product and go-to-market.\n\nSOM (Serviceable Obtainable Market): $XX M\nThe share you expect to capture in the next 2-3 years.',
        'body', 'left', { x: 5, y: 22, width: 90, height: 70 },
      ),
    ]),
    slide('two-column', 4, [
      textBlock('Business Model', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'Primary Revenue\n\nSaaS subscription tiers:\n- Starter: $49/mo\n- Growth: $149/mo\n- Enterprise: Custom\n\nAverage contract value: $X,XXX/year',
        'body', 'left', { x: 5, y: 22, width: 42, height: 70 },
      ),
      textBlock(
        'Unit Economics\n\nCAC: $XXX\nLTV: $X,XXX\nLTV/CAC Ratio: X.Xx\nGross Margin: XX%\nNet Revenue Retention: XXX%',
        'body', 'left', { x: 53, y: 22, width: 42, height: 70 },
      ),
    ]),
    slide('title-content', 5, [
      textBlock('Traction', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      listBlock('bullet', [
        '$XXK ARR, growing XX% month-over-month',
        'XXX paying customers across X verticals',
        'XX% net revenue retention with negative churn',
        'Key logos: [Customer A], [Customer B], [Customer C]',
        'Pipeline: $XXXK in qualified opportunities',
      ], { x: 5, y: 22, width: 90, height: 65 }),
    ]),
    slide('two-column', 6, [
      textBlock('The Team', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'CEO / Co-Founder\n[Name]\n\nPreviously [role] at [company]. XX years in [domain]. [University] grad.\n\nBrings deep expertise in [relevant area] and has scaled teams from X to XX.',
        'body', 'left', { x: 5, y: 22, width: 42, height: 70 },
      ),
      textBlock(
        'CTO / Co-Founder\n[Name]\n\nFormer engineering lead at [company]. Built systems processing XX requests/sec.\n\nHolds [degree] from [university]. Open source contributor to [project].',
        'body', 'left', { x: 53, y: 22, width: 42, height: 70 },
      ),
    ]),
    slide('section-header', 7, [
      textBlock('The Ask', 'title', 'center', { x: 10, y: 25, width: 80, height: 15 }),
      textBlock(
        'Raising $X.XM Seed Round\n\nUse of funds: 60% Engineering, 25% GTM, 15% Operations\nRunway: 18-24 months to Series A milestones',
        'body', 'center', { x: 15, y: 50, width: 70, height: 30 },
      ),
    ]),
  ],
};

// ─────────────────────────────────────────────────
// Template 2: Quarterly Business Review
// ─────────────────────────────────────────────────
const quarterlyBusinessReview: TemplateDefinition = {
  name: 'Quarterly Business Review',
  description: 'Present quarterly performance, wins, and goals to stakeholders',
  category: 'business',
  themeId: 'slate',
  slideCount: 6,
  slides: [
    slide('title', 0, [
      textBlock('Q1 2026 Business Review', 'title', 'center', { x: 10, y: 30, width: 80, height: 20 }),
      textBlock('Department Name | Presented by [Your Name] | March 2026', 'subtitle', 'center', { x: 15, y: 55, width: 70, height: 10 }),
    ]),
    slide('title-content', 1, [
      textBlock('Executive Summary', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'This quarter we exceeded our revenue target by 12% while maintaining healthy unit economics. Customer acquisition accelerated through new channel partnerships, and product shipped three major features ahead of schedule.\n\nKey metrics at a glance:\n- Revenue: $X.XM (112% of target)\n- New customers: XXX (up 28% QoQ)\n- NPS: 72 (up from 65)\n- Team headcount: XX (+5 this quarter)',
        'body', 'left', { x: 5, y: 22, width: 90, height: 70 },
      ),
    ]),
    slide('title-content', 2, [
      textBlock('Revenue Performance', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'Monthly recurring revenue grew from $XXXk to $XXXk this quarter, driven by enterprise upsells and improved conversion in the self-serve funnel.\n\nBreakdown by segment:\n- Enterprise: $XXXk (45% of total, +18% QoQ)\n- Mid-market: $XXXk (35% of total, +12% QoQ)\n- SMB / Self-serve: $XXXk (20% of total, +8% QoQ)\n\nChurn decreased to X.X% monthly, the lowest in company history.',
        'body', 'left', { x: 5, y: 22, width: 90, height: 70 },
      ),
    ]),
    slide('title-content', 3, [
      textBlock('Key Wins', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      listBlock('bullet', [
        'Closed [Enterprise Customer] — $XXXk ACV, largest deal to date',
        'Launched v3.0 with AI-powered analytics, driving 40% increase in engagement',
        'Reduced average onboarding time from 14 days to 5 days',
        'Hired VP of Engineering and two senior product managers',
        'Achieved SOC 2 Type II certification ahead of schedule',
      ], { x: 5, y: 22, width: 90, height: 65 }),
    ]),
    slide('two-column', 4, [
      textBlock('Challenges & Mitigations', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'Challenges\n\n- Sales cycle length increased by 15% for enterprise deals due to tighter procurement processes\n- Infrastructure costs grew faster than planned (+22% QoQ)\n- Two key engineering hires fell through at offer stage',
        'body', 'left', { x: 5, y: 22, width: 42, height: 70 },
      ),
      textBlock(
        'Mitigations\n\n- Implementing champion enablement toolkit to shorten internal buy-in\n- Migrating to reserved instances and autoscaling; targeting 30% cost reduction\n- Partnered with recruiting agency and adjusted comp bands for competitive roles',
        'body', 'left', { x: 53, y: 22, width: 42, height: 70 },
      ),
    ]),
    slide('title-content', 5, [
      textBlock('Next Quarter Goals', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      listBlock('numbered', [
        'Hit $X.XM in ARR (+20% QoQ growth target)',
        'Launch self-serve onboarding flow to reduce CAC by 25%',
        'Ship integrations with Salesforce, HubSpot, and Slack',
        'Expand sales team by 3 AEs focused on mid-market segment',
        'Run first customer advisory board session with top 10 accounts',
        'Complete ISO 27001 certification process',
      ], { x: 5, y: 22, width: 90, height: 65 }),
    ]),
  ],
};

// ─────────────────────────────────────────────────
// Template 3: Product Launch
// ─────────────────────────────────────────────────
const productLaunch: TemplateDefinition = {
  name: 'Product Launch',
  description: 'Announce a new product with features, pricing, and timeline',
  category: 'business',
  themeId: 'coral',
  slideCount: 8,
  slides: [
    slide('title', 0, [
      textBlock('Introducing [Product Name]', 'title', 'center', { x: 10, y: 30, width: 80, height: 20 }),
      textBlock('The smarter way to [solve key problem]', 'subtitle', 'center', { x: 15, y: 55, width: 70, height: 10 }),
    ]),
    slide('section-header', 1, [
      textBlock('The Problem', 'title', 'center', { x: 10, y: 25, width: 80, height: 15 }),
      textBlock(
        'Teams spend an average of 12 hours per week on [manual task], costing enterprises over $XX,000 per employee annually. Current tools are fragmented, require heavy configuration, and break at scale.',
        'body', 'center', { x: 15, y: 50, width: 70, height: 30 },
      ),
    ]),
    slide('content-image-right', 2, [
      textBlock('Our Solution', 'heading', 'left', { x: 5, y: 5, width: 45, height: 12 }),
      textBlock(
        '[Product Name] automates [core workflow] end-to-end, reducing manual effort by 80%.\n\nBuilt on [technology differentiator], it learns from your team\'s patterns and continuously improves accuracy over time.\n\nNo code required. Works with your existing tools. Set up in under 10 minutes.',
        'body', 'left', { x: 5, y: 22, width: 45, height: 70 },
      ),
      imageBlock('Product solution interface', 'modern SaaS product dashboard clean UI', { x: 55, y: 5, width: 40, height: 87 }),
    ]),
    slide('two-column', 3, [
      textBlock('Key Features', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      listBlock('bullet', [
        'Smart Automation — AI-powered workflows that adapt to your processes',
        'Real-time Collaboration — Team members can work together with live sync',
        'Advanced Analytics — Track performance with customizable dashboards',
      ], { x: 5, y: 22, width: 42, height: 70 }),
      listBlock('bullet', [
        'Enterprise Security — SOC 2, SSO, and role-based access controls',
        'Seamless Integrations — Connect with 200+ tools via native connectors',
        'Mobile-First — Full functionality on iOS and Android devices',
      ], { x: 53, y: 22, width: 42, height: 70 }),
    ]),
    slide('title-content', 4, [
      textBlock('How It Works', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'Step 1: Connect Your Tools\nLink your existing stack in one click — CRM, email, project management, and more.\n\nStep 2: Define Your Workflows\nUse our visual builder or choose from 50+ pre-built templates tailored to your industry.\n\nStep 3: Let AI Handle the Rest\nOur engine processes, routes, and completes tasks automatically. Review and approve with a single tap.',
        'body', 'left', { x: 5, y: 22, width: 90, height: 70 },
      ),
    ]),
    slide('title-content', 5, [
      textBlock('Pricing', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'Starter — $29/user/month\nUp to 10 users. Core automation features. Email support.\n\nProfessional — $79/user/month\nUnlimited users. Advanced analytics and custom workflows. Priority support.\n\nEnterprise — Custom pricing\nDedicated instance. SLA guarantees. Custom integrations. Dedicated CSM.\n\nAll plans include a 14-day free trial with no credit card required.',
        'body', 'left', { x: 5, y: 22, width: 90, height: 70 },
      ),
    ]),
    slide('title-content', 6, [
      textBlock('Launch Timeline', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'Private Beta (Now)\nLimited access for design partners. Collecting feedback and iterating daily.\n\nPublic Beta — [Month]\nOpen registration. Free tier available. Community Slack channel launches.\n\nGeneral Availability — [Month]\nFull feature set. Enterprise tier. Partner program. App marketplace.\n\nV2 Roadmap — [Quarter]\nAPI platform. Advanced AI capabilities. Industry-specific solutions.',
        'body', 'left', { x: 5, y: 22, width: 90, height: 70 },
      ),
    ]),
    slide('section-header', 7, [
      textBlock('Ready to Get Started?', 'title', 'center', { x: 10, y: 25, width: 80, height: 15 }),
      textBlock(
        'Sign up for early access at [website.com]\n\nOr reach out to our team: hello@[company].com',
        'body', 'center', { x: 20, y: 50, width: 60, height: 25 },
      ),
    ]),
  ],
};

// ─────────────────────────────────────────────────
// Template 4: Team Onboarding
// ─────────────────────────────────────────────────
const teamOnboarding: TemplateDefinition = {
  name: 'Team Onboarding',
  description: 'Welcome new team members with culture, tools, and first-week guide',
  category: 'business',
  themeId: 'ocean',
  slideCount: 6,
  slides: [
    slide('title', 0, [
      textBlock('Welcome to [Company Name]', 'title', 'center', { x: 10, y: 30, width: 80, height: 20 }),
      textBlock('New Team Member Onboarding Guide', 'subtitle', 'center', { x: 20, y: 55, width: 60, height: 10 }),
    ]),
    slide('section-header', 1, [
      textBlock('Our Mission', 'title', 'center', { x: 10, y: 25, width: 80, height: 15 }),
      textBlock(
        'We exist to [mission statement]. Every product decision, every hire, and every customer interaction ties back to this purpose.',
        'body', 'center', { x: 15, y: 50, width: 70, height: 30 },
      ),
    ]),
    slide('two-column', 2, [
      textBlock('Meet the Team', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'Engineering\n\n[Name] — CTO\n[Name] — Senior Engineer\n[Name] — Senior Engineer\n[Name] — Engineer\n\nDesign\n\n[Name] — Head of Design\n[Name] — Product Designer',
        'body', 'left', { x: 5, y: 22, width: 42, height: 70 },
      ),
      textBlock(
        'Product & GTM\n\n[Name] — CEO\n[Name] — Head of Product\n[Name] — Account Executive\n[Name] — Customer Success\n\nOperations\n\n[Name] — Head of Operations\n[Name] — People & Culture',
        'body', 'left', { x: 53, y: 22, width: 42, height: 70 },
      ),
    ]),
    slide('title-content', 3, [
      textBlock('How We Work', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'Communication\nWe default to async. Use Slack for quick questions, Notion for documentation, and email for external communication. Meetings have agendas and end with action items.\n\nRhythm\nDaily standups (15 min). Weekly team sync (Monday). Sprint planning (bi-weekly). All-hands (monthly).\n\nValues in Practice\n- Bias toward action — ship and iterate, don\'t wait for perfect\n- Radical transparency — share context, not just conclusions\n- Own the outcome — if you see a problem, you own the fix',
        'body', 'left', { x: 5, y: 22, width: 90, height: 70 },
      ),
    ]),
    slide('title-content', 4, [
      textBlock('Tools & Resources', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      listBlock('bullet', [
        'Slack — Day-to-day communication. Channels: #general, #engineering, #random',
        'Notion — Company wiki, specs, and meeting notes',
        'Linear — Issue tracking and project management',
        'GitHub — Code repositories and pull requests',
        'Figma — Design files and prototypes',
        'Google Workspace — Email, calendar, docs, and drive',
        '1Password — Shared credentials and security',
      ], { x: 5, y: 22, width: 90, height: 65 }),
    ]),
    slide('title-content', 5, [
      textBlock('Your First Week', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'Day 1 — Get Set Up\nLaptop configuration, account access, Slack introductions, and a welcome lunch with the team.\n\nDay 2 — Learn the Product\nProduct deep-dive with the PM. Try the product as a customer would. Read the top 10 support tickets.\n\nDay 3 — Meet Your Team\n1-on-1s with your direct teammates. Understand current projects and priorities.\n\nDay 4 — First Contribution\nPick up a starter task. Ship something small. Get familiar with the codebase or workflow.\n\nDay 5 — Reflect & Plan\n30-day goals session with your manager. Share first impressions — fresh eyes are invaluable.',
        'body', 'left', { x: 5, y: 22, width: 90, height: 70 },
      ),
    ]),
  ],
};

// ─────────────────────────────────────────────────
// Template 5: Research Presentation
// ─────────────────────────────────────────────────
const researchPresentation: TemplateDefinition = {
  name: 'Research Presentation',
  description: 'Present research findings with methodology, data, and conclusions',
  category: 'education',
  themeId: 'forest',
  slideCount: 8,
  slides: [
    slide('title', 0, [
      textBlock('Research Title Goes Here', 'title', 'center', { x: 10, y: 25, width: 80, height: 20 }),
      textBlock('Author Name | Department or Institution', 'subtitle', 'center', { x: 15, y: 50, width: 70, height: 8 }),
      textBlock('Conference or Course Name | Date', 'caption', 'center', { x: 20, y: 62, width: 60, height: 6 }),
    ]),
    slide('title-content', 1, [
      textBlock('Background & Motivation', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'Provide context for your research. What is the broader field, and why does this specific question matter?\n\nPrior work has shown [key finding from literature]. However, a gap remains in our understanding of [specific area].\n\nThis study addresses that gap by [brief approach description]. Understanding this has implications for [practical or theoretical impact].',
        'body', 'left', { x: 5, y: 22, width: 90, height: 70 },
      ),
    ]),
    slide('title-content', 2, [
      textBlock('Methodology', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'Study Design\n[Experimental / Observational / Mixed Methods] approach with [sample description].\n\nParticipants\nN = [number]. Recruited from [source]. Inclusion criteria: [criteria]. Demographics: [summary].\n\nProcedure\n[Step-by-step description of what was done, instruments used, and duration].\n\nAnalysis\nData analyzed using [statistical methods / qualitative approach]. Significance threshold set at p < 0.05.',
        'body', 'left', { x: 5, y: 22, width: 90, height: 70 },
      ),
    ]),
    slide('two-column', 3, [
      textBlock('Key Findings', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'Primary Results\n\nFinding 1: [Variable A] significantly predicted [outcome] (B = X.XX, p < .001).\n\nFinding 2: Participants in the [condition] group showed XX% higher [metric] compared to controls.\n\nFinding 3: The interaction between [A] and [B] was statistically significant (F(1,XX) = X.XX, p = .0XX).',
        'body', 'left', { x: 5, y: 22, width: 42, height: 70 },
      ),
      textBlock(
        'Secondary Results\n\nNo significant effect was found for [variable] (p = .XX), suggesting [interpretation].\n\nExploratory analysis revealed a trending relationship between [X] and [Y] (r = .XX, p = .0X).\n\nEffect sizes ranged from small to medium (Cohen\'s d = 0.XX - 0.XX).',
        'body', 'left', { x: 53, y: 22, width: 42, height: 70 },
      ),
    ]),
    slide('title-content', 4, [
      textBlock('Data Analysis', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'Include your key visualizations here — charts, tables, or statistical outputs that tell the story of your data.\n\nSuggested visuals:\n- Bar chart comparing group means with error bars\n- Scatter plot showing the primary correlation\n- Table of regression coefficients\n- Distribution plots for key variables\n\nEnsure all visuals have clear axis labels, legends, and are accessible in both color and grayscale.',
        'body', 'left', { x: 5, y: 22, width: 90, height: 70 },
      ),
    ]),
    slide('title-content', 5, [
      textBlock('Discussion', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'Our findings support the hypothesis that [main conclusion]. This is consistent with [prior work] and extends it by [new contribution].\n\nThe results suggest [practical implication] for [stakeholders/practitioners].\n\nLimitations\n- Sample was limited to [population], reducing generalizability\n- Self-report measures may introduce [bias type]\n- Cross-sectional design prevents causal inference\n\nFuture Directions\nLongitudinal studies should examine whether [effect] persists over time. Replication with [different population] would strengthen external validity.',
        'body', 'left', { x: 5, y: 22, width: 90, height: 70 },
      ),
    ]),
    slide('title-content', 6, [
      textBlock('Conclusions', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      listBlock('numbered', [
        '[Primary finding] — the most important takeaway from this research',
        '[Secondary finding] — supporting evidence that strengthens the main conclusion',
        '[Practical implication] — what practitioners or policymakers should do with this knowledge',
        '[Future research direction] — the next question this work opens up',
      ], { x: 5, y: 22, width: 90, height: 65 }),
    ]),
    slide('title-content', 7, [
      textBlock('References', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'Author, A. A., & Author, B. B. (2024). Title of the first referenced article. Journal Name, Vol(Issue), pp-pp.\n\nAuthor, C. C. (2023). Title of the second referenced work. Publisher Name.\n\nAuthor, D. D., Author, E. E., & Author, F. F. (2025). Title of the third referenced article. Journal Name, Vol(Issue), pp-pp.\n\nAuthor, G. G. (2024). Title of book or report. Organization or Publisher.\n\nAuthor, H. H., & Author, I. I. (2023). Title of fifth reference. Conference Proceedings, pp-pp.',
        'body', 'left', { x: 5, y: 22, width: 90, height: 70 },
      ),
    ]),
  ],
};

// ─────────────────────────────────────────────────
// Template 6: Creative Portfolio
// ─────────────────────────────────────────────────
const creativePortfolio: TemplateDefinition = {
  name: 'Creative Portfolio',
  description: 'Showcase your work, skills, and creative projects',
  category: 'creative',
  themeId: 'neon',
  slideCount: 6,
  slides: [
    slide('title', 0, [
      textBlock('Your Name', 'title', 'center', { x: 10, y: 30, width: 80, height: 20 }),
      textBlock('Creative Portfolio | Designer & Developer', 'subtitle', 'center', { x: 15, y: 55, width: 70, height: 10 }),
    ]),
    slide('content-image-right', 1, [
      textBlock('About Me', 'heading', 'left', { x: 5, y: 5, width: 45, height: 12 }),
      textBlock(
        'I am a [role] with X+ years of experience crafting digital experiences that are both beautiful and functional.\n\nI specialize in [area 1], [area 2], and [area 3]. My work has been featured in [publications or companies].\n\nI believe great design is invisible — it solves problems without drawing attention to itself.',
        'body', 'left', { x: 5, y: 22, width: 45, height: 70 },
      ),
      imageBlock('Professional headshot or creative photo', 'portrait creative professional', { x: 55, y: 5, width: 40, height: 87 }),
    ]),
    slide('content-image-right', 2, [
      textBlock('Project: [Project Name]', 'heading', 'left', { x: 5, y: 5, width: 45, height: 12 }),
      textBlock(
        'Role: Lead Designer\nTimeline: 3 months\nClient: [Company Name]\n\nChallenge: The client needed to redesign their customer-facing portal to reduce support tickets by 40%.\n\nApproach: Conducted user research with 25 participants, created journey maps, and iterated through 3 rounds of prototyping.\n\nResult: Support tickets dropped 52%. User satisfaction scores increased from 3.2 to 4.6 out of 5.',
        'body', 'left', { x: 5, y: 22, width: 45, height: 70 },
      ),
      imageBlock('Project 1 showcase mockup', 'modern web application UI design mockup', { x: 55, y: 5, width: 40, height: 87 }),
    ]),
    slide('content-image-right', 3, [
      textBlock('Project: [Project Name]', 'heading', 'left', { x: 5, y: 5, width: 45, height: 12 }),
      textBlock(
        'Role: Full-Stack Developer\nTimeline: 6 weeks\nType: Personal Project\n\nConcept: An open-source tool that helps teams [description of what it does].\n\nTech Stack: React, TypeScript, Node.js, PostgreSQL.\n\nImpact: 2,000+ GitHub stars. Used by teams at [companies]. Featured on [publication].',
        'body', 'left', { x: 5, y: 22, width: 45, height: 70 },
      ),
      imageBlock('Project 2 showcase mockup', 'developer tool open source project interface', { x: 55, y: 5, width: 40, height: 87 }),
    ]),
    slide('two-column', 4, [
      textBlock('Skills & Expertise', 'heading', 'left', { x: 5, y: 5, width: 90, height: 12 }),
      textBlock(
        'Design\n\n- UI/UX Design\n- Design Systems\n- User Research\n- Prototyping & Wireframing\n- Motion Design\n- Brand Identity\n\nTools: Figma, Framer, After Effects, Illustrator',
        'body', 'left', { x: 5, y: 22, width: 42, height: 70 },
      ),
      textBlock(
        'Development\n\n- React / Next.js\n- TypeScript\n- Node.js & Python\n- PostgreSQL & Redis\n- AWS / Vercel\n- CI/CD & Testing\n\nTools: VS Code, GitHub, Linear, Vercel',
        'body', 'left', { x: 53, y: 22, width: 42, height: 70 },
      ),
    ]),
    slide('section-header', 5, [
      textBlock("Let's Work Together", 'title', 'center', { x: 10, y: 25, width: 80, height: 15 }),
      textBlock(
        'email@example.com\nportfolio.example.com\nlinkedin.com/in/yourname\ngithub.com/yourname',
        'body', 'center', { x: 25, y: 50, width: 50, height: 30 },
      ),
    ]),
  ],
};

export const templates: TemplateDefinition[] = [
  startupPitchDeck,
  quarterlyBusinessReview,
  productLaunch,
  teamOnboarding,
  researchPresentation,
  creativePortfolio,
];
