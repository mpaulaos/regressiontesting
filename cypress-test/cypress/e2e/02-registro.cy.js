// cypress/e2e/02-registro.cy.js
// ============================================================
// SUITE 2 — Formulario de Registro
// Estas pruebas son las más útiles para demostrar regresión:
// si alguien rompe una validación, aquí se detecta.
// ============================================================

describe('Formulario de Registro', () => {

  beforeEach(() => {
    cy.visitApp();
    cy.get('[data-testid="btn-go-register"]').click();
    cy.get('[data-testid="screen-register"]').should('be.visible');
  });

  // ── Campos obligatorios ──────────────────────────────────

  it('muestra error si todos los campos están vacíos', () => {
    cy.get('[data-testid="btn-register-submit"]').click();
    cy.get('[data-testid="err-reg-username"]').should('not.be.empty');
    cy.get('[data-testid="err-reg-email"]').should('not.be.empty');
    cy.get('[data-testid="err-reg-password"]').should('not.be.empty');
    cy.get('[data-testid="err-reg-confirm"]').should('not.be.empty');
  });

  it('muestra error si falta el nombre de usuario', () => {
    cy.fillRegisterForm({
      email:    'usuario@test.com',
      password: 'password123',
      confirm:  'password123',
    });
    cy.get('[data-testid="btn-register-submit"]').click();
    cy.get('[data-testid="err-reg-username"]').should('not.be.empty');
  });

  it('muestra error si falta el correo', () => {
    cy.fillRegisterForm({
      username: 'juan',
      password: 'password123',
      confirm:  'password123',
    });
    cy.get('[data-testid="btn-register-submit"]').click();
    cy.get('[data-testid="err-reg-email"]').should('not.be.empty');
  });

  // ── Validación de email ──────────────────────────────────

  it('muestra error si el correo tiene formato inválido', () => {
    cy.fillRegisterForm({
      username: 'juan',
      email:    'correo-invalido',
      password: 'password123',
      confirm:  'password123',
    });
    cy.get('[data-testid="btn-register-submit"]').click();
    cy.get('[data-testid="err-reg-email"]').should('not.be.empty');
  });

  it('acepta un correo con formato válido', () => {
    cy.fillRegisterForm({
      username: 'juan',
      email:    'juan@ejemplo.com',
      password: 'password123',
      confirm:  'password123',
    });
    cy.get('[data-testid="btn-register-submit"]').click();
    cy.get('[data-testid="err-reg-email"]').should('be.empty');
  });

  // ── Validación de contraseña ─────────────────────────────

  it('muestra error si la contraseña tiene menos de 8 caracteres', () => {
    cy.fillRegisterForm({
      username: 'juan',
      email:    'juan@ejemplo.com',
      password: 'abc123',      // solo 6 caracteres
      confirm:  'abc123',
    });
    cy.get('[data-testid="btn-register-submit"]').click();
    cy.get('[data-testid="err-reg-password"]').should('not.be.empty');
  });

  it('acepta una contraseña con exactamente 8 caracteres', () => {
    cy.fillRegisterForm({
      username: 'juan',
      email:    'juan@ejemplo.com',
      password: 'abcd1234',    // exactamente 8
      confirm:  'abcd1234',
    });
    cy.get('[data-testid="btn-register-submit"]').click();
    cy.get('[data-testid="err-reg-password"]').should('be.empty');
  });

  // ── Confirmación de contraseña ───────────────────────────

  it('muestra error si las contraseñas no coinciden', () => {
    cy.fillRegisterForm({
      username: 'juan',
      email:    'juan@ejemplo.com',
      password: 'password123',
      confirm:  'diferente456',
    });
    cy.get('[data-testid="btn-register-submit"]').click();
    cy.get('[data-testid="err-reg-confirm"]').should('not.be.empty');
  });

  it('no muestra error cuando las contraseñas coinciden', () => {
    cy.fillRegisterForm({
      username: 'juan',
      email:    'juan@ejemplo.com',
      password: 'password123',
      confirm:  'password123',
    });
    cy.get('[data-testid="btn-register-submit"]').click();
    cy.get('[data-testid="err-reg-confirm"]').should('be.empty');
  });

  // ── Flujo exitoso ────────────────────────────────────────

  it('registro exitoso redirige a la pantalla de bienvenida', () => {
    cy.fillRegisterForm({
      username: 'juanperez',
      email:    'juan@ejemplo.com',
      password: 'password123',
      confirm:  'password123',
    });
    cy.get('[data-testid="btn-register-submit"]').click();

    // PRUEBA CRÍTICA DE REGRESIÓN: si esto falla, el flujo de registro está roto
    cy.get('[data-testid="screen-welcome"]').should('be.visible');
    cy.get('[data-testid="welcome-name"]').should('contain', 'juanperez');
  });

  // ── UX: limpieza de errores al escribir ──────────────────

  it('el error de campo desaparece al empezar a escribir', () => {
    cy.get('[data-testid="btn-register-submit"]').click();
    cy.get('[data-testid="err-reg-username"]').should('not.be.empty');

    cy.get('[data-testid="reg-username"]').type('j');
    cy.get('[data-testid="err-reg-username"]').should('be.empty');
  });

});
