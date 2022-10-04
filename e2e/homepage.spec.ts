import { test, expect } from '@playwright/test';

test.describe('homepage', () => {
  test('homepage has a container for posts', async ({ page }) => {
    await page.goto('/');

    const posts = page.locator('[data-test=posts]');
    await expect(posts).toBeVisible();
  });
  test('homepage post leads to post page', async ({ page }) => {
    await page.goto('/');

    await page.locator('[data-test=post-link]').first().click();
    const postPage = page.locator('[data-test=post-page]');
    await expect(postPage).toBeVisible();
  });
});
