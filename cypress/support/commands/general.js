const selectors = {
  validation: {
    validationContainer: '.swal2-popup.swal2-modal.swal2-show',
    validationIcon: '.swal2-icon.swal2-warning.swal2-animate-warning-icon',
    validationTitle: '#swal2-title',
    validationButton: '.swal2-actions > .swal2-confirm.swal2-styled',
  },

  error: {
    errorIcon: '.swal2-icon.swal2-error.swal2-animate-error-icon > .swal2-x-mark > [class^="swal2-x-mark-line"]',
    errorContent: '#swal2-content',
  },

  forms: {
    saveForm: '#btnSave',
    cancelForm: '#btnCancel',
    deleteForm: '#btnDelete'
  }
}
const { validationButton, validationContainer, validationIcon, validationTitle } = selectors.validation
const { errorIcon, errorContent } = selectors.error
const { saveForm, cancelForm, deleteForm } = selectors.forms

Cypress.Commands.add('successModal', (successText) => {
  cy.get('.swal2-success-ring')
    .should('be.visible')

  cy.get(validationTitle)
    .should('have.text', successText)

  cy.get(validationButton)
    .should('be.visible')
    .contains('OK')
    .click()
  cy.wait(2000)
})

Cypress.Commands.add('checkErrorModal', ({ errorText, errorContentText }) => {
  cy.get(validationContainer).should('be.visible')
  cy.get(errorIcon)
    .should('have.length', 2)
    .should('have.css', 'background-color')
    .and('eq', 'rgb(242, 116, 116)')
  cy.get(validationTitle)
    .should('have.text', errorText)
  cy.get(errorContent)
    .should('have.text', errorContentText)
  cy.get(validationButton)
    .should('be.visible')
    .contains('OK')
    .click()
  cy.wait(2000)
})

Cypress.Commands.add('navigateAndCheckURL', (URL) => {
  cy.visit(URL)
  cy.url().should('have.string', URL)
})

Cypress.Commands.add('searchResults', (searchText) => {
  cy.get('#txtKeyword')
    .type(searchText)
  cy.get('#txtKeyword')
    .should('have.value', searchText)
    .should('be.visible')
  cy.get('#btnSearch').click({ force: true })
})

Cypress.Commands.add('checkValidationModal', (warningMessage) => {
  cy.get(validationContainer)
    .should('be.visible')
  cy.get(validationIcon)
    .should('be.visible')
    .should('have.css', 'color')
    .and('eq', 'rgb(248, 187, 134)')
  cy.get(validationTitle).contains(warningMessage)
  cy.get(validationButton)
    .should('be.visible')
    .contains('OK')
    .click()
  cy.wait(2000)
})

Cypress.Commands.add('checkErrorWarning', (errorText) => {
  cy.get(validationContainer)
    .should('be.visible')
    cy.get(errorIcon)
    .should('have.length', 2)
    .should('have.css', 'background-color')
    .and('eq', 'rgb(242, 116, 116)')
  cy.get(validationTitle).contains(errorText)
  cy.get(validationButton)
    .should('be.visible')
    .contains('OK')
    .click()
  cy.wait(2000)
})

Cypress.Commands.add('deleteModal', (deleteTitle, deleteMessage, action) => {
  // cy.get('.swal2-icon.swal2-error.swal2-animate-error-icon .swal2-x-mark').should('be.visible')
  cy.get('#swal2-title').should('have.text', deleteTitle)
  cy.get('#swal2-content').should('have.text', deleteMessage)

  if (action === 'delete') {
    cy.get('.swal2-confirm.swal2-styled[type="button"]')
      .click()
  } else {
    cy.get('.swal2-cancel.swal2-styled')
      .click()
  }
})

Cypress.Commands.add('loadingModel', () => {
  cy.get('.ibox.ibox-content.text-center.ajax-modal-txt .spinner')
    .should('be.visible')
})

Cypress.Commands.add('waitUntilLoadingModelDisappear', () => {
  cy.get('.ibox.ibox-content.text-center.ajax-modal-txt .spinner')
    .should('not.exist')
})

Cypress.Commands.add('saveForm', () => {
  cy.get(saveForm)
    .click()
})

Cypress.Commands.add('cancelForm', () => {
  cy.get(cancelForm)
    .click()
})

Cypress.Commands.add('deleteForm', () => {
  cy.get(deleteForm)
    .click()
})

Cypress.Commands.add('pageTitle', (title) => {
  cy.get('h1.page-title')
    .should('have.text', title)
})