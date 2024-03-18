/// <reference types="Cypress" />

import { SETTINGS_URL } from '../../../urls'
import { stringGen } from '../../../support/helpers'

context('settings.commodities', () => {

  const commoditySelectors = {
    commodotyContainer: '#divCommodities',
    commodotyHeader: '#divCommoditiesSegmentsTabHeader',
    newCommodoty: '#txtNewCommodity',
    addCommodoty: '#btnAddCommodity',
  }
  const { commodotyHeader, commodotyContainer, newCommodoty, addCommodoty } = commoditySelectors
  const getNewCommodoty = (commodotyName) => `${commodotyContainer} tr[data-current-commodity="${commodotyName}"]`

  before(() => {

    cy.APILogin('crmAdmin')

    // set language
    localStorage.setItem('language_code', 'en-US')
  })

  it('should list commodities', () => {
    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.get('h1').contains('Settings')
    cy.get(commodotyContainer).find('tr').should('have.length.gte', 6)
  })

  it('should add and remove commodities', () => {
    const uniqueString = stringGen(5)
    const commodotyName = `TestCommodity_${uniqueString}`
    const addedCommodoty = getNewCommodoty(commodotyName)

    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.addAndRemoveSettings(
      commodotyHeader,
      newCommodoty,
      addCommodoty,
      addedCommodoty,
      commodotyName,
      SETTINGS_URL
    )
  })

  it('should edit commodities', () => {
    // random strings for initial and edit commodoty to prevent duplicate assertions in commodoties list
    const initialRandomString = stringGen(9)
    const editRandomString = stringGen(8)
    const initialRandomStringSelector = getNewCommodoty(initialRandomString)
    const editRandomStringSelector = getNewCommodoty(editRandomString)

    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.editAndRemoveSettings(
      commodotyHeader,
      newCommodoty,
      addCommodoty,
      initialRandomString,
      editRandomString,
      initialRandomStringSelector,
      editRandomStringSelector,
      SETTINGS_URL
    )
  })
})
