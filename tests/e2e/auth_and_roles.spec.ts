import { test, expect } from '@playwright/test';

test.describe('Portal Authentication & Role Segregation E2E', () => {
  test('should quick-login as Super Admin and land on Admin Dashboard', async ({ page }) => {
    await page.goto('/login');

    // Click Super Admin demo button
    const adminBtn = page.getByRole('button', { name: /Super Admin/i });
    await expect(adminBtn).toBeVisible();
    await adminBtn.click();

    // Verify redirected to /admin/dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    await expect(page.locator('h1')).toContainText('FreightFlow Global Platform Cockpit');
  });

  test('should quick-login as Freight Broker and land on Broker Dashboard', async ({ page }) => {
    await page.goto('/login');

    // Click Broker demo button
    const brokerBtn = page.getByRole('button', { name: /Broker \(3PL\)/i });
    await expect(brokerBtn).toBeVisible();
    await brokerBtn.click();

    // Verify redirected to /broker/dashboard
    await expect(page).toHaveURL(/\/broker\/dashboard/);
    await expect(page.locator('h1')).toContainText('Brokerage Command Center');
  });

  test('should quick-login as Truck Dispatcher and land on Dispatcher Dashboard', async ({ page }) => {
    await page.goto('/login');

    // Click Dispatcher demo button
    const dispatcherBtn = page.getByRole('button', { name: /Dispatcher/i }).first();
    await expect(dispatcherBtn).toBeVisible();
    await dispatcherBtn.click();

    // Verify redirected to /dispatcher/dashboard
    await expect(page).toHaveURL(/\/dispatcher\/dashboard/);
    await expect(page.locator('h1')).toContainText('Fleet Dispatch Command Center');
  });
});
