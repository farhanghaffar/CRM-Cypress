import { defineConfig } from 'cypress'

export default defineConfig({
  recordKey: 'cd7d854d-2f17-46b2-9042-6e491ac5b193',
  projectId: '1w6fra',
  modifyObstructiveCode: false,
  chromeWebSecurity: false,
  watchForFileChanges: true,
  defaultCommandTimeout: 25000,
  requestTimeout: 50000,
  reporter: './node_modules/mochawesome/src/mochawesome.js',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: true,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'https://develop.firstfreight.com/',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
