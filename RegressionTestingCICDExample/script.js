/* ============================================================
   AuthFlow — script.js
   Lógica de navegación, validación y autenticación simulada.

   NOTA PARA CI/CD:
   Para demostrar una prueba de regresión fallida, busca el
   comentario "PUNTO DE FALLO INTENCIONAL" y sigue las instrucciones.
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────
   1. NAVEGACIÓN ENTRE PANTALLAS
   ────────────────────────────────────────────── */

/**
 * Muestra la pantalla indicada y oculta las demás.
 * @param {string} screenId - ID del elemento <section>
 */
function showScreen(screenId) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => s.classList.remove('active'));

  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    // Reiniciar el scroll al tope al cambiar pantalla
    window.scrollTo(0, 0);
    // Reiniciar formularios al navegar
    clearFormErrors();
  }
}

/**
 * Limpia todos los errores de formulario y estilos.
 */
function clearFormErrors() {
  document.querySelectorAll('.field-error').forEach(el => (el.textContent = ''));
  document.querySelectorAll('.field-input').forEach(el => el.classList.remove('is-error'));
}

/* ──────────────────────────────────────────────
   2. UTILIDADES DE VALIDACIÓN
   ────────────────────────────────────────────── */

/**
 * Valida formato básico de email.
 * PUNTO DE FALLO INTENCIONAL #1:
 *   Para romper la prueba de validación de email, cambia el return a:
 *   return true;  ← siempre válido, sin importar el valor
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Valida longitud mínima de contraseña.
 * PUNTO DE FALLO INTENCIONAL #2:
 *   Para romper la prueba de longitud, cambia 8 por un valor menor, ej:
 *   return password.length >= 4;
 */
function isValidPassword(password) {
  return password.length >= 8;
}

/**
 * Muestra un error en un campo específico.
 * @param {string} inputId  - ID del input
 * @param {string} errorId  - ID del span de error
 * @param {string} message  - Mensaje a mostrar
 */
function showFieldError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) input.classList.add('is-error');
  if (error) error.textContent = message;
}

/**
 * Limpia el error de un campo específico.
 */
function clearFieldError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) input.classList.remove('is-error');
  if (error) error.textContent = '';
}

/* ──────────────────────────────────────────────
   3. FORMULARIO DE REGISTRO
   ────────────────────────────────────────────── */

const formRegister = document.getElementById('form-register');

if (formRegister) {
  formRegister.addEventListener('submit', function (e) {
    e.preventDefault();
    clearFormErrors();

    const username = document.getElementById('reg-username').value.trim();
    const email    = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm  = document.getElementById('reg-confirm').value;

    let hasError = false;

    // Validar nombre de usuario
    if (!username) {
      showFieldError('reg-username', 'err-reg-username', 'El nombre de usuario es requerido.');
      hasError = true;
    }

    // Validar email
    if (!email) {
      showFieldError('reg-email', 'err-reg-email', 'El correo electrónico es requerido.');
      hasError = true;
    } else if (!isValidEmail(email)) {
      showFieldError('reg-email', 'err-reg-email', 'Ingresa un correo válido (ej: usuario@dominio.com).');
      hasError = true;
    }

    // Validar contraseña
    if (!password) {
      showFieldError('reg-password', 'err-reg-password', 'La contraseña es requerida.');
      hasError = true;
    } else if (!isValidPassword(password)) {
      showFieldError('reg-password', 'err-reg-password', 'La contraseña debe tener al menos 8 caracteres.');
      hasError = true;
    }

    // Validar confirmación
    if (!confirm) {
      showFieldError('reg-confirm', 'err-reg-confirm', 'Debes confirmar tu contraseña.');
      hasError = true;
    } else if (password !== confirm) {
      /* PUNTO DE FALLO INTENCIONAL #3:
         Para romper la prueba de coincidencia, comenta la línea showFieldError
         de aquí abajo y las contraseñas nunca darán error aunque no coincidan.
      */
      showFieldError('reg-confirm', 'err-reg-confirm', 'Las contraseñas no coinciden.');
      hasError = true;
    }

    if (hasError) return;

    // Éxito: guardar sesión simulada y mostrar bienvenida
    setSession(username || email, 'Registro');
    showScreen('screen-welcome');
  });
}

/* ──────────────────────────────────────────────
   4. FORMULARIO DE LOGIN
   ────────────────────────────────────────────── */

const formLogin = document.getElementById('form-login');

if (formLogin) {
  formLogin.addEventListener('submit', function (e) {
    e.preventDefault();
    clearFormErrors();

    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    let hasError = false;

    // Validar email
    if (!email) {
      showFieldError('login-email', 'err-login-email', 'El correo electrónico es requerido.');
      hasError = true;
    } else if (!isValidEmail(email)) {
      showFieldError('login-email', 'err-login-email', 'Ingresa un correo válido.');
      hasError = true;
    }

    // Validar contraseña
    if (!password) {
      showFieldError('login-password', 'err-login-password', 'La contraseña es requerida.');
      hasError = true;
    } else if (!isValidPassword(password)) {
      showFieldError('login-password', 'err-login-password', 'La contraseña debe tener al menos 8 caracteres.');
      hasError = true;
    }

    if (hasError) return;

    /* PUNTO DE FALLO INTENCIONAL #4:
       Para que el login nunca redirija aunque todo sea válido, agrega:
       return;
       justo debajo de este comentario.
    */

    // Éxito: mostrar bienvenida
    const displayName = email.split('@')[0];
    setSession(displayName, 'Inicio de sesión');
    showScreen('screen-welcome');
  });
}

/* ──────────────────────────────────────────────
   5. SESIÓN SIMULADA
   ────────────────────────────────────────────── */

/**
 * Configura la pantalla de bienvenida con la info del usuario.
 * @param {string} name   - Nombre o alias del usuario
 * @param {string} method - Método de acceso
 */
function setSession(name, method) {
  const welcomeName   = document.getElementById('welcome-name');
  const sessionTime   = document.getElementById('session-time');
  const sessionMethod = document.getElementById('session-method');

  if (welcomeName)   welcomeName.textContent   = name;
  if (sessionTime)   sessionTime.textContent   = new Date().toLocaleTimeString('es-CR');
  if (sessionMethod) sessionMethod.textContent = method;
}

/**
 * Cierra la sesión y regresa al inicio.
 * PUNTO DE FALLO INTENCIONAL #5:
 *   Para romper la prueba de logout, comenta showScreen('screen-home'):
 *   // showScreen('screen-home');
 */
function logout() {
  clearFormErrors();
  // Limpiar formularios
  ['form-register', 'form-login'].forEach(id => {
    const f = document.getElementById(id);
    if (f) f.reset();
  });
  showScreen('screen-home');
}

/* ──────────────────────────────────────────────
   6. LIMPIAR ERROR AL ESCRIBIR (UX)
   ────────────────────────────────────────────── */
document.querySelectorAll('.field-input').forEach(input => {
  input.addEventListener('input', function () {
    this.classList.remove('is-error');
    const errorId = 'err-' + this.id;
    const error = document.getElementById(errorId);
    if (error) error.textContent = '';
  });
});
