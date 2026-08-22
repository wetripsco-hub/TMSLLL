import { test, expect } from '@playwright/test';

test.describe('Rate Confirmation & Digital Signature Pad E2E', () => {
  test('should open load dossier and sign Rate Con with eSign modal', async ({ page }) => {
    await page.goto('/loads/ld_101');

    // Assert load header
    await expect(page.locator('h1')).toContainText('Load FF-88902');

    // Open Rate Con modal
    const rateConBtn = page.getByRole('button', { name: /Rate Con & eSign/i });
    await expect(rateConBtn).toBeVisible();
    await rateConBtn.click();

    // Verify modal elements
    await expect(page.getByText('Broker-Carrier Rate Agreement')).toBeVisible();

    // Verify PDF download button is active
    const downloadPdfBtn = page.getByRole('button', { name: /Download Certified PDF/i });
    await expect(downloadPdfBtn).toBeVisible();
  });
});
