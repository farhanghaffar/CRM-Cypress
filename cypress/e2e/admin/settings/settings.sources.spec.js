/// <reference types="Cypress" />

import { SETTINGS_URL } from '../../../urls'
import { stringGen } from '../../../support/helpers'

context('settings.sources', () => {

  const sourceSelectors = {
    sourceContainer: '#divSources',
    sourceHeader: '#divSourcesTabHeader',
    newSource: '#txtNewSource',
    addSource: '#btnAddSource',
  }
  const { sourceContainer, sourceHeader, newSource, addSource } = sourceSelectors
  const getNewSource = (sourceName) => `${sourceContainer} tr[data-current-source-name="${sourceName}"]`

  before(() => {
    cy.APILogin('crmAdmin')

    // set language
    localStorage.setItem('language_code', 'en-US')
  })

  it('should list sources', () => {
    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.get(sourceHeader).click()
    cy.get(sourceContainer)
      .find('tr')
      .should('have.length.gte', 8)
  })

  it('should add and remove sources', () => {
    const uniqueString = stringGen(5)
    const sourceName = `Test Source_${uniqueString}`
    const addedSource = getNewSource(sourceName)

    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.addAndRemoveSettings(
      sourceHeader,
      newSource,
      addSource,
      addedSource,
      sourceName,
      SETTINGS_URL
    )
  })

  it('should edit sources', () => {
    const initialRandomString = stringGen(9)
    const editRandomString = stringGen(8)
    const initialRandomStringSelector = getNewSource(initialRandomString)
    const editRandomStringSelector = getNewSource(editRandomString)

    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.editAndRemoveSettings(
      sourceHeader,
      newSource,
      addSource,
      initialRandomString,
      editRandomString,
      initialRandomStringSelector,
      editRandomStringSelector,
      SETTINGS_URL
    )
  })
})
