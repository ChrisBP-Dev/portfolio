import { describe, it, expect } from 'vitest';
import { getBreadcrumbSegments } from '../breadcrumb-utils';

describe('getBreadcrumbSegments', () => {
  it('returns single "Admin" segment for /admin as current', () => {
    const segments = getBreadcrumbSegments('/admin');
    expect(segments).toHaveLength(1);
    expect(segments[0]).toEqual({
      label: 'Admin',
      href: '/admin',
      isCurrent: true,
    });
  });

  it('handles /admin/ with trailing slash', () => {
    const segments = getBreadcrumbSegments('/admin/');
    expect(segments).toHaveLength(1);
    expect(segments[0]!.isCurrent).toBe(true);
    expect(segments[0]!.label).toBe('Admin');
  });

  it('returns two segments for /admin/projects', () => {
    const segments = getBreadcrumbSegments('/admin/projects');
    expect(segments).toHaveLength(2);
    expect(segments[0]).toEqual({
      label: 'Admin',
      href: '/admin',
      isCurrent: false,
    });
    expect(segments[1]).toEqual({
      label: 'Proyectos',
      href: '/admin/projects',
      isCurrent: true,
    });
  });

  it('returns correct label for /admin/technologies', () => {
    const segments = getBreadcrumbSegments('/admin/technologies');
    expect(segments).toHaveLength(2);
    expect(segments[1]!.label).toBe('Tecnologías');
    expect(segments[1]!.isCurrent).toBe(true);
  });

  it('returns correct label for /admin/experiences', () => {
    const segments = getBreadcrumbSegments('/admin/experiences');
    expect(segments).toHaveLength(2);
    expect(segments[1]!.label).toBe('Experiencias');
  });

  it('returns correct label for /admin/blog', () => {
    const segments = getBreadcrumbSegments('/admin/blog');
    expect(segments).toHaveLength(2);
    expect(segments[1]!.label).toBe('Blog');
  });

  it('handles trailing slash on sub-paths', () => {
    const segments = getBreadcrumbSegments('/admin/projects/');
    expect(segments).toHaveLength(2);
    expect(segments[1]!.href).toBe('/admin/projects');
  });

  it('capitalizes unknown path segments', () => {
    const segments = getBreadcrumbSegments('/admin/unknown');
    expect(segments).toHaveLength(2);
    expect(segments[0]!.isCurrent).toBe(false);
    expect(segments[1]).toEqual({
      label: 'Unknown',
      href: '/admin/unknown',
      isCurrent: true,
    });
  });

  it('first segment links to /admin when there is a sub-path', () => {
    const segments = getBreadcrumbSegments('/admin/blog');
    expect(segments[0]!.href).toBe('/admin');
    expect(segments[0]!.isCurrent).toBe(false);
  });

  it('supports deep paths like /admin/projects/edit', () => {
    const segments = getBreadcrumbSegments('/admin/projects/edit');
    expect(segments).toHaveLength(3);
    expect(segments[0]).toEqual({ label: 'Admin', href: '/admin', isCurrent: false });
    expect(segments[1]).toEqual({ label: 'Proyectos', href: '/admin/projects', isCurrent: false });
    expect(segments[2]).toEqual({ label: 'Edit', href: '/admin/projects/edit', isCurrent: true });
  });

  it('supports deep paths with unknown segments', () => {
    const segments = getBreadcrumbSegments('/admin/technologies/create');
    expect(segments).toHaveLength(3);
    expect(segments[1]!.label).toBe('Tecnologías');
    expect(segments[2]).toEqual({ label: 'Create', href: '/admin/technologies/create', isCurrent: true });
  });
});
