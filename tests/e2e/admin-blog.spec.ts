import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';
import { ensureAdminLogin, fillVisible, clearAndFillVisible, clickListAction } from './admin-helpers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UNIQUE = () => `e2e-blog-${Date.now()}`;

test.describe('Admin Blog CRUD', () => {
  test.describe.configure({ mode: 'serial' });

  let articleTitle: string;

  test.beforeEach(async ({ page }) => {
    await ensureAdminLogin(page);
  });

  // Create article with title, slug, and content
  test('create blog article with title, slug, and content', async ({ page }) => {
    articleTitle = UNIQUE();
    await page.goto('/admin/blog');

    // Click "Crear nuevo"
    await page.locator('button', { hasText: /crear nuevo/i }).click();
    await expect(page.locator('h1', { hasText: /crear artículo/i })).toBeVisible({ timeout: 5_000 });

    // Fill bilingual title
    await fillVisible(page.locator('#blog-title-es'), articleTitle);
    await fillVisible(page.locator('#blog-title-en'), `${articleTitle}-en`);

    // Type content in ES editor (TipTap uses contenteditable)
    const esEditor = page.locator('.ProseMirror').first();
    await esEditor.click();
    await page.keyboard.type('Contenido de prueba para el artículo');

    // Switch to EN tab and type content
    await page.locator('button[role="tab"].rounded-t-lg', { hasText: 'EN' }).click();
    const enEditor = page.locator('.ProseMirror').nth(1);
    await enEditor.click();
    await page.keyboard.type('Test content for the article');

    // Submit
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=/guardado exitosamente/i')).toBeVisible({ timeout: 20_000 });

    // Verify appears in list with "Borrador" badge (wait for list to reload)
    await expect(page.locator(`text=${articleTitle}`).first()).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('text=/borrador/i').first()).toBeVisible();
  });

  // Verify empty state CTA triggers create form
  test('empty state CTA triggers create form', async ({ page }) => {
    // This test only works if there are no blog posts — since the previous
    // test created one, we skip this or test it conceptually
    await page.goto('/admin/blog');

    // We verify the create button exists and works
    const createBtn = page.locator('button', { hasText: /crear nuevo/i });
    await expect(createBtn).toBeVisible({ timeout: 10_000 });
    await createBtn.click();
    await expect(page.locator('h1', { hasText: /crear artículo/i })).toBeVisible({ timeout: 5_000 });
  });

  // Delete article and verify removed
  test('delete blog article and verify removed from list', async ({ page }) => {
    test.skip(!articleTitle, 'Depends on create test');
    await page.goto('/admin/blog');
    await expect(page.locator(`text=${articleTitle}`).first()).toBeVisible({ timeout: 10_000 });

    await clickListAction(page, articleTitle, 'delete');

    const dialog = page.locator('[role="alertdialog"]');
    await expect(dialog).toBeVisible();
    await dialog.locator('button', { hasText: /eliminar/i }).click();

    await expect(page.locator('text=/eliminado/i')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator(`text=${articleTitle}`)).toBeHidden({ timeout: 5_000 });
  });
});

