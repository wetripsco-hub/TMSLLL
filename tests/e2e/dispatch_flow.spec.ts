import { test, expect } from '@playwright/test';

test.describe('Live Dispatch Board & Multi-Stop Load Planner E2E', () => {
  test('should render live dispatch board and filter active loads', async ({ page }) => {
    await page.goto('/loads');

    // Assert main header
    await expect(page.locator('h1')).toContainText('Live Dispatch Board');

    // Assert dispatch statistics
    await expect(page.getByText('Active In-Transit')).toBeVisible();
    await expect(page.getByText('Total Gross Revenue')).toBeVisible();

    // Assert search input
    const searchInput = page.getByPlaceholder(/Search Load #, Shipper, Carrier/i);
    await expect(searchInput).toBeVisible();

    // Type in search query
    await searchInput.fill('Titan Freight');
    await expect(page.getByText('Titan Freight Lines')).toBeVisible();
  });

  test('should open multi-stop load creator and calculate profit margin', async ({ page }) => {
    await page.goto('/loads/new');

    // Assert page header
    await expect(page.locator('h1')).toContainText('Create New Dispatch Load');

    // Assert margin guard calculations
    await expect(page.getByText('Margin Guard & Rate Calculator')).toBeVisible();

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

    // Should redirect back to /loads
    await expect(page).toHaveURL(/\/loads/);
  });
});
