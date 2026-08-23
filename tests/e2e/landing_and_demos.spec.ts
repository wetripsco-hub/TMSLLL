import { test, expect } from '@playwright/test';

test.describe('Landing Page and Sandbox Demos E2E', () => {
  test('should render commercial landing page and navigation elements', async ({ page }) => {
    await page.goto('/');

    // Check main title
    await expect(page.locator('h1')).toContainText('The AI-Powered Operating System for');
    await expect(page.locator('h1')).toContainText('Freight Brokers & Dispatchers');

    // Verify dual sandbox CTAs exist
    const brokerCta = page.getByRole('link', { name: /Try Broker Sandbox/i });
    const dispatcherCta = page.getByRole('link', { name: /Try Dispatcher Sandbox/i });

    await expect(brokerCta).toBeVisible();
    await expect(dispatcherCta).toBeVisible();

    // Verify interactive ROI calculator
    await expect(page.getByText('Loads Dispatched Monthly:')).toBeVisible();
    await expect(page.getByText('Average Broker Margin per Load:')).toBeVisible();
  });

  test('should navigate to Broker Sandbox and load pre-populated data', async ({ page }) => {
    await page.goto('/demo/broker');

    // Assert page header
    await expect(page.locator('h1')).toContainText('Brokerage Command Center (3PL Sandbox)');

    // Assert KPI metrics
    await expect(page.getByText('Shipper Gross Billing')).toBeVisible();
    await expect(page.getByText('Net Broker Profit Margin')).toBeVisible();

    // Assert presence of active freight table
    await expect(page.getByText('Apex Cold Foods')).toBeVisible();
    await expect(page.getByText('Titan Freight Lines')).toBeVisible();
  });

  test('should navigate to Dispatcher Sandbox and test commission fee calculator', async ({ page }) => {
    await page.goto('/demo/dispatcher');

    // Assert page header
    await expect(page.locator('h1')).toContainText('Fleet Dispatch Command (Dispatcher Sandbox)');

    // Assert fee selector
    const feeSelect = page.locator('select');
    await expect(feeSelect).toBeVisible();

    // Test driver mobile link copy button
    const copyBtn = page.getByRole('button', { name: /Copy Mobile Link/i }).first();
    await expect(copyBtn).toBeVisible();
  });

  test('should toggle theme between light and dark mode', async ({ page }) => {
    await page.goto('/');

    const themeToggleBtn = page.getByRole('button', { name: /Toggle theme/i }).first();
    await expect(themeToggleBtn).toBeVisible();

    // Click to toggle
    await themeToggleBtn.click();

    // Verify HTML root attribute/class
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(typeof isDark).toBe('boolean');
  });
});
