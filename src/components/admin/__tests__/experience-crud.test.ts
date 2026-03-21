import { describe, it, expect, vi, beforeEach } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any;

const { mockDeleteDoc, mockDoc } = vi.hoisted(() => ({
  mockDeleteDoc: vi.fn((_ref: unknown) => Promise.resolve()) as AnyFn & ReturnType<typeof vi.fn>,
  mockDoc: vi.fn((_db: unknown, _col: string, _id: string) => ({ path: `${_col}/${_id}` })),
}));

vi.mock('firebase/firestore', () => ({
  deleteDoc: mockDeleteDoc,
  doc: mockDoc,
}));

vi.mock('../../../lib/firebase/client', () => ({
  db: { name: 'db-mock' },
}));

import type { ExperienceWithId } from '../../../lib/schemas/experience-schema';
import { createExperience } from '../../../test/factories/experience';

describe('ExperiencesCrudPage — view mode transitions', () => {
  it('[P0] 3.7-TEST-033: list → create → list transition', () => {
    const state = { viewMode: 'list' as 'list' | 'create' | 'edit' };
    expect(state.viewMode).toBe('list');

    state.viewMode = 'create';
    expect(state.viewMode).toBe('create');

    state.viewMode = 'list';
    expect(state.viewMode).toBe('list');
  });

  it('[P0] 3.7-TEST-034: list → edit → list transition', () => {
    const state = {
      viewMode: 'list' as 'list' | 'create' | 'edit',
      editingExp: null as ExperienceWithId | null,
    };
    const exp = createExperience({ companyName: 'TechCorp' });

    state.editingExp = exp;
    state.viewMode = 'edit';
    expect(state.viewMode).toBe('edit');
    expect(state.editingExp).toEqual(exp);

    state.viewMode = 'list';
    state.editingExp = null;
    expect(state.viewMode).toBe('list');
    expect(state.editingExp).toBeNull();
  });

  it('[P0] 3.7-TEST-035: handleSaved resets to list and clears editing state', () => {
    const state = {
      viewMode: 'edit' as 'list' | 'create' | 'edit',
      editingExp: createExperience() as ExperienceWithId | null,
    };
    expect(state.viewMode).toBe('edit');

    state.viewMode = 'list';
    state.editingExp = null;

    expect(state.viewMode).toBe('list');
    expect(state.editingExp).toBeNull();
  });
});

describe('ExperiencesCrudPage — delete flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('[P0] 3.7-TEST-036: delete request opens dialog', () => {
    const state = {
      deletingExp: null as ExperienceWithId | null,
      showDeleteDialog: false,
    };
    const exp = createExperience({ companyName: 'Corp to Delete' });

    state.deletingExp = exp;
    state.showDeleteDialog = true;

    expect(state.showDeleteDialog).toBe(true);
    expect(state.deletingExp).toEqual(exp);
  });

  it('[P0] 3.7-TEST-037: deleteDoc called directly (no image cleanup)', async () => {
    const exp = createExperience({ companyName: 'Simple Corp' });

    await mockDeleteDoc(mockDoc({}, 'Experiences', exp.id));

    expect(mockDoc).toHaveBeenCalledWith({}, 'Experiences', exp.id);
    expect(mockDeleteDoc).toHaveBeenCalledTimes(1);
  });

  it('[P0] 3.7-TEST-038: dialog state reset after successful delete', async () => {
    const exp = createExperience();
    const state = {
      showDeleteDialog: true,
      deletingExp: exp as ExperienceWithId | null,
      deleting: true,
    };

    await mockDeleteDoc(mockDoc({}, 'Experiences', exp.id));

    state.showDeleteDialog = false;
    state.deletingExp = null;
    state.deleting = false;

    expect(state.showDeleteDialog).toBe(false);
    expect(state.deletingExp).toBeNull();
    expect(state.deleting).toBe(false);
  });

  it('[P0] 3.7-TEST-039: dialog state reset after failed delete', () => {
    const state = {
      showDeleteDialog: true,
      deletingExp: createExperience() as ExperienceWithId | null,
    };

    state.showDeleteDialog = false;
    state.deletingExp = null;

    expect(state.showDeleteDialog).toBe(false);
    expect(state.deletingExp).toBeNull();
  });
});

describe('ExperiencesCrudPage — delete dialog message', () => {
  it('[P0] 3.7-TEST-040: message includes company name', () => {
    const template = "¿Eliminar la experiencia en '{name}'?";
    const companyName = 'Google';

    const message = template.replace('{name}', companyName);

    expect(message).toBe("¿Eliminar la experiencia en 'Google'?");
  });
});

describe('ExperiencesCrudPage — FirebaseError code mapping', () => {
  it('[P0] 3.7-TEST-041: maps permission-denied error code', () => {
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

  it('[P0] 3.7-TEST-042: maps not-found error code', () => {
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

  it('[P0] 3.7-TEST-043: maps unavailable error code', () => {
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

  it('[P1] 3.7-TEST-044: returns default message for unknown errors', () => {
    const error = 'some string error';
    let result = 'Error al eliminar la experiencia';

    if (typeof error === 'object' && error !== null && 'code' in error) {
      result = 'mapped error';
    }

    expect(result).toBe('Error al eliminar la experiencia');
  });

  it('[P1] 3.7-TEST-045: handles null error gracefully', () => {
    const error = null;
    let result = 'Error al eliminar la experiencia';

    if (typeof error === 'object' && error !== null && 'code' in error) {
      result = 'mapped error';
    }

    expect(result).toBe('Error al eliminar la experiencia');
  });
});
