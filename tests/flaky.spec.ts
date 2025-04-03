import { expect, test } from '@playwright/test';

//Fix the below scripts to work consistently and do not use static waits. Add proper assertions to the tests
// Login 3 times sucessfully
test('Login multiple times sucessfully @c1', async ({ page }) => {
  await page.goto('/');
  await page.locator(`//*[@href='/challenge1.html']`).click();

  for (let i = 1; i <= 3; i++) {
    await page.locator('#email').fill(`test${i}@example.com`);
    await page.locator('#password').fill(`password${i}`);
    await page.locator('#submitButton').click();

    const successMessage = page.locator('#successMessage');
    await expect(successMessage).toContainText('Successfully submitted!');
    await expect(successMessage).toContainText(`Email: test${i}@example.com`);
    await expect(successMessage).toContainText(`Password: password${i}`);
    await expect(successMessage).toBeHidden();
  }
});

// Login and logout successfully with animated form and delayed loading
test('Login animated form and logout sucessfully @c2', async ({ page }) => {
  await page.goto('/');
  await page.locator(`//*[@href='/challenge2.html']`).click();
  await page.locator('#email').fill('test1@example.com');
  await page.locator('#password').fill('password1');

  const submitButton = page.locator('#submitButton');
  await submitButton.screenshot({ animations: 'disabled' });
  await submitButton.click();

  const menuButton = page.locator('#menuButton[data-initialized="true"]');
  await expect(menuButton).toBeVisible();
  await menuButton.click();

  await page.locator('#logoutOption').click();
  await expect(page.locator('#loginForm')).toBeVisible();
});

// Fix the Forgot password test and add proper assertions
test('Forgot password @c3', async ({ page }) => {
  await page.goto('/');
  await page.locator(`//*[@href='/challenge3.html']`).click();

  await page.getByRole('button', { name: 'Forgot Password?' }).click();

  await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();
  await page.locator('#email').fill('test@example.com');
  await page.locator('.submit-btn').click();

  await expect(page.getByRole('heading', { name: 'Success!' })).toBeVisible();
  await expect(page.locator('#mainContent')).toContainText('Password reset link sent!');
});

// //Fix the login test. Hint: There is a global variable that you can use to check if the app is in ready state
declare global {
  interface Window {
    isAppReady: boolean;
    isMenuOpen: boolean;
    setupEventHandlers: () => void;
  }
}
test('Login and logout @c4', async ({ page }) => {
  await page.goto('/');
  await page.locator(`//*[@href='/challenge4.html']`).click();

  await page.evaluate(() => {
    window.isAppReady = true;
    window.setupEventHandlers();
  });

  await page.locator('#email').fill('test@example.com');
  await page.locator('#password').fill('password');
  await page.locator('#submitButton').click();

  await expect(page.locator('#profileButton')).toBeVisible();
  await page.locator('#profileButton').click();

  await page.evaluate(() => {
    window.isMenuOpen = true;
    document.querySelector('#profileMenu')?.classList.add('show');
  });

  await page.locator('#logoutOption').click();
  await expect(page.locator('#loginForm')).toBeVisible();
});
