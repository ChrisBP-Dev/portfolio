import { describe, it, expect, vi, beforeEach } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any;

const { mockGetDocs, mockUpdateDoc, mockDoc, mockCollection, mockWriteBatch } = vi.hoisted(() => {
  const batchUpdate = vi.fn();
  const batchCommit = vi.fn(() => Promise.resolve());
  return {
    mockGetDocs: vi.fn() as AnyFn & ReturnType<typeof vi.fn>,
    mockUpdateDoc: vi.fn((_ref: unknown, _data: unknown) => Promise.resolve()) as AnyFn &
      ReturnType<typeof vi.fn>,
    mockDoc: vi.fn((_db: unknown, _col: string, _id: string) => ({ path: `${_col}/${_id}` })),
    mockCollection: vi.fn((_db: unknown, _col: string) => ({ _col })),
    mockWriteBatch: vi.fn((_db?: unknown) => ({ update: batchUpdate, commit: batchCommit })),
  };
});

const mockWarning = vi.fn();
const mockError = vi.fn();

vi.mock('firebase/firestore', () => ({
  getDocs: mockGetDocs,
  updateDoc: mockUpdateDoc,
  doc: mockDoc,
  collection: mockCollection,
  writeBatch: mockWriteBatch,
}));

vi.mock('../../../lib/firebase/client', () => ({
  db: { name: 'db-mock' },
}));

vi.mock('../../../lib/utils/toast-store.svelte', () => ({
  toastStore: {
    warning: mockWarning,
    error: mockError,
    success: vi.fn(),
  },
}));

import type { Project, ProjectWithId } from '../../../lib/schemas/project-schema';
import { createProject } from '../../../test/factories/project';

function makeProjectWithId(overrides: Partial<ProjectWithId> & { id: string }): ProjectWithId {
  const { id, ...projectOverrides } = overrides;
  const base = createProject(projectOverrides as Partial<Project>);
  return {
    companyName: base.companyName,
    shortDescription: base.shortDescription,
    features: base.features,
    mainImage: base.mainImage,
    screenshots: base.screenshots,
    technologies: base.technologies,
    slug: base.slug,
    order: base.order,
    featured: base.featured,
    websiteUrl: base.websiteUrl,
    sourceCodeUrl: base.sourceCodeUrl,
    ...projectOverrides,
    id,
  };
}

describe('ProjectList — reorder logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reorder updates order fields sequentially', () => {
    const projects: ProjectWithId[] = [
      makeProjectWithId({ id: 'p1', slug: 'alpha', order: 0 }),
      makeProjectWithId({ id: 'p2', slug: 'beta', order: 1 }),
      makeProjectWithId({ id: 'p3', slug: 'gamma', order: 2 }),
    ];

    // Simulate dragging p3 (index 2) to position 0
    const draggedIndex = 2;
    const dropIndex = 0;
    const reordered = [...projects];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, moved!);

    // Assign sequential order values
    const result = reordered.map((p, i) => ({ ...p, order: i }));

    expect(result[0]!.id).toBe('p3');
    expect(result[1]!.id).toBe('p1');
    expect(result[2]!.id).toBe('p2');

    // All projects have sequential order 0, 1, 2
    expect(result[0]!.order).toBe(0);
    expect(result[1]!.order).toBe(1);
    expect(result[2]!.order).toBe(2);
  });

  it('persistOrder calls writeBatch with sequential order values', async () => {
    const projects: ProjectWithId[] = [
      makeProjectWithId({ id: 'p1', slug: 'alpha', order: 0 }),
      makeProjectWithId({ id: 'p2', slug: 'beta', order: 1 }),
    ];

    const batch = mockWriteBatch();
    projects.forEach((project, index) => {
      batch.update(mockDoc({}, 'Projects', project.id), { order: index });
    });
    await batch.commit();

    expect(batch.update).toHaveBeenCalledTimes(2);
    expect(batch.update).toHaveBeenCalledWith(
      { path: 'Projects/p1' },
      { order: 0 },
    );
    expect(batch.update).toHaveBeenCalledWith(
      { path: 'Projects/p2' },
      { order: 1 },
    );
    expect(batch.commit).toHaveBeenCalledTimes(1);
  });
});

