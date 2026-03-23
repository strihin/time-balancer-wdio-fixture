import { LOCKED_OUT_MSG } from '@constants/index';
import { users } from '@fixtures/users';
import { LoginSelectors as LoginSel } from '@selectors/login.selectors';

describe('Login', () => {
  beforeEach(async () => {
    await browser.url('/');
  });

  it('logs in with valid credentials', async () => {
    await $(LoginSel.username).setValue(users.standard.username);
    await $(LoginSel.password).setValue(users.standard.password);
    await $(LoginSel.loginButton).click();
    await expect($(LoginSel.inventoryList)).toBeDisplayed();
  });

  it('shows error for locked-out user', async () => {
    await $(LoginSel.username).setValue(users.locked.username);
    await $(LoginSel.password).setValue(users.locked.password);
    await $(LoginSel.loginButton).click();
    await expect($(LoginSel.error)).toHaveText(expect.stringContaining(LOCKED_OUT_MSG));
  });

  it('shows error for wrong password', async () => {
    await $(LoginSel.username).setValue(users.wrongPassword.username);
    await $(LoginSel.password).setValue(users.wrongPassword.password);
    await $(LoginSel.loginButton).click();
    await expect($(LoginSel.error)).toBeDisplayed();
  });

  it('shows error when both fields are empty', async () => {
    await $(LoginSel.loginButton).click();
    await expect($(LoginSel.error)).toBeDisplayed();
  });

  it('redirects to /inventory.html after login', async () => {
    await $(LoginSel.username).setValue(users.standard.username);
    await $(LoginSel.password).setValue(users.standard.password);
    await $(LoginSel.loginButton).click();
    await $(LoginSel.inventoryList).waitForDisplayed({ timeout: 10000 });
    const url = await browser.getUrl();
    expect(url).toContain('/inventory.html');
  });
});
