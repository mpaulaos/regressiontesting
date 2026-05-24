// cypress/e2e/03-login.cy.js
// ============================================================
// SUITE 3 — Formulario de Login y Pantalla de Bienvenida
// ============================================================

describe('Formulario de Login', () => {

  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500');
    cy.get('[data-testid="btn-go-login"]').click();
    cy.get('[data-testid="screen-login"]').should('be.visible');
  });

  // ── Campos obligatorios ──────────────────────────────────

  it('muestra error si ambos campos están vacíos', () => {
    cy.get('[data-testid="btn-login-submit"]').click();
    cy.get('[data-testid="err-login-email"]').should('not.be.empty');
    cy.get('[data-testid="err-login-password"]').should('not.be.empty');
  });

  it('muestra error si falta el correo', () => {
    cy.get('[data-testid="login-password"]').type('password123');
    cy.get('[data-testid="btn-login-submit"]').click();
    cy.get('[data-testid="err-login-email"]').should('not.be.empty');
  });

  it('muestra error si falta la contraseña', () => {
    cy.get('[data-testid="login-email"]').type('test@ejemplo.com');
    cy.get('[data-testid="btn-login-submit"]').click();
    cy.get('[data-testid="err-login-password"]').should('not.be.empty');
  });

  // ── Validación de email ──────────────────────────────────

  it('muestra error si el correo tiene formato inválido', () => {
    cy.fillLoginForm({ email: 'no-es-un-email', password: 'password123' });
    cy.get('[data-testid="btn-login-submit"]').click();
    cy.get('[data-testid="err-login-email"]').should('not.be.empty');
  });

  // ── Validación de contraseña ─────────────────────────────

  it('muestra error si la contraseña tiene menos de 8 caracteres', () => {
    cy.fillLoginForm({ email: 'test@ejemplo.com', password: 'corta' });
    cy.get('[data-testid="btn-login-submit"]').click();
    cy.get('[data-testid="err-login-password"]').should('not.be.empty');
  });

  // ── Flujo exitoso ────────────────────────────────────────

  it('login exitoso redirige a la pantalla de bienvenida', () => {
    cy.fillLoginForm({ email: 'test@ejemplo.com', password: 'password123' });
    cy.get('[data-testid="btn-login-submit"]').click();

    // PRUEBA CRÍTICA DE REGRESIÓN: si esto falla, el flujo de login está roto
    cy.get('[data-testid="screen-welcome"]').should('be.visible');
  });

  it('la pantalla de bienvenida muestra el nombre derivado del email', () => {
    cy.fillLoginForm({ email: 'juanito@ejemplo.com', password: 'password123' });
    cy.get('[data-testid="btn-login-submit"]').click();

    cy.get('[data-testid="welcome-name"]').should('contain', 'juanito');
  });

  it('la pantalla de bienvenida muestra el método como "Inicio de sesión"', () => {
    cy.fillLoginForm({ email: 'test@ejemplo.com', password: 'password123' });
    cy.get('[data-testid="btn-login-submit"]').click();

    cy.get('[data-testid="session-method"]').should('contain', 'Inicio de sesión');
  });

  it('la pantalla de bienvenida muestra la hora de la sesión', () => {
    cy.fillLoginForm({ email: 'test@ejemplo.com', password: 'password123' });
    cy.get('[data-testid="btn-login-submit"]').click();

    // La hora no debe ser el placeholder "—"
    cy.get('[data-testid="session-time"]').should('not.contain', '—');
  });

});

// ============================================================
// SUITE 4 — Cierre de sesión
// ============================================================

describe('Cierre de sesión', () => {

  beforeEach(() => {
    // Usar el comando personalizado para llegar directamente a bienvenida
    cy.loginSuccessfully();
  });

  it('el botón "Cerrar sesión" es visible en la pantalla de bienvenida', () => {
    cy.get('[data-testid="btn-logout"]').should('be.visible');
  });

  it('cerrar sesión regresa a la pantalla de inicio', () => {
    cy.get('[data-testid="btn-logout"]').click();

    // PRUEBA CRÍTICA DE REGRESIÓN: si esto falla, el logout está roto
    cy.get('[data-testid="screen-home"]').should('be.visible');
    cy.get('[data-testid="screen-welcome"]').should('not.be.visible');
  });

  it('después de logout se puede volver a hacer login', () => {
    cy.get('[data-testid="btn-logout"]').click();
    cy.get('[data-testid="btn-go-login"]').click();
    cy.fillLoginForm({ email: 'otro@test.com', password: 'otraclave123' });
    cy.get('[data-testid="btn-login-submit"]').click();
    cy.get('[data-testid="screen-welcome"]').should('be.visible');
  });

});
