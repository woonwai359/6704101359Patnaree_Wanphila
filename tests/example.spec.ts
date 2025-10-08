// tests/example.spec.ts
import { test, expect, Page } from '@playwright/test';

/** ---------- Bootstrapping ---------- **/
const gotoApp = async (page: Page) => {
  await page.goto('http://localhost:9000/#/');                 // ← your app URL
  await expect(page.locator('#q-app')).toBeVisible();          // Quasar root
  await expect(page.locator('form')).toBeVisible();            // form is rendered
};

/** ---------- Locator helpers ---------- **/
const fieldByLabel = (page: Page, label: string) =>
  page.locator('.q-field, .q-input').filter({ hasText: label });

// During Quasar enter/leave animations, two .q-field__messages can exist.
// Using .last() reliably picks the "entering/current" node.
const messagesOf = (page: Page, label: string) =>
  fieldByLabel(page, label).locator('.q-field__messages').last();

// Prefer accessible locators Quasar renders via <label for=...>
const nameInput   = (page: Page) => page.getByLabel('Your name');
const ageInput    = (page: Page) => page.getByLabel('Your age');
const submitBtn   = (page: Page) => page.getByRole('button', { name: /submit/i });
const resetBtn    = (page: Page) => page.getByRole('button', { name: /reset|clear/i });
const termsSwitch = (page: Page) => page.getByRole('switch', { name: /i accept/i });

/** ---------- Assertion helpers ---------- **/
const expectNoErrorMessages = async (page: Page) => {
  // Wait for any leaving transitions to finish
  await expect(page.locator('.q-transition--field-message-leave-active')).toHaveCount(0);
  // Ensure there are zero messages containing error-like text
  await expect(
    page.locator('.q-field__messages').filter({ hasText: /please|invalid|error/i })
  ).toHaveCount(0);
};

// Centralize copy variants your UI shows (add here if you see new texts)
const NAME_EMPTY_REGEX = /please type something/i;
const AGE_EMPTY_REGEX  = /please type (your|something) age/i;          // handles “Please type your age”
const AGE_NEG_REGEX    = /positive|greater than 0|invalid|please type (your|a real) age|please type something/i;

test.describe('Quasar Form Input Validation', () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp(page);
  });

  test('should validate name input', async ({ page }) => {
    await submitBtn(page).click(); // empty submit -> first invalid is name
    await expect(messagesOf(page, 'Your name')).toContainText(NAME_EMPTY_REGEX);

    await nameInput(page).fill('John Doe');

    // Re-submit to progress validation and ensure name no longer shows an *error*.
    await submitBtn(page).click();

    // Your UI keeps a neutral helper ("Name and surname"), so just ensure no error-like text.
    await expect(messagesOf(page, 'Your name')).not.toContainText(/please|invalid|error/i);
  });

  test('should validate age input', async ({ page }) => {
    // Make name valid first so validation proceeds to age
    await nameInput(page).fill('John Doe');

    await submitBtn(page).click(); // now age is first invalid
    await expect(messagesOf(page, 'Your age')).toContainText(AGE_EMPTY_REGEX);

    // Negative age -> show a different message (support your variants)
    await ageInput(page).fill('-1');
    await submitBtn(page).click();
    await expect(messagesOf(page, 'Your age')).toContainText(AGE_NEG_REGEX);
  });

  test('should handle terms acceptance', async ({ page }) => {
    await nameInput(page).fill('John Doe');
    await ageInput(page).fill('25');

    // Submit with terms OFF
    await submitBtn(page).click();
    await expect(termsSwitch(page)).toHaveAttribute('aria-checked', 'false');

    // Turn it ON and submit again
    await termsSwitch(page).click();
    await expect(termsSwitch(page)).toHaveAttribute('aria-checked', 'true');
    await submitBtn(page).click();

    // Instead of a success banner, assert that no error-like messages remain
    await expectNoErrorMessages(page);
  });

  test('should reset form inputs', async ({ page }) => {
    await nameInput(page).fill('John Doe');
    await ageInput(page).fill('25');

    // Toggle terms ON via accessible switch (native input is hidden)
    await termsSwitch(page).click();
    await expect(termsSwitch(page)).toHaveAttribute('aria-checked', 'true');

    await resetBtn(page).click();

    await expect(nameInput(page)).toHaveValue('');
    await expect(ageInput(page)).toHaveValue('');
    await expect(termsSwitch(page)).toHaveAttribute('aria-checked', 'false');
  });
});