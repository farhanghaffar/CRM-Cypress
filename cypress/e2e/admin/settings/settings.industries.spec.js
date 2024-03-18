/// <reference types="Cypress" />

import { SETTINGS_URL } from '../../../urls'
import { stringGen } from '../../../support/helpers'

context('settings.industries', () => {

  const industrySelectors = {
    industryContainer: '#divIndustries',
    industryHeader: '#divIndustriesTabHeader',
    newIndustry: '#txtNewIndustry',
    addIndustry: '#btnAddIndustry',
  }
  const { industryContainer, industryHeader, newIndustry, addIndustry } = industrySelectors
  const getNewIndustry = (industryName) => `${industryContainer} tr[data-current-industry="${industryName}"]`

  before(() => {
    cy.APILogin('crmAdmin')
    // set language
    localStorage.setItem('language_code', 'en-US')
  })

  it('should list industries', () => {
    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.get(industryHeader).click()
    cy.get(industryContainer)
      .find('tr')
      .should('have.length.gte', 10)
  })

  it('should add and remove industries', () => {
    const uniqueString = stringGen(5)
    const industryName = `Test industry_${uniqueString}`
    const addedIndustry = getNewIndustry(industryName)

    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.addAndRemoveSettings(
      industryHeader,
      newIndustry,
      addIndustry,
      addedIndustry,
      industryName,
      SETTINGS_URL
    )
  })

  it('should edit industries', () => {
    const initialRandomString = stringGen(9)
    const editRandomString = stringGen(8)
    const initialRandomStringSelector = getNewIndustry(initialRandomString)
    const editRandomStringSelector = getNewIndustry(editRandomString)

    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.editAndRemoveSettings(
      industryHeader,
      newIndustry,
      addIndustry,
      initialRandomString,
      editRandomString,
      initialRandomStringSelector,
      editRandomStringSelector,
      SETTINGS_URL
    )
  })
})
