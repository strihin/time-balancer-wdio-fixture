import { LOCKED_OUT_MSG } from '@constants/index';
import { users } from '@fixtures/users';
import { LoginSelectors as LoginSel } from '@selectors/login.selectors';

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('logs in with valid credentials', () => {
    cy.get(LoginSel.username).type(users.standard.username);
    cy.get(LoginSel.password).type(users.standard.password);
    cy.get(LoginSel.loginButton).click();
    cy.get(LoginSel.inventoryList).should('be.visible');
  });

  it('shows error for locked-out user', () => {
    cy.get(LoginSel.username).type(users.locked.username);
    cy.get(LoginSel.password).type(users.locked.password);
    cy.get(LoginSel.loginButton).click();
    cy.get(LoginSel.error).should('contain.text', LOCKED_OUT_MSG);
  });

  it('shows error for wrong password', () => {
    cy.get(LoginSel.username).type(users.wrongPassword.username);
    cy.get(LoginSel.password).type(users.wrongPassword.password);
    cy.get(LoginSel.loginButton).click();
    cy.get(LoginSel.error).should('be.visible');
  });

  it('shows error when both fields are empty', () => {
    cy.get(LoginSel.loginButton).click();
    cy.get(LoginSel.error).should('be.visible');
  });

  it('redirects to /inventory.html after login', () => {
    cy.get(LoginSel.username).type(users.standard.username);
    cy.get(LoginSel.password).type(users.standard.password);
    cy.get(LoginSel.loginButton).click();
    cy.url().should('include', '/inventory.html');
  });
});
