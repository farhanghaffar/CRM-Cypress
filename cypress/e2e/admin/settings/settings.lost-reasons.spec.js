/// <reference types="Cypress" />

import { SETTINGS_URL } from '../../../urls'
import { stringGen } from '../../../support/helpers'

context('settings.lost-reasons', () => {

  const lostReasonSelectors = {
    lostReasonContainer: '#divLostReasons',
    lostReasonHeader: '#divLostReasonsTabHeader',
    newLostReason: '#txtNewLostReason',
    addLostReason: '#btnAddLostReason',
  }
  const { lostReasonContainer, lostReasonHeader, newLostReason, addLostReason } = lostReasonSelectors
  const getNewLostReason = (lostReasonName) => `${lostReasonContainer} tr[data-current-lost-reason="${lostReasonName}"]`

  before(() => {
    cy.APILogin('crmAdmin')

    // set language
    localStorage.setItem('language_code', 'en-US')
  })

  it('should list lost reasons', () => {
    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.get(lostReasonHeader).click()
    cy.get(lostReasonContainer)
      .find('tr')
      .should('have.length.gte', 1)
  })

  it('should add and remove lost reasons', () => {
    const uniqueString = stringGen(5)
    const lostReasonName = `Test Lost Reason_${uniqueString}`
    const addedLostReason = getNewLostReason(lostReasonName)

    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.addAndRemoveSettings(
      lostReasonHeader,
      newLostReason,
      addLostReason,
      addedLostReason,
      lostReasonName,
      SETTINGS_URL
    )
  })

  it('should edit lost reasons', () => {
    const initialRandomString = stringGen(9)
    const editRandomString = stringGen(8)
    const initialRandomStringSelector = getNewLostReason(initialRandomString)
    const editRandomStringSelector = getNewLostReason(editRandomString)

    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.editAndRemoveSettings(
      lostReasonHeader,
      newLostReason,
      addLostReason,
      initialRandomString,
      editRandomString,
      initialRandomStringSelector,
      editRandomStringSelector,
      SETTINGS_URL
    )
  })
})
