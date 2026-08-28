import { test, expect } from '@playwright/test';

test('Basic flow: Login page rendering and form inputs', async ({ page }) => {
  // Mock API calls to avoid hitting real backend during e2e
  await page.route('**/api/v1/families/me', async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Unauthorized' }),
    });
  });

  await page.route('**/api/v1/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        token: 'fake-jwt-token',
      }),
    });
  });

  // 1. Go to login page
  await page.goto('/login');

  // 2. Verify we are on login
  await expect(page).toHaveTitle(/NuestroNido/);
  await expect(page.getByRole('heading', { name: 'NuestroNido' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Iniciar Sesión' })).toBeVisible();

  // 3. Fill form
  await page.getByLabel(/Email/i).fill('test@example.com');
  await page.getByPlaceholder(/Ingresa tu contraseña/i).fill('password123');

  // 4. Verify submit button is enabled and interactable
  const submitButton = page.getByRole('button', { name: 'Iniciar Sesión' });
  await expect(submitButton).toBeEnabled();
});

