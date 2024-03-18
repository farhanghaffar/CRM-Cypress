/// <reference types="Cypress" />

import { SETTINGS_URL } from '../../../urls'
import { stringGen } from '../../../support/helpers'

context('settings.sales-stages', () => {

  const salesStageSelectors = {
    salesStageContainer: '#divSalesStages',
    salesStageHeader: '#divSalesStagesTabHeader',
    newSalesStage: '#txtNewSalesStage',
    addSalesStage: '#btnAddSalesStage',
  }
  const { salesStageContainer, salesStageHeader, newSalesStage, addSalesStage } = salesStageSelectors
  const getNewSalesStage = (salesStageName) => `${salesStageContainer} tr[data-current-sales-stage="${salesStageName}"]`

  before(() => {
    cy.APILogin('crmAdmin')
    // set language
    localStorage.setItem('language_code', 'en-US')
  })

  it('should list sales stages', () => {
    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.get(salesStageHeader).click()
    cy.get(salesStageContainer)
      .find('tr')
      .should('have.length.gte', 4)
  })

  it('should add and remove sales stages', () => {
    const uniqueString = stringGen(5)
    const salesStageName = `Test Sales Stage_${uniqueString}`
    const addedSalesStage = getNewSalesStage(salesStageName)

    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.addAndRemoveSettings(
      salesStageHeader,
      newSalesStage,
      addSalesStage,
      addedSalesStage,
      salesStageName,
      SETTINGS_URL
    )
  })

  it('should edit sales stages', () => {
    const initialRandomString = `SS_${stringGen(9)}`
    const editRandomString = stringGen(8)
    const initialRandomStringSelector = getNewSalesStage(initialRandomString)
    const editRandomStringSelector = getNewSalesStage(editRandomString)

    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.editAndRemoveSettings(
      salesStageHeader,
      newSalesStage,
      addSalesStage,
      initialRandomString,
      editRandomString,
      initialRandomStringSelector,
      editRandomStringSelector,
      SETTINGS_URL
    )
  })
})
