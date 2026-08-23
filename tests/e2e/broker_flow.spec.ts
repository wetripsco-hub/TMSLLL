import { test, expect } from '@playwright/test';

test.describe('Freight Brokerage Enterprise Flow E2E', () => {
  test('should render brokerage dispatch board and filter active loads', async ({ page }) => {
    await page.goto('/broker/loads');
    await expect(page.locator('h1')).toContainText('Brokerage Dispatch Board');

    // Search filter
    const searchInput = page.getByPlaceholder(/Search Load #, Shipper, Carrier/i);
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Titan');
    await expect(page.getByText('Titan Freight Lines')).toBeVisible();
  });

  test('should create a multi-stop load with Margin Guard alert', async ({ page }) => {
    await page.goto('/broker/loads/new');
    await expect(page.locator('h1')).toContainText('Create New Brokerage Load');
    await expect(page.getByText('Broker Margin Guard')).toBeVisible();

    // Add intermediate stop
    const addStopBtn = page.getByRole('button', { name: /Add Intermediate Stop/i });
    await expect(addStopBtn).toBeVisible();
    await addStopBtn.click();

    // Submit and redirect
    const submitBtn = page.getByRole('button', { name: /Book & Dispatch Load/i });
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();
    await expect(page).toHaveURL(/\/broker\/loads/);
  });

  test('should open shipper CRM and display credit limits', async ({ page }) => {
    await page.goto('/broker/shippers');
    await expect(page.locator('h1')).toContainText('Customer CRM & Credit Ledger');
    await expect(page.getByText('Total Credit Extended')).toBeVisible();
  });
});
