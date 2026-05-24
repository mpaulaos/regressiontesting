const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5500',
    viewportWidth: 1280,
    viewportHeight: 800,
  },
});