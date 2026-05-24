// cypress/e2e/01-navegacion.cy.js
// ============================================================
// SUITE 1 — Navegación entre pantallas
// ============================================================

describe('Navegación general', () => {

  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500');
  });

  it('muestra la pantalla de inicio al cargar', () => {
    cy.get('[data-testid="screen-home"]').should('be.visible');
    cy.get('h1').should('contain.text', 'AuthFlow');
  });

  it('el botón "Iniciar sesión" muestra el formulario de login', () => {
    cy.get('[data-testid="btn-go-login"]').click();
    cy.get('[data-testid="screen-login"]').should('be.visible');
    cy.get('[data-testid="screen-home"]').should('not.be.visible');
  });

  it('el botón "Registrarse" muestra el formulario de registro', () => {
    cy.get('[data-testid="btn-go-register"]').click();
    cy.get('[data-testid="screen-register"]').should('be.visible');
    cy.get('[data-testid="screen-home"]').should('not.be.visible');
  });

  it('el botón "Volver" desde login regresa al inicio', () => {
    cy.get('[data-testid="btn-go-login"]').click();
    cy.get('[data-testid="btn-back-login"]').click();
    cy.get('[data-testid="screen-home"]').should('be.visible');
  });

  it('el botón "Volver" desde registro regresa al inicio', () => {
    cy.get('[data-testid="btn-go-register"]').click();
    cy.get('[data-testid="btn-back-register"]').click();
    cy.get('[data-testid="screen-home"]').should('be.visible');
  });

  it('el link de login en registro navega al formulario de login', () => {
    cy.get('[data-testid="btn-go-register"]').click();
    cy.get('[data-testid="link-go-login"]').click();
    cy.get('[data-testid="screen-login"]').should('be.visible');
  });

  it('el link de registro en login navega al formulario de registro', () => {
    cy.get('[data-testid="btn-go-login"]').click();
    cy.get('[data-testid="link-go-register"]').click();
    cy.get('[data-testid="screen-register"]').should('be.visible');
  });

});
