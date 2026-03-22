import { login } from '@support/auth';
import { NavSelectors as NavSel } from '@selectors/nav.selectors';
import { LoginSelectors as LoginSel } from '@selectors/login.selectors';
import { users } from '@fixtures/users';

describe('Logout', () => {
  beforeEach(async () => {
    await login();
  });

  it('burger menu button is visible', async () => {
    await expect($(NavSel.burgerMenuBtn)).toBeDisplayed();
  });

  it('opens side menu on burger click', async () => {
    await $(NavSel.burgerMenuBtn).click();
    await expect($(NavSel.logoutLink)).toBeDisplayed();
  });

  it('logout link redirects to login page', async () => {
    await $(NavSel.burgerMenuBtn).click();
    await $(NavSel.logoutLink).click();
    await expect($(LoginSel.loginButton)).toBeDisplayed();
  });

  it('session is cleared after logout', async () => {
    await $(NavSel.burgerMenuBtn).click();
    await $(NavSel.logoutLink).click();
    // Try accessing inventory directly — should redirect to login
    await browser.url('/inventory.html');
    await expect($(LoginSel.loginButton)).toBeDisplayed();
  });

  it('can re-login after logout', async () => {
    await $(NavSel.burgerMenuBtn).click();
    await $(NavSel.logoutLink).click();
    await login(users.standard);
    await expect($(NavSel.inventoryList)).toBeDisplayed();
  });
});

