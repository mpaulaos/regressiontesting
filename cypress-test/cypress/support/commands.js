// cypress/support/commands.js
// ============================================================
// Comandos personalizados reutilizables en todas las pruebas
// ============================================================

/**
 * Navega a la app y espera a que la pantalla de inicio esté visible.
 * Uso: cy.visitApp()
 */
Cypress.Commands.add('visitApp', () => {
  cy.visit('/');
  cy.get('[data-testid="screen-home"]').should('be.visible');
});

/**
 * Completa y envía el formulario de registro.
 * Uso: cy.fillRegisterForm({ username, email, password, confirm })
 */
Cypress.Commands.add('fillRegisterForm', ({ username = '', email = '', password = '', confirm = '' } = {}) => {
  if (username) cy.get('[data-testid="reg-username"]').clear().type(username);
  if (email)    cy.get('[data-testid="reg-email"]').clear().type(email);
  if (password) cy.get('[data-testid="reg-password"]').clear().type(password);
  if (confirm)  cy.get('[data-testid="reg-confirm"]').clear().type(confirm);
});

/**
 * Completa y envía el formulario de login.
 * Uso: cy.fillLoginForm({ email, password })
 */
Cypress.Commands.add('fillLoginForm', ({ email = '', password = '' } = {}) => {
  if (email)    cy.get('[data-testid="login-email"]').clear().type(email);
  if (password) cy.get('[data-testid="login-password"]').clear().type(password);
});

/**
 * Realiza un login exitoso completo y llega a la pantalla de bienvenida.
 * Uso: cy.loginSuccessfully()
 */
Cypress.Commands.add('loginSuccessfully', (email = 'test@ejemplo.com', password = 'password123') => {
  cy.visitApp();
  cy.get('[data-testid="btn-go-login"]').click();
  cy.fillLoginForm({ email, password });
  cy.get('[data-testid="btn-login-submit"]').click();
  cy.get('[data-testid="screen-welcome"]').should('be.visible');
});