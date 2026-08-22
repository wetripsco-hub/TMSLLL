import { test, expect } from '@playwright/test';

test.describe('Gemini 2.0 AI Document OCR Scanner E2E', () => {
  test('should load split-screen OCR canvas with extracted structured fields', async ({ page }) => {
    await page.goto('/documents');

    // Assert page header
    await expect(page.locator('h1')).toContainText('Gemini 2.0 AI Document OCR Scanner');

    // Verify document switcher tabs
    await expect(page.getByText('Rate_Con_Titan_88902.pdf')).toBeVisible();

    // Verify confidence score
    await expect(page.getByText(/Confidence: \d+%/)).toBeVisible();

    // Verify editable field inputs
    const loadInput = page.locator('input[value="FF-88902"]').first();
    await expect(loadInput).toBeVisible();

    // Test verify and push action
    const verifyPushBtn = page.getByRole('button', { name: /Verify & Push to Database/i });
    await expect(verifyPushBtn).toBeVisible();
    await verifyPushBtn.click();

    // Verify confirmed state
    await expect(page.getByText('Verified & Synced to Database')).toBeVisible();
  });
});
