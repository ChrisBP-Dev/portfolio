export const navItems = [
  { label: 'Home', href: '/', key: 'home' },
  { label: 'Projects', href: '/projects', key: 'projects' },
  { label: 'Experience', href: '/experience', key: 'experience' },
  { label: 'Blog', href: '/blog', key: 'blog' },
  { label: 'Contact', href: '/contact', key: 'contact' },
] as const;

export type NavKey = (typeof navItems)[number]['key'];
