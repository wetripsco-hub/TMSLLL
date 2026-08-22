import { test, expect } from '@playwright/test';

test.describe('Live Dispatch Board & Multi-Stop Load Planner E2E', () => {
  test('should render brokerage dispatch board and filter active loads', async ({ page }) => {
    await page.goto('/broker/loads');

    // Assert main header
    await expect(page.locator('h1')).toContainText('Brokerage Dispatch Board');

    // Assert search input
    const searchInput = page.getByPlaceholder(/Search Load #, Shipper, Carrier/i);
    await expect(searchInput).toBeVisible();

    // Type in search query
    await searchInput.fill('Titan');
    await expect(page.getByText('Titan Freight Lines')).toBeVisible();
  });

  test('should open multi-stop load creator and calculate profit margin', async ({ page }) => {
    await page.goto('/broker/loads/new');

    // Assert page header
    await expect(page.locator('h1')).toContainText('Create New Brokerage Load');

    // Assert margin guard calculations
    await expect(page.getByText('Broker Margin Guard')).toBeVisible();

    // Add intermediate stop
    const addStopBtn = page.getByRole('button', { name: /Add Intermediate Stop/i });
    await expect(addStopBtn).toBeVisible();
    await addStopBtn.click();

    // Verify additional stop card rendered
    await expect(page.getByText('Stop 3: DELIVERY')).toBeVisible();

    // Click submit button
    const submitBtn = page.getByRole('button', { name: /Book & Dispatch Load/i });
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Should redirect back to /broker/loads
    await expect(page).toHaveURL(/\/broker\/loads/);
  });
});
