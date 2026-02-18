/**
 * Sofia's Copy System — Every word earns its place.
 * Brand voice: confident, clear, a little warm. Never corporate.
 */

export const COPY = {
  hero: {
    eyebrow: 'Developer Documentation, Reinvented',
    headline: 'Docs your team\nwill actually read.',
    subheadline:
      "Stop apologizing for bad documentation. DevDocs Pro turns your OpenAPI spec into a beautiful, searchable portal — in the time it takes to grab coffee.",
    cta_primary:   'Start building free →',
    cta_secondary: 'See how it works',
  },

  quickLinks: [
    { icon:'⚡', label:'Up in 3 minutes', desc:'From zero to live docs faster than any standup.' },
    { icon:'🔑', label:'Auth, sorted',     desc:'Bearer tokens, OAuth, API keys. All covered.' },
    { icon:'📦', label:'Typed SDKs',       desc:'12 languages. Auto-generated. Always in sync.' },
    { icon:'🔌', label:'Full REST API',    desc:'Every endpoint documented. Nothing hidden.' },
    { icon:'🚀', label:'Deploy anywhere',  desc:"Vercel, Netlify, your own server. Your call." },
    { icon:'🗂️', label:'Multi-version',   desc:'Ship v2 without killing v1. Developers thank you.' },
  ],

  sections: {
    overview: {
      title: 'The docs platform that respects your time.',
      body: `DevDocs Pro is a **documentation-as-code platform** that turns your OpenAPI spec into production-grade docs automatically. No templates to wrestle with. No hosting to configure. No week-long setup. Just great documentation, out of the box.`,
    },
    howItWorks: {
      title: 'Simple by design. Powerful by default.',
      body: "Three steps. That's the whole process. We handle the heavy lifting so you can focus on what matters: building.",
    },
    steps: [
      {
        title: 'Point to your spec',
        desc: 'Drop in your openapi.json or openapi.yaml URL. We parse OpenAPI 3.0, 3.1, and AsyncAPI 2.x. Already have a spec? You\'re basically done.',
      },
      {
        title: 'Configure in seconds',
        desc: 'Set your project name, domain, and theme. The devdocs.config.ts file is small by design — sensible defaults cover 90% of setups.',
      },
      {
        title: 'Deploy and forget',
        desc: "One command: devdocs deploy. Vercel, Netlify, Cloudflare, or your own Node server — all supported. Your CI/CD pipeline handles the rest.",
      },
    ],
  },

  callouts: {
    note:    'New to DevDocs? The {quickstart} gets you live in under 3 minutes. No account required.',
    tip:     'Always store tokens in environment variables. Your future self — and your security team — will thank you.',
    warning: 'Free plan: 1,000 requests/day. Pro: 100,000/day. Hit the limit? You\'ll get a 429 with a Retry-After header, not a silent failure.',
  },

  cta: {
    headline:   'Ready to ship docs worth reading?',
    subheadline: '50,000 developers already have. Join them.',
    primary:    'Start free — no card needed',
    secondary:  'Talk to us →',
  },

  footer: {
    tagline: 'Great docs are a product feature. Treat them like one.',
  },
};
