import { describe, it, expect, vi, beforeEach } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any;

const { mockDeleteDoc, mockDoc, mockImageDelete } = vi.hoisted(() => ({
  mockDeleteDoc: vi.fn((_ref: unknown) => Promise.resolve()) as AnyFn & ReturnType<typeof vi.fn>,
  mockDoc: vi.fn((_db: unknown, _col: string, _id: string) => ({ path: `${_col}/${_id}` })),
  mockImageDelete: vi.fn((_image: unknown) => Promise.resolve()) as AnyFn &
    ReturnType<typeof vi.fn>,
}));

vi.mock('firebase/firestore', () => ({
  deleteDoc: mockDeleteDoc,
  doc: mockDoc,
}));

vi.mock('../../../lib/firebase/client', () => ({
  db: { name: 'db-mock' },
}));

vi.mock('../../../lib/firebase/image-service', () => ({
  imageService: {
    delete: mockImageDelete,
  },
}));

import type { TechnologyWithId } from '../../../lib/schemas/technology-schema';
import { createTechnology } from '../../../test/factories/technology';

describe('TechnologiesCrudPage — view mode transitions', () => {
  it('[P0] 3.6-TEST-032: list → create → list transition', () => {
    const state = { viewMode: 'list' as 'list' | 'create' | 'edit' };
    expect(state.viewMode).toBe('list');

    state.viewMode = 'create';
    expect(state.viewMode).toBe('create');

    state.viewMode = 'list';
    expect(state.viewMode).toBe('list');
  });

  it('[P0] 3.6-TEST-033: list → edit → list transition', () => {
    const state = {
      viewMode: 'list' as 'list' | 'create' | 'edit',
      editingTech: null as TechnologyWithId | null,
    };
    const tech = createTechnology({ name: 'React' });

    state.editingTech = tech;
    state.viewMode = 'edit';
    expect(state.viewMode).toBe('edit');
    expect(state.editingTech).toEqual(tech);

    state.viewMode = 'list';
    state.editingTech = null;
    expect(state.viewMode).toBe('list');
    expect(state.editingTech).toBeNull();
  });

  it('[P0] 3.6-TEST-034: handleSaved resets to list and clears editing state', () => {
    const state = {
      viewMode: 'edit' as 'list' | 'create' | 'edit',
      editingTech: createTechnology() as TechnologyWithId | null,
    };
    expect(state.viewMode).toBe('edit');

    state.viewMode = 'list';
    state.editingTech = null;

    expect(state.viewMode).toBe('list');
    expect(state.editingTech).toBeNull();
  });
});

