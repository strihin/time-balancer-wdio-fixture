import { type User, users } from '@fixtures/users';
import { LoginSelectors as LoginSel } from '@selectors/login.selectors';

export const SAUCE_USER = users.standard.username;
export const SAUCE_PASS = users.standard.password;
export const GLITCH_USER = users.glitch.username;

export function login(user: User = users.standard): void {
  cy.visit('/');
  cy.clearLocalStorage();
  cy.get(LoginSel.username).type(user.username);
  cy.get(LoginSel.password).type(user.password);
  cy.get(LoginSel.loginButton).click();
  cy.get(LoginSel.inventoryList).should('be.visible');
}
