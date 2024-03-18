/// <reference types="Cypress" />

import { SETTINGS_URL } from '../../../urls'
import { stringGen } from '../../../support/helpers'

context('settings-competitors', () => {

  const competitorSelectors = {
    competitorsContainer: '#divCompetitors',
    competitorsHeader: '#divCompetitorsTabHeader',
    newCompetitor: '#txtNewCompetitor',
    addCompetitor: '#btnAddCompetitor',
  }
  const { competitorsContainer, competitorsHeader, newCompetitor, addCompetitor } = competitorSelectors
  const getNewCompetitor = (competitorName) => `${competitorsContainer} tr[data-current-competitor-name="${competitorName}"]`

  before(() => {
    cy.APILogin('salesRep')

    // set language
    localStorage.setItem('language_code', 'en-US')
  })

  it('should list competitors', () => {
    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.get(competitorsHeader).click()
    cy.get(competitorsContainer)
      .find('tr')
      .should('have.length.gte', 13)
  })

  it('should add and remove competitors', () => {
    const uniqueString = stringGen(5)
    const competitorName = `TestCompetitor_${uniqueString}`
    const addedCompetitor = getNewCompetitor(competitorName)

    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.addAndRemoveSettings(
      competitorsHeader,
      newCompetitor,
      addCompetitor,
      addedCompetitor,
      competitorName,
      SETTINGS_URL
    )
  })

  it('should edit competitors', () => {
    const initialRandomString = `TestCompetitor_${stringGen(9)}`
    const editRandomString = `EditCompetitor_${stringGen(8)}`
    const initialRandomStringSelector = getNewCompetitor(initialRandomString)
    const editRandomStringSelector = getNewCompetitor(editRandomString)

    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.editAndRemoveSettings(
      competitorsHeader,
      newCompetitor,
      addCompetitor,
      initialRandomString,
      editRandomString,
      initialRandomStringSelector,
      editRandomStringSelector,
      SETTINGS_URL
    )
  })
})
