import { t } from '../../lib/i18n/translations';

export interface BreadcrumbSegment {
  label: string;
  href: string;
  isCurrent: boolean;
}

const PATH_LABEL_MAP: Record<string, string> = {
  '/admin': 'admin.sidebar.dashboard',
  '/admin/projects': 'admin.sidebar.projects',
  '/admin/technologies': 'admin.sidebar.technologies',
  '/admin/experiences': 'admin.sidebar.experiences',
  '/admin/blog': 'admin.sidebar.blog',
};

export function getBreadcrumbSegments(path: string): BreadcrumbSegment[] {
  // Normalize trailing slashes
  let normalized = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
  if (normalized === '/admin/' || normalized === '') normalized = '/admin';

  const parts = normalized.split('/').filter(Boolean); // e.g. ['admin', 'projects', 'edit']
  const segments: BreadcrumbSegment[] = [];

  for (let i = 0; i < parts.length; i++) {
    const partialPath = '/' + parts.slice(0, i + 1).join('/');
    const isLast = i === parts.length - 1;

    const labelKey = PATH_LABEL_MAP[partialPath];
    let label: string;

    if (partialPath === '/admin') {
      label = t('admin.breadcrumb.admin', 'es');
    } else if (labelKey) {
      label = t(labelKey, 'es');
    } else {
      // Unknown segment — capitalize first letter
      label = parts[i]!.charAt(0).toUpperCase() + parts[i]!.slice(1);
    }

    segments.push({ label, href: partialPath, isCurrent: isLast });
  }

  return segments;
}