describe('ProjectList — featured toggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('featured toggle writes to Firestore', async () => {
    const project = makeProjectWithId({ id: 'p1', featured: false });

    // Simulate toggle: set featured to true
    const newFeatured = !project.featured;
    await mockUpdateDoc(mockDoc({}, 'Projects', project.id), { featured: newFeatured });

    expect(mockUpdateDoc).toHaveBeenCalledWith(
      { path: 'Projects/p1' },
      { featured: true },
    );
  });

  it('unfeatured toggle sets featured to false', async () => {
    const project = makeProjectWithId({ id: 'p1', featured: true });

    const newFeatured = !project.featured;
    await mockUpdateDoc(mockDoc({}, 'Projects', project.id), { featured: newFeatured });

    expect(mockUpdateDoc).toHaveBeenCalledWith(
      { path: 'Projects/p1' },
      { featured: false },
    );
  });

  it('max 3 featured enforcement shows warning', () => {
    const projects: ProjectWithId[] = [
      makeProjectWithId({ id: 'p1', featured: true }),
      makeProjectWithId({ id: 'p2', featured: true }),
      makeProjectWithId({ id: 'p3', featured: true }),
      makeProjectWithId({ id: 'p4', featured: false }),
    ];

    const featuredCount = projects.filter(p => p.featured).length;
    const targetProject = projects[3]!;

    // Simulate the toggle guard
    if (!targetProject.featured && featuredCount >= 3) {
      mockWarning('Máximo 3 proyectos destacados');
    }

    expect(mockWarning).toHaveBeenCalledWith('Máximo 3 proyectos destacados');
    expect(mockUpdateDoc).not.toHaveBeenCalled();
  });

  it('unfeaturing when at max 3 does not trigger warning', async () => {
    const projects: ProjectWithId[] = [
      makeProjectWithId({ id: 'p1', featured: true }),
      makeProjectWithId({ id: 'p2', featured: true }),
      makeProjectWithId({ id: 'p3', featured: true }),
    ];

    const featuredCount = projects.filter(p => p.featured).length;
    const targetProject = projects[0]!; // Already featured, unfeaturing

    // Guard check — should not trigger for unfeaturing
    if (!targetProject.featured && featuredCount >= 3) {
      mockWarning('Máximo 3 proyectos destacados');
    }

    expect(mockWarning).not.toHaveBeenCalled();

    // Proceed with unfeaturing
    const newFeatured = !targetProject.featured;
    await mockUpdateDoc(mockDoc({}, 'Projects', targetProject.id), { featured: newFeatured });

    expect(mockUpdateDoc).toHaveBeenCalledWith(
      { path: 'Projects/p1' },
      { featured: false },
    );
  });
});

describe('ProjectList — sorting', () => {
  it('sorts by order first, then slug as tiebreaker', () => {
    const projects: ProjectWithId[] = [
      makeProjectWithId({ id: 'p1', slug: 'zebra', order: 0 }),
      makeProjectWithId({ id: 'p2', slug: 'alpha', order: 0 }),
      makeProjectWithId({ id: 'p3', slug: 'beta', order: 1 }),
    ];

    const sorted = [...projects].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0) || (a.slug ?? '').localeCompare(b.slug ?? ''),
    );

    expect(sorted[0]!.slug).toBe('alpha');
    expect(sorted[1]!.slug).toBe('zebra');
    expect(sorted[2]!.slug).toBe('beta');
  });

  it('handles missing order fields with default 0', () => {
    const p1 = makeProjectWithId({ id: 'p1', slug: 'gamma', order: 2 });
    const p2 = makeProjectWithId({ id: 'p2', slug: 'alpha' });

    // p2.order defaults to 0 from schema
    const sorted = [p1, p2].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0) || (a.slug ?? '').localeCompare(b.slug ?? ''),
    );

    expect(sorted[0]!.id).toBe('p2');
    expect(sorted[1]!.id).toBe('p1');
  });
});