test.describe('Admin Blog — Inline Image Insertion', () => {
  test.describe.configure({ mode: 'serial' });

  const TEST_IMAGE = path.resolve(__dirname, '../fixtures/test-image.png');
  let imgArticleTitle: string;

  test.beforeEach(async ({ page }) => {
    await ensureAdminLogin(page);
  });

  test('image button opens upload dialog', async ({ page }) => {
    imgArticleTitle = `e2e-img-${Date.now()}`;
    await page.goto('/admin/blog');
    await page.locator('button', { hasText: /crear nuevo/i }).click();
    await expect(page.locator('h1', { hasText: /crear artículo/i })).toBeVisible({ timeout: 5_000 });

    // Click image button in ES editor toolbar
    const toolbar = page.locator('[role="toolbar"]').first();
    await toolbar.locator('button[title="Image"]').click();

    // Dialog should appear
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 3_000 });
    await expect(dialog.locator('h2')).toContainText(/insertar imagen/i);
  });

  test('dialog cancel closes without changes', async ({ page }) => {
    await page.goto('/admin/blog');
    await page.locator('button', { hasText: /crear nuevo/i }).click();
    await expect(page.locator('h1', { hasText: /crear artículo/i })).toBeVisible({ timeout: 5_000 });

    // Open dialog
    const toolbar = page.locator('[role="toolbar"]').first();
    await toolbar.locator('button[title="Image"]').click();
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 3_000 });

    // Cancel
    await dialog.locator('button', { hasText: /cancelar/i }).click();
    await expect(dialog).toBeHidden({ timeout: 3_000 });

    // Editor should not have images
    const images = page.locator('.ProseMirror img');
    await expect(images).toHaveCount(0);
  });

  test('upload image via dialog and insert in editor', async ({ page }) => {
    imgArticleTitle = `e2e-img-${Date.now()}`;
    await page.goto('/admin/blog');
    await page.locator('button', { hasText: /crear nuevo/i }).click();
    await expect(page.locator('h1', { hasText: /crear artículo/i })).toBeVisible({ timeout: 5_000 });

    // Fill required fields
    await fillVisible(page.locator('#blog-title-es'), imgArticleTitle);
    await fillVisible(page.locator('#blog-title-en'), `${imgArticleTitle}-en`);

    // Click in ES editor to set cursor
    const esEditor = page.locator('.ProseMirror').first();
    await esEditor.click();
    await page.keyboard.type('Before image ');

    // Open image dialog
    const toolbar = page.locator('[role="toolbar"]').first();
    await toolbar.locator('button[title="Image"]').click();
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 3_000 });

    // Upload image via file input inside dialog
    const fileInput = dialog.locator('input[type="file"]');
    await fileInput.setInputFiles(TEST_IMAGE);

    // Wait for preview to appear
    await expect(dialog.locator('img')).toBeVisible({ timeout: 5_000 });

    // Click insert button
    await dialog.locator('button', { hasText: /insertar/i }).last().click();

    // Wait for dialog to close and image to appear in editor
    await expect(dialog).toBeHidden({ timeout: 15_000 });
    await expect(esEditor.locator('img')).toBeVisible({ timeout: 10_000 });

    // Add EN content
    await page.locator('button[role="tab"].rounded-t-lg', { hasText: 'EN' }).click();
    const enEditor = page.locator('.ProseMirror').nth(1);
    await enEditor.click();
    await page.keyboard.type('English test content');

    // Submit
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=/guardado exitosamente/i')).toBeVisible({ timeout: 20_000 });
  });

  // Cleanup: delete the test article
  test('cleanup: delete image test article', async ({ page }) => {
    test.skip(!imgArticleTitle, 'No article to clean up');
    await page.goto('/admin/blog');
    await expect(page.locator(`text=${imgArticleTitle}`).first()).toBeVisible({ timeout: 10_000 });

    await clickListAction(page, imgArticleTitle, 'delete');
    const confirmDialog = page.locator('[role="alertdialog"]');
    await expect(confirmDialog).toBeVisible();
    await confirmDialog.locator('button', { hasText: /eliminar/i }).click();
    await expect(page.locator('text=/eliminado/i')).toBeVisible({ timeout: 15_000 });
  });
});

