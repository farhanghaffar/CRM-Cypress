/// <reference types="Cypress" />

import { SETTINGS_URL } from '../../../urls'
import { stringGen } from '../../../support/helpers'

context('settings.company-segments', () => {

  const companySegmentsSelectors = {
    companySegmentsContainer: '#divCompanySegments',
    companySegmentsHeader: '#divCompanySegmentsTabHeader',
    newCompanySegments: '#txtNewCompanySegment',
    addCompanySegments: '#btnAddCompanySegment',
  }
  const { companySegmentsContainer, companySegmentsHeader, newCompanySegments, addCompanySegments } = companySegmentsSelectors
  const getNewCompanySegment = (companySegmentName) => `${companySegmentsContainer} tr[data-current-company-segment="${companySegmentName}"]`

  before(() => {

    cy.APILogin('crmAdmin')

    // set language
    localStorage.setItem('language_code', 'en-US')
  })

  it('should list company segments', () => {
    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.get(companySegmentsHeader).click()
    cy.get(companySegmentsContainer)
      .find('tr')
      .should('have.length.gte', 4)
  })

  it('should add and remove company segments', () => {
    const uniqueString = stringGen(5)
    const companySegmentName = `TestCompany Segment_${uniqueString}`
    const addedCompanySegment = getNewCompanySegment(companySegmentName)

    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.addAndRemoveSettings(
      companySegmentsHeader,
      newCompanySegments,
      addCompanySegments,
      addedCompanySegment,
      companySegmentName,
      SETTINGS_URL
    )
  })

  it('should edit company segments', () => {
    const initialRandomString = stringGen(9)
    const editRandomString = stringGen(8)
    const initialRandomStringSelector = getNewCompanySegment(initialRandomString)
    const editRandomStringSelector = getNewCompanySegment(editRandomString)

    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.editAndRemoveSettings(
      companySegmentsHeader,
      newCompanySegments,
      addCompanySegments,
      initialRandomString,
      editRandomString,
      initialRandomStringSelector,
      editRandomStringSelector,
      SETTINGS_URL
    )
  })
})
