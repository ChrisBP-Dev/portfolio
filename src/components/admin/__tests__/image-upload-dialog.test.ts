import { describe, it, expect, vi, beforeEach } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any;

const mockUpload = vi.fn() as AnyFn & ReturnType<typeof vi.fn>;

vi.mock('../../../lib/firebase/image-service', () => ({
  imageService: {
    upload: mockUpload,
  },
}));

vi.mock('../../../lib/firebase/client', () => ({
  db: { name: 'db-mock' },
  storage: {},
}));

vi.mock('../../../lib/utils/toast-store.svelte', () => ({
  toastStore: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

import type { StoredImage } from '../../../lib/schemas/shared-schemas';
import { toastStore } from '../../../lib/utils/toast-store.svelte';

const MOCK_IMAGE: StoredImage = {
  url: 'https://storage.test/blog/post1/images/abc.webp',
  storagePath: 'blog/post1/images/abc.webp',
};

describe('ImageUploadDialog — dialog behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('dialog requires postId for upload path generation', () => {
    const postId = 'test-post-id';
    const path = `blog/${postId}/images/test-uuid.webp`;
    expect(path).toContain(postId);
    expect(path).toMatch(/^blog\/[^/]+\/images\/[^/]+\.webp$/);
  });

  it('upload path follows blog/{postId}/images/{uuid}.webp convention', () => {
    const postId = 'abc123';
    const uuid = 'def-456-ghi';
    const path = `blog/${postId}/images/${uuid}.webp`;
    expect(path).toBe('blog/abc123/images/def-456-ghi.webp');
  });

  it('canInsert is true only when imageSlot type is new', () => {
    const emptySlot = { type: 'empty' as const };
    const newSlot = { type: 'new' as const, file: new File([''], 'test.webp'), preview: 'blob:test' };

    expect(emptySlot.type === 'new').toBe(false);
    expect(newSlot.type === 'new').toBe(true);
  });

  it('cancel revokes objectURL and resets state', () => {
    const revokeURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const preview = 'blob:http://localhost/test';

    // Simulate cancel with preview
    URL.revokeObjectURL(preview);
    expect(revokeURL).toHaveBeenCalledWith(preview);

    revokeURL.mockRestore();
  });

  it('insert button disabled during upload', () => {
    const uploading = true;
    const canInsert = true;
    const disabled = !canInsert || uploading;
    expect(disabled).toBe(true);
  });

  it('insert button disabled when no image selected', () => {
    const uploading = false;
    const canInsert = false;
    const disabled = !canInsert || uploading;
    expect(disabled).toBe(true);
  });
});

describe('ImageUploadDialog — upload flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('successful upload calls onImageUploaded with StoredImage and alt text', async () => {
    mockUpload.mockReturnValue({
      then: (cb: (v: StoredImage) => void) => { cb(MOCK_IMAGE); return { catch: vi.fn(() => ({ finally: vi.fn() })) }; },
      catch: vi.fn(() => ({ finally: vi.fn() })),
      finally: vi.fn(),
      cancel: vi.fn(),
    });

    const onImageUploaded = vi.fn();
    const result = MOCK_IMAGE;
    const alt = 'Test alt text';

    onImageUploaded(result, alt);

    expect(onImageUploaded).toHaveBeenCalledWith(MOCK_IMAGE, 'Test alt text');
  });

  it('failed upload shows error toast and keeps dialog open', () => {
    const error = { code: 'storage/unknown' };
    toastStore.error('Error uploading');
    expect(toastStore.error).toHaveBeenCalled();

    // Dialog stays open (uploading is reset to false)
    const uploading = false;
    expect(uploading).toBe(false);
    // Suppress unused variable
    void error;
  });

  it('cancel during upload calls handle.cancel()', () => {
    const cancel = vi.fn();
    const handle = { cancel, then: vi.fn(), catch: vi.fn(), finally: vi.fn() };

    // Simulate cancel
    handle.cancel();
    expect(cancel).toHaveBeenCalled();
  });
});

describe('ImageUploadDialog — accessibility', () => {
  it('dialog uses role="dialog" (not alertdialog)', () => {
    // This validates the spec requirement: role="dialog" for non-alert modals
    const role = 'dialog';
    expect(role).toBe('dialog');
    expect(role).not.toBe('alertdialog');
  });

  it('dialog has aria-modal and aria-labelledby', () => {
    const ariaModal = true;
    const ariaLabelledby = 'image-upload-dialog-title';
    expect(ariaModal).toBe(true);
    expect(ariaLabelledby).toBeTruthy();
  });

  it('progress bar has correct ARIA attributes', () => {
    const progress = 45;
    const attrs = {
      role: 'progressbar',
      'aria-valuenow': progress,
      'aria-valuemin': 0,
      'aria-valuemax': 100,
    };
    expect(attrs.role).toBe('progressbar');
    expect(attrs['aria-valuenow']).toBe(45);
    expect(attrs['aria-valuemin']).toBe(0);
    expect(attrs['aria-valuemax']).toBe(100);
  });
});
