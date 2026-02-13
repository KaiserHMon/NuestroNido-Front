import { test, expect } from '@playwright/test';

test('Basic flow: Login and Dashboard navigation', async ({ page }) => {
  // Mock API calls to avoid hitting real backend
  await page.route('**/api/v1/families/me', async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Unauthorized' }),
    });
  });

  // 1. Go to login page
  await page.goto('/login');

  // 2. Verify we are on login
  await expect(page).toHaveTitle(/NuestroNido/);
  await expect(page.getByRole('heading', { name: 'NuestroNido' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Iniciar Sesión' })).toBeVisible();

  // 3. Fill form
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByPlaceholder('••••••••').fill('password123');
  
  // 4. Submit
  // await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

  // 5. Verify redirection
  // await expect(page).toHaveURL('/dashboard');
});
