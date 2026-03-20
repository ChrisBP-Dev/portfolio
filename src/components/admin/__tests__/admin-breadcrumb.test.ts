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

  it('returns only Admin segment for unknown paths', () => {
    const segments = getBreadcrumbSegments('/admin/unknown');
    expect(segments).toHaveLength(1);
    expect(segments[0]!.isCurrent).toBe(true);
  });

  it('first segment links to /admin when there is a sub-path', () => {
    const segments = getBreadcrumbSegments('/admin/blog');
    expect(segments[0]!.href).toBe('/admin');
    expect(segments[0]!.isCurrent).toBe(false);
  });
});
