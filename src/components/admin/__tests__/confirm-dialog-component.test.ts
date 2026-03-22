/**
 * Component rendering test for ConfirmDialog — proof of concept
 * using @testing-library/svelte with Svelte 5.
 *
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/svelte';
import ConfirmDialogComponent from '../ConfirmDialog.svelte';
// Astro wraps Svelte component types with client directives — cast for testing-library compat
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ConfirmDialog = ConfirmDialogComponent as any;

afterEach(() => cleanup());

const baseProps = {
  open: true,
  title: 'Delete item?',
  message: 'This action cannot be undone.',
  confirmLabel: 'Delete',
  cancelLabel: 'Cancel',
  confirming: false,
  onConfirm: vi.fn(),
  onCancel: vi.fn(),
};

describe('ConfirmDialog — component rendering', () => {
  it('renders title and message when open', () => {
    render(ConfirmDialog, { props: baseProps });

    expect(screen.getByText('Delete item?')).toBeTruthy();
    expect(screen.getByText('This action cannot be undone.')).toBeTruthy();
  });

  it('does not render content when closed', () => {
    render(ConfirmDialog, { props: { ...baseProps, open: false } });

    expect(screen.queryByText('Delete item?')).toBeNull();
  });

  it('calls onConfirm when confirm button is clicked', async () => {
    const onConfirm = vi.fn();
    render(ConfirmDialog, { props: { ...baseProps, onConfirm } });

    await fireEvent.click(screen.getByText('Delete'));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const onCancel = vi.fn();
    render(ConfirmDialog, { props: { ...baseProps, onCancel } });

    await fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('disables both buttons during confirming state', () => {
    render(ConfirmDialog, { props: { ...baseProps, confirming: true } });

    const confirmBtn = screen.getByText('Delete').closest('button')!;
    const cancelBtn = screen.getByText('Cancel').closest('button')!;

    expect(confirmBtn.disabled).toBe(true);
    expect(cancelBtn.disabled).toBe(true);
  });

  it('has role="alertdialog" with correct aria attributes', () => {
    render(ConfirmDialog, { props: baseProps });

    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toBeTruthy();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-labelledby')).toBe('confirm-dialog-title');
    expect(dialog.getAttribute('aria-describedby')).toBe('confirm-dialog-message');
  });

  it('calls onCancel on Escape key when not confirming', async () => {
    const onCancel = vi.fn();
    render(ConfirmDialog, { props: { ...baseProps, onCancel } });

    const dialog = screen.getByRole('alertdialog');
    await fireEvent.keyDown(dialog, { key: 'Escape' });

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('blocks Escape key during confirming state', async () => {
    const onCancel = vi.fn();
    render(ConfirmDialog, { props: { ...baseProps, onCancel, confirming: true } });

    const dialog = screen.getByRole('alertdialog');
    await fireEvent.keyDown(dialog, { key: 'Escape' });

    expect(onCancel).not.toHaveBeenCalled();
  });
});
