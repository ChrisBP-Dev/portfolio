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
  const normalizedPath = path.endsWith('/') && path !== '/admin/' ? path.slice(0, -1) : path;
  const cleanPath = normalizedPath === '/admin/' ? '/admin' : normalizedPath;

  const segments: BreadcrumbSegment[] = [
    {
      label: t('admin.breadcrumb.admin', 'es'),
      href: '/admin',
      isCurrent: true,
    },
  ];

  if (cleanPath !== '/admin') {
    const labelKey = PATH_LABEL_MAP[cleanPath];
    if (labelKey) {
      segments[0]!.isCurrent = false;
      segments.push({
        label: t(labelKey, 'es'),
        href: cleanPath,
        isCurrent: true,
      });
    }
  }

  return segments;
}