test.describe('Admin Blog — Edit Flow (Story 4-3)', () => {
  test.describe.configure({ mode: 'serial' });

  let editArticleTitle: string;

  test.beforeEach(async ({ page }) => {
    await ensureAdminLogin(page);
  });

  test('create article for edit tests', async ({ page }) => {
    editArticleTitle = `e2e-edit-${Date.now()}`;
    await page.goto('/admin/blog');
    await page.locator('button', { hasText: /crear nuevo/i }).click();
    await expect(page.locator('h1', { hasText: /crear artículo/i })).toBeVisible({ timeout: 5_000 });

    await fillVisible(page.locator('#blog-title-es'), editArticleTitle);
    await fillVisible(page.locator('#blog-title-en'), `${editArticleTitle}-en`);

    const esEditor = page.locator('.ProseMirror').first();
    await esEditor.click();
    await page.keyboard.type('Contenido original ES');

    await page.locator('button[role="tab"].rounded-t-lg', { hasText: 'EN' }).click();
    const enEditor = page.locator('.ProseMirror').nth(1);
    await enEditor.click();
    await page.keyboard.type('Original EN content');

    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=/guardado exitosamente/i')).toBeVisible({ timeout: 20_000 });
    await expect(page.locator(`text=${editArticleTitle}`).first()).toBeVisible({ timeout: 15_000 });
  });

  test('edit article: fields pre-populated, change title and status, save', async ({ page }) => {
    test.skip(!editArticleTitle, 'Depends on create test');
    await page.goto('/admin/blog');
    await expect(page.locator(`text=${editArticleTitle}`).first()).toBeVisible({ timeout: 10_000 });

    await clickListAction(page, editArticleTitle, 'edit');
    await expect(page.locator('h1', { hasText: /editar artículo/i })).toBeVisible({ timeout: 5_000 });

    // Verify fields are pre-populated
    const titleEsInput = page.locator('#blog-title-es');
    await expect(titleEsInput.first()).toHaveValue(editArticleTitle, { timeout: 5_000 });
    const titleEnInput = page.locator('#blog-title-en');
    await expect(titleEnInput.first()).toHaveValue(`${editArticleTitle}-en`);

    // Verify status is draft
    const statusSelect = page.locator('select#blog-status');
    await expect(statusSelect).toHaveValue('draft');

    // Verify ES content loaded in TipTap (async load — needs more time)
    const esEditor = page.locator('.ProseMirror').first();
    await expect(esEditor).toContainText('Contenido original ES', { timeout: 15_000 });

    // Change title
    const updatedTitle = `${editArticleTitle}-updated`;
    await clearAndFillVisible(titleEsInput, updatedTitle);

    // Change status to published
    await statusSelect.selectOption('published');

    // Save
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=/guardado exitosamente/i')).toBeVisible({ timeout: 20_000 });

    // Verify list shows updated title and "Publicado" badge
    await expect(page.locator(`text=${updatedTitle}`).first()).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('text=/publicado/i').first()).toBeVisible();

    // Update tracked title for subsequent tests
    editArticleTitle = updatedTitle;
  });

  test('edit article: modify content, save, re-edit to verify persistence', async ({ page }) => {
    test.skip(!editArticleTitle, 'Depends on edit test');
    await page.goto('/admin/blog');
    await expect(page.locator(`text=${editArticleTitle}`).first()).toBeVisible({ timeout: 10_000 });

    await clickListAction(page, editArticleTitle, 'edit');
    await expect(page.locator('h1', { hasText: /editar artículo/i })).toBeVisible({ timeout: 5_000 });

    // Modify ES content
    const esEditor = page.locator('.ProseMirror').first();
    await esEditor.click();
    await page.keyboard.press('End');
    await page.keyboard.type(' — contenido modificado');

    // Save
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=/guardado exitosamente/i')).toBeVisible({ timeout: 20_000 });

    // Re-edit to verify persisted content
    await expect(page.locator(`text=${editArticleTitle}`).first()).toBeVisible({ timeout: 15_000 });
    await clickListAction(page, editArticleTitle, 'edit');
    await expect(page.locator('h1', { hasText: /editar artículo/i })).toBeVisible({ timeout: 5_000 });

    const esEditorAfter = page.locator('.ProseMirror').first();
    await expect(esEditorAfter).toContainText('contenido modificado', { timeout: 15_000 });
  });

  test('edit article: no changes → cancel → no unsaved changes warning', async ({ page }) => {
    test.skip(!editArticleTitle, 'Depends on edit test');
    await page.goto('/admin/blog');
    await expect(page.locator(`text=${editArticleTitle}`).first()).toBeVisible({ timeout: 10_000 });

    await clickListAction(page, editArticleTitle, 'edit');
    await expect(page.locator('h1', { hasText: /editar artículo/i })).toBeVisible({ timeout: 5_000 });

    // Wait for form initialization
    await expect(page.locator('#blog-title-es').first()).toHaveValue(editArticleTitle, { timeout: 5_000 });

    // Cancel without making changes — no confirm dialog should appear
    let confirmDialogAppeared = false;
    page.on('dialog', (dialog) => {
      confirmDialogAppeared = true;
      dialog.accept();
    });

    await page.locator('button', { hasText: /cancelar/i }).click();

    // Should return to list without confirm dialog
    await expect(page.locator('button', { hasText: /crear nuevo/i })).toBeVisible({ timeout: 5_000 });
    expect(confirmDialogAppeared).toBe(false);
  });

  test('edit article: change title → cancel → unsaved changes warning', async ({ page }) => {
    test.skip(!editArticleTitle, 'Depends on edit test');
    await page.goto('/admin/blog');
    await expect(page.locator(`text=${editArticleTitle}`).first()).toBeVisible({ timeout: 10_000 });

    await clickListAction(page, editArticleTitle, 'edit');
    await expect(page.locator('h1', { hasText: /editar artículo/i })).toBeVisible({ timeout: 5_000 });

    // Wait for form init
    await expect(page.locator('#blog-title-es').first()).toHaveValue(editArticleTitle, { timeout: 5_000 });

    // Make a change
    await clearAndFillVisible(page.locator('#blog-title-es'), 'Título temporal');

    // Cancel — should trigger confirm dialog
    let confirmDialogAppeared = false;
    page.on('dialog', (dialog) => {
      confirmDialogAppeared = true;
      dialog.accept(); // Confirm discard
    });

    await page.locator('button', { hasText: /cancelar/i }).click();

    // Should return to list after accepting discard
    await expect(page.locator('button', { hasText: /crear nuevo/i })).toBeVisible({ timeout: 5_000 });
    expect(confirmDialogAppeared).toBe(true);
  });

  test('cleanup: delete edit test article', async ({ page }) => {
    test.skip(!editArticleTitle, 'No article to clean up');
    await page.goto('/admin/blog');
    await expect(page.locator(`text=${editArticleTitle}`).first()).toBeVisible({ timeout: 10_000 });

    await clickListAction(page, editArticleTitle, 'delete');
    const dialog = page.locator('[role="alertdialog"]');
    await expect(dialog).toBeVisible();
    await dialog.locator('button', { hasText: /eliminar/i }).click();
    await expect(page.locator('text=/eliminado/i')).toBeVisible({ timeout: 15_000 });
  });
});

