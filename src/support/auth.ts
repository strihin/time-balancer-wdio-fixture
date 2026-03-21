import { users, type User } from '@fixtures/users';
import { LoginSelectors as LoginSel } from '@selectors/login.selectors';

export const SAUCE_USER = users.standard.username;
export const SAUCE_PASS = users.standard.password;
export const GLITCH_USER = users.glitch.username;

export async function login(user: User = users.standard): Promise<void> {
  await browser.url('/');
  // Reset cart & session state stored in localStorage between tests
  await browser.execute(() => localStorage.clear());
  await $(LoginSel.username).setValue(user.username);
  await $(LoginSel.password).setValue(user.password);
  await $(LoginSel.loginButton).click();
  await $(LoginSel.inventoryList).waitForDisplayed({ timeout: 15000 });
}
