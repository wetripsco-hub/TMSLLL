import { test, expect } from '@playwright/test';

test.describe('Independent Truck Dispatcher Flow E2E', () => {
  test('should render fleet command center and adjust commission yield slider', async ({ page }) => {
    await page.goto('/dispatcher/dashboard');
    await expect(page.locator('h1')).toContainText('Fleet Dispatch Command Center');
    await expect(page.getByText('Dispatcher Fee Yield Calculator')).toBeVisible();
  });

  test('should view fleet trucks and open add truck modal', async ({ page }) => {
    await page.goto('/dispatcher/my-trucks');
    await expect(page.locator('h1')).toContainText('My Fleet Trucks & Driver Roster');

    const addTruckBtn = page.getByRole('button', { name: /Add Fleet Truck/i });
    await expect(addTruckBtn).toBeVisible();
    await addTruckBtn.click();
    await expect(page.getByText('Add Power Unit to Fleet')).toBeVisible();
  });

  test('should render factoring settlements billing page', async ({ page }) => {
    await page.goto('/dispatcher/billing');
    await expect(page.locator('h1')).toContainText('Factoring, Driver Settlements & Commission Ledger');
    await expect(page.getByText('Total Gross Fleet Linehaul')).toBeVisible();
  });
});
