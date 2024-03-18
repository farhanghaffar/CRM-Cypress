/// <reference types="Cypress" />

import { SETTINGS_URL } from '../../../urls'
import { stringGen } from '../../../support/helpers'

context('settings.company-types', () => {

  const companyTypesSelectors = {
    companyTypesContainer: '#divCompanyTypes',
    companyTypesHeader: '#divCompanyTypesTabHeader',
    newCompanyType: '#txtNewCompanyType',
    addCompanyTypes: '#btnAddCompanyType',
  }
  const { companyTypesContainer, companyTypesHeader, newCompanyType, addCompanyTypes } = companyTypesSelectors
  const getNewCompanyType = (companySegmentName) => `${companyTypesContainer} tr[data-current-company-type-name="${companySegmentName}"]`

  before(() => {
    cy.APILogin('crmAdmin')

    // set language
    localStorage.setItem('language_code', 'en-US')
  })

  it('should list company types', () => {
    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.get(companyTypesHeader).click({ force: true })
    cy.get(companyTypesContainer)
      .find('tr')
      .should('have.length.gte', 8)
  })

  it('should add and remove company types', () => {
    const uniqueString = stringGen(4)
    const companyTypeName = `Company Type_${uniqueString}`
    const addedCompanyType = getNewCompanyType(companyTypeName)

    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.addAndRemoveSettings(
      companyTypesHeader,
      newCompanyType,
      addCompanyTypes,
      addedCompanyType,
      companyTypeName,
      SETTINGS_URL
    )
  })

  it('should edit company types', () => {
    const initialRandomString = stringGen(9)
    const editRandomString = stringGen(8)
    const initialRandomStringSelector = getNewCompanyType(initialRandomString)
    const editRandomStringSelector = getNewCompanyType(editRandomString)

    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.editAndRemoveSettings(
      companyTypesHeader,
      newCompanyType,
      addCompanyTypes,
      initialRandomString,
      editRandomString,
      initialRandomStringSelector,
      editRandomStringSelector,
      SETTINGS_URL
    )
  })
})
