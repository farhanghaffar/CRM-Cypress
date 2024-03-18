/// <reference types="Cypress" />

import { USER_LIST_URL } from '../../../urls'
const users = Cypress.env('users');

context('users', () => {

  before(() => {
    cy.APILogin('crmAdmin')

    // set language
    localStorage.setItem('language_code', 'en-US')
  })

  beforeEach(() => {
    cy.navigateAndCheckURL(USER_LIST_URL)
  })

  it('should list users', () => {
    cy.get('h1').contains('Users')
    cy.get('.row-wrapper[data-cypress-id]').should('have.length.gte', 2)
  })

  it('should search users and find one result', () => {
    const salesRep = users['salesRep'];
    const searchTerm = salesRep.details.name;
    const globalUserId = salesRep.globalUserId;

    cy.searchResults(searchTerm)
    cy.get('.row-wrapper[data-cypress-id]').should('have.length', 1)
    cy.get(`.row-wrapper[data-cypress-id="${globalUserId}"]`).contains('Brendon Hartley')
  })

  it('should search users and find no results', () => {
    const searchTerm = 'rhrhhfhfhjhj'

    cy.searchResults(searchTerm)
    cy.get('.row-wrapper[data-cypress-id]').should('have.length', 0)
    cy.get('.data-grid-overlay-noItems').contains('No Users')
  })
})
