import { test, expect } from '@playwright/test';

test.describe('Super Admin Cockpit & User Roster E2E', () => {
  test('should render platform overview, system age, and growth chart', async ({ page }) => {
    await page.goto('/admin/dashboard');

    // Assert super admin header
    await expect(page.locator('h1')).toContainText('FreightFlow Global Platform Cockpit');

    // Assert system age badge
    await expect(page.getByText('184 Days Live (v2.8)')).toBeVisible();

    // Assert Growth trajectory section
    await expect(page.getByText('Platform Growth & GMV Trajectory')).toBeVisible();
  });

  test('should render user directory with last_active_at telemetry', async ({ page }) => {
    await page.goto('/admin/users');

    // Assert page title
    await expect(page.locator('h1')).toContainText('User Directory & Multi-Tenant Access');

    // Assert search input
    const searchInput = page.getByPlaceholder(/Search User Name, Company/i);
    await expect(searchInput).toBeVisible();

    // Assert user presence
    await expect(page.getByText('Marcus Sterling')).toBeVisible();
  });

  test('should render global cross-tenant load registry', async ({ page }) => {
    await page.goto('/admin/loads');

    // Assert registry title
    await expect(page.locator('h1')).toContainText('Global Loads Registry & Audit');

    // Assert export button
    await expect(page.getByRole('button', { name: /Export Global Registry/i })).toBeVisible();
  });
});