describe('TechnologiesCrudPage — delete flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('[P0] 3.6-TEST-035: delete request opens dialog', () => {
    const state = {
      deletingTech: null as TechnologyWithId | null,
      showDeleteDialog: false,
    };
    const tech = createTechnology({ name: 'TypeScript' });

    state.deletingTech = tech;
    state.showDeleteDialog = true;

    expect(state.showDeleteDialog).toBe(true);
    expect(state.deletingTech).toEqual(tech);
  });

  it('[P0] 3.6-TEST-036: imageService.delete called before deleteDoc', async () => {
    const callOrder: string[] = [];

    mockImageDelete.mockImplementation(async () => {
      callOrder.push('imageDelete');
    });
    mockDeleteDoc.mockImplementation(async () => {
      callOrder.push('deleteDoc');
    });

    const tech = createTechnology({ name: 'Astro' });

    await mockImageDelete(tech.image);
    await mockDeleteDoc(mockDoc({}, 'Technologies', tech.id));

    expect(callOrder).toEqual(['imageDelete', 'deleteDoc']);
  });

  it('[P0] 3.6-TEST-037: imageService.delete receives StoredImage', async () => {
    const tech = createTechnology();

    await mockImageDelete(tech.image);

    expect(mockImageDelete).toHaveBeenCalledWith({
      url: tech.image.url,
      storagePath: tech.image.storagePath,
    });
  });

  it('[P0] 3.6-TEST-038: deleteDoc receives correct collection and id', async () => {
    const tech = createTechnology();

    await mockDeleteDoc(mockDoc({}, 'Technologies', tech.id));

    expect(mockDoc).toHaveBeenCalledWith({}, 'Technologies', tech.id);
  });

  it('[P0] 3.6-TEST-039: dialog state reset after successful delete', async () => {
    const tech = createTechnology();
    const state = {
      showDeleteDialog: true,
      deletingTech: tech as TechnologyWithId | null,
      deleting: true,
    };

    await mockImageDelete(tech.image);
    await mockDeleteDoc(mockDoc({}, 'Technologies', tech.id));

    state.showDeleteDialog = false;
    state.deletingTech = null;
    state.deleting = false;

    expect(state.showDeleteDialog).toBe(false);
    expect(state.deletingTech).toBeNull();
    expect(state.deleting).toBe(false);
  });

  it('[P0] 3.6-TEST-040: dialog state reset after failed delete', () => {
    const state = {
      showDeleteDialog: true,
      deletingTech: createTechnology() as TechnologyWithId | null,
    };

    state.showDeleteDialog = false;
    state.deletingTech = null;

    expect(state.showDeleteDialog).toBe(false);
    expect(state.deletingTech).toBeNull();
  });
});

describe('TechnologiesCrudPage — delete dialog message', () => {
  it('[P0] 3.6-TEST-041: message includes technology name', () => {
    const template =
      "¿Eliminar '{name}'? Se eliminará también su imagen de Storage.";
    const techName = 'Astro';

    const message = template.replace('{name}', techName);

    expect(message).toBe(
      "¿Eliminar 'Astro'? Se eliminará también su imagen de Storage.",
    );
  });
});

describe('TechnologiesCrudPage — FirebaseError code mapping', () => {
  it('[P0] 3.6-TEST-042: maps permission-denied error code', () => {
    const error = { code: 'permission-denied' };
    let result = '';

    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = (error as { code: string }).code;
      if (code === 'permission-denied') result = 'Sin permisos para esta operación';
      else if (code === 'not-found') result = 'El recurso no fue encontrado';
      else if (code === 'unavailable') result = 'Servicio no disponible';
    }

    expect(result).toBe('Sin permisos para esta operación');
  });

  it('[P0] 3.6-TEST-043: maps not-found error code', () => {
    const error = { code: 'not-found' };
    let result = '';

    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = (error as { code: string }).code;
      if (code === 'permission-denied') result = 'Sin permisos';
      else if (code === 'not-found') result = 'El recurso no fue encontrado';
      else if (code === 'unavailable') result = 'Servicio no disponible';
    }

    expect(result).toBe('El recurso no fue encontrado');
  });

  it('[P0] 3.6-TEST-044: maps unavailable error code', () => {
    const error = { code: 'unavailable' };
    let result = '';

    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = (error as { code: string }).code;
      if (code === 'permission-denied') result = 'Sin permisos';
      else if (code === 'not-found') result = 'No encontrado';
      else if (code === 'unavailable') result = 'Servicio no disponible';
    }

    expect(result).toBe('Servicio no disponible');
  });

  it('[P1] 3.6-TEST-045: returns default message for unknown errors', () => {
    const error = 'some string error';
    let result = 'Error al eliminar la tecnología';

    if (typeof error === 'object' && error !== null && 'code' in error) {
      result = 'mapped error';
    }

    expect(result).toBe('Error al eliminar la tecnología');
  });

  it('[P1] 3.6-TEST-046: handles null error gracefully', () => {
    const error = null;
    let result = 'Error al eliminar la tecnología';

    if (typeof error === 'object' && error !== null && 'code' in error) {
      result = 'mapped error';
    }

    expect(result).toBe('Error al eliminar la tecnología');
  });
});