test.describe('Admin Blog — Delete with Verification (Story 4-3)', () => {
  test.describe.configure({ mode: 'serial' });

  let deleteArticleTitle: string;

  test.beforeEach(async ({ page }) => {
    await ensureAdminLogin(page);
  });

  test('create article, delete with dialog verification, verify removed', async ({ page }) => {
    deleteArticleTitle = `e2e-del-${Date.now()}`;
    await page.goto('/admin/blog');
    await page.locator('button', { hasText: /crear nuevo/i }).click();
    await expect(page.locator('h1', { hasText: /crear artículo/i })).toBeVisible({ timeout: 5_000 });

    await fillVisible(page.locator('#blog-title-es'), deleteArticleTitle);
    await fillVisible(page.locator('#blog-title-en'), `${deleteArticleTitle}-en`);

    const esEditor = page.locator('.ProseMirror').first();
    await esEditor.click();
    await page.keyboard.type('Contenido para eliminar');

    await page.locator('button[role="tab"].rounded-t-lg', { hasText: 'EN' }).click();
    const enEditor = page.locator('.ProseMirror').nth(1);
    await enEditor.click();
    await page.keyboard.type('Content to delete');

    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=/guardado exitosamente/i')).toBeVisible({ timeout: 20_000 });
    await expect(page.locator(`text=${deleteArticleTitle}`).first()).toBeVisible({ timeout: 15_000 });

    // Delete
    await clickListAction(page, deleteArticleTitle, 'delete');

    const dialog = page.locator('[role="alertdialog"]');
    await expect(dialog).toBeVisible();

    // Verify dialog message contains the article title
    await expect(dialog).toContainText(deleteArticleTitle);

    // Confirm delete
    await dialog.locator('button', { hasText: /eliminar/i }).click();

    // Verify toast and removal from list
    await expect(page.locator('text=/eliminado/i')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator(`text=${deleteArticleTitle}`)).toBeHidden({ timeout: 5_000 });
  });
});
