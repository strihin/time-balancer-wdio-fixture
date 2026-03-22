import { login } from '@support/auth';
import { NavSelectors as NavSel } from '@selectors/nav.selectors';
import { LoginSelectors as LoginSel } from '@selectors/login.selectors';
import { users } from '@fixtures/users';

describe('Logout', () => {
  beforeEach(() => {
    login();
  });

  it('burger menu button is visible', () => {
    cy.get(NavSel.burgerMenuBtn).should('be.visible');
  });

  it('opens side menu on burger click', () => {
    cy.get(NavSel.burgerMenuBtn).click();
    cy.get(NavSel.logoutLink).should('be.visible');
  });

  it('logout link redirects to login page', () => {
    cy.get(NavSel.burgerMenuBtn).click();
    cy.get(NavSel.logoutLink).click();
    cy.get(LoginSel.loginButton).should('be.visible');
  });

  it('session is cleared after logout', () => {
    cy.get(NavSel.burgerMenuBtn).click();
    cy.get(NavSel.logoutLink).click();
    cy.visit('/inventory.html', { failOnStatusCode: false });
    cy.get(LoginSel.loginButton).should('be.visible');
  });

  it('can re-login after logout', () => {
    cy.get(NavSel.burgerMenuBtn).click();
    cy.get(NavSel.logoutLink).click();
    login(users.standard);
    cy.get(NavSel.inventoryList).should('be.visible');
  });
});
