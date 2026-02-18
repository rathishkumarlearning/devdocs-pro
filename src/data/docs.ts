export interface NavItem {
  id: string;
  label: string;
  badge?: 'new' | 'beta';
}
export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV: NavSection[] = [
  {
    title: 'Getting Started',
    items: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'quickstart',   label: 'Quickstart' },
      { id: 'installation', label: 'Installation' },
      { id: 'authentication', label: 'Authentication' },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { id: 'projects',    label: 'Projects' },
      { id: 'pages',       label: 'Pages & Content' },
      { id: 'versioning',  label: 'Versioning', badge: 'new' },
      { id: 'search',      label: 'Search API' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { id: 'api-overview',  label: 'Overview' },
      { id: 'api-projects',  label: 'Projects API' },
      { id: 'api-pages',     label: 'Pages API' },
      { id: 'api-search',    label: 'Search API' },
      { id: 'webhooks',      label: 'Webhooks', badge: 'beta' },
    ],
  },
  {
    title: 'SDKs',
    items: [
      { id: 'sdk-ts',     label: 'TypeScript' },
      { id: 'sdk-python', label: 'Python' },
      { id: 'sdk-go',     label: 'Go' },
      { id: 'sdk-other',  label: 'Other Languages' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { id: 'guide-deploy', label: 'Deployment' },
      { id: 'guide-ci',     label: 'CI/CD Integration' },
      { id: 'guide-custom', label: 'Custom Domains' },
      { id: 'guide-sso',    label: 'SSO & Access' },
    ],
  },
  {
    title: 'More',
    items: [
      { id: 'changelog', label: 'Changelog', badge: 'new' },
    ],
  },
];
