/// <reference types="Cypress" />

import { SETTINGS_URL } from '../../../urls'
import { stringGen } from '../../../support/helpers'

context('settings.won-reason', () => {

  const wonReasonSelectors = {
    wonReasonContainer: '#divWonReasonsTab',
    wonReasonHeader: '#divWonReasonsTabHeader',
    newWonReason: '#txtNewWonReason',
    addWonReason: '#btnAddWonReason',
  }
  const { wonReasonContainer, wonReasonHeader, newWonReason, addWonReason } = wonReasonSelectors
  const getNewWonReason = (wonReasonName) => `${wonReasonContainer} tr[data-current-won-reason="${wonReasonName}"]`

  before(() => {
    cy.APILogin('crmAdmin')

    // set language
    localStorage.setItem('language_code', 'en-US')
  })

  it('should list won reasons', () => {
    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.get(wonReasonHeader).click()
    cy.get(wonReasonContainer)
      .find('tr')
      .should('have.length.gte', 1)
  })

  it('should add and remove won reasons', () => {
    const uniqueString = stringGen(5)
    const wonReasonName = `Test Won Reason_${uniqueString}`
    const addedWonReason = getNewWonReason(wonReasonName)

    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.addAndRemoveSettings(
      wonReasonHeader,
      newWonReason,
      addWonReason,
      addedWonReason,
      wonReasonName,
      SETTINGS_URL
    )
  })

  it('should edit won reasons', () => {
    const initialRandomString = stringGen(9)
    const editRandomString = stringGen(8)
    const initialRandomStringSelector = getNewWonReason(initialRandomString)
    const editRandomStringSelector = getNewWonReason(editRandomString)

    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.editAndRemoveSettings(
      wonReasonHeader,
      newWonReason,
      addWonReason,
      initialRandomString,
      editRandomString,
      initialRandomStringSelector,
      editRandomStringSelector,
      SETTINGS_URL
    )
  })
})
