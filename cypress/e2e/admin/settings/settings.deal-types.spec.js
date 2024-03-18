/// <reference types="Cypress" />

import { SETTINGS_URL } from '../../../urls'
import { stringGen } from '../../../support/helpers'

context('settings.deal-types', () => {

  const dealTypeSelectors = {
    dealTypeContainer: '#divDealTypes',
    dealTypeHeader: '#divDealTypesTabHeader',
    newDealType: '#txtNewDealType',
    addDealType: '#btnAddDealType',
  }
  const { dealTypeContainer, dealTypeHeader, newDealType, addDealType } = dealTypeSelectors
  const getNewDealType = (dealTypeName) => `${dealTypeContainer} tr[data-current-deal-type="${dealTypeName}"]`

  before(() => {
    cy.APILogin('crmAdmin')

    // set language
    localStorage.setItem('language_code', 'en-US')
  })

  it('should list deal types', () => {
    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.get(dealTypeHeader).click()
    cy.get(dealTypeContainer)
      .find('tr')
      .should('have.length.gte', 4)
  })

  it('should add and remove deal types', () => {
    const uniqueString = stringGen(5)
    const dealTypeName = `TestDeal Type_${uniqueString}`
    const addedDealType = getNewDealType(dealTypeName)

    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.addAndRemoveSettings(
      dealTypeHeader,
      newDealType,
      addDealType,
      addedDealType,
      dealTypeName,
      SETTINGS_URL
    )
  })

  it('should edit deal types', () => {
    const initialRandomString = stringGen(9)
    const editRandomString = stringGen(8)
    const initialRandomStringSelector = getNewDealType(initialRandomString)
    const editRandomStringSelector = getNewDealType(editRandomString)

    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.editAndRemoveSettings(
      dealTypeHeader,
      newDealType,
      addDealType,
      initialRandomString,
      editRandomString,
      initialRandomStringSelector,
      editRandomStringSelector,
      SETTINGS_URL
    )
  })
})
