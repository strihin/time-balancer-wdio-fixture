export const suites: Record<string, string[]> = {
  login: ['cypress/e2e/login.cy.ts'],
  inventory: ['cypress/e2e/inventory.cy.ts'],
  cart: ['cypress/e2e/cart.cy.ts'],
  checkout: ['cypress/e2e/checkout.cy.ts'],
  'checkout-validation': ['cypress/e2e/checkout-validation.cy.ts'],
  'checkout-multi-item': ['cypress/e2e/checkout-multi-item.cy.ts'],
  product: ['cypress/e2e/product.cy.ts'],
  logout: ['cypress/e2e/logout.cy.ts'],
  sorting: ['cypress/e2e/sorting.cy.ts'],
  'user-journey': ['cypress/e2e/user-journey.cy.ts'],
};
