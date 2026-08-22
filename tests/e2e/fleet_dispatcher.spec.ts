import { test, expect } from '@playwright/test';

test.describe('Dispatcher Fleet & Telematics E2E', () => {
  test('should render dispatcher dashboard and test commission fee calculator', async ({ page }) => {
    await page.goto('/dispatcher/dashboard');

    // Assert page header
    await expect(page.locator('h1')).toContainText('Fleet Dispatch Command Center');

    // Assert yield calculator
    await expect(page.getByText('Dispatcher Fee Yield Calculator')).toBeVisible();

    // Verify unit presence
    await expect(page.getByText('Unit-101')).toBeVisible();
  });

  test('should render fleet roster and open add truck modal', async ({ page }) => {
    await page.goto('/dispatcher/my-trucks');

    // Assert page header
    await expect(page.locator('h1')).toContainText('My Fleet Trucks & Driver Roster');

    // Open Add Truck modal
    const addTruckBtn = page.getByRole('button', { name: /Add Fleet Truck/i });
    await expect(addTruckBtn).toBeVisible();
    await addTruckBtn.click();

    // Assert modal form
    await expect(page.getByText('Add Power Unit to Fleet')).toBeVisible();
  });

  test('should render live GPS tracking simulator', async ({ page }) => {
    await page.goto('/dispatcher/tracking');

    // Assert page header
    await expect(page.locator('h1')).toContainText('Live Fleet GPS Telematics & Tracking');

    // Assert map simulator and live feed badge
    await expect(page.getByText('Live Satellite Feed Active')).toBeVisible();
  });
});
