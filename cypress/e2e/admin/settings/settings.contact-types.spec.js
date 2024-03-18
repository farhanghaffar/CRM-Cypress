/// <reference types="Cypress" />

import { SETTINGS_URL } from '../../../urls'
import { stringGen } from '../../../support/helpers'

context('settings.contact-types', () => {

  const contactTypeSelectors = {
    contactTypeContainer: '#divContactTypes',
    contactTypeHeader: '#divContactTypesTabHeader',
    newContactType: '#txtNewContactType',
    addContactType: '#btnAddContactType',
  }
  const { contactTypeContainer, contactTypeHeader, newContactType, addContactType } = contactTypeSelectors
  const getNewContactType = (contactTypeName) => `${contactTypeContainer} tr[data-current-contact-type="${contactTypeName}"]`

  before(() => {
    cy.APILogin('crmAdmin')

    // set language
    localStorage.setItem('language_code', 'en-US')
  })

  it('should list contact types', () => {
    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.get(contactTypeHeader).click()
    cy.get(contactTypeContainer)
      .find('tr')
      .should('have.length.gte', 5)
  })

  it('should add and remove contact types', () => {
    const uniqueString = stringGen(5)
    const contactTypeName = `TestContact Type_${uniqueString}`
    const addedContactType = getNewContactType(contactTypeName)

    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.addAndRemoveSettings(
      contactTypeHeader,
      newContactType,
      addContactType,
      addedContactType,
      contactTypeName,
      SETTINGS_URL
    )
  })

  it('should edit contact types', () => {
    const initialRandomString = stringGen(9)
    const editRandomString = stringGen(8)
    const initialRandomStringSelector = getNewContactType(initialRandomString)
    const editRandomStringSelector = getNewContactType(editRandomString)

    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.editAndRemoveSettings(
      contactTypeHeader,
      newContactType,
      addContactType,
      initialRandomString,
      editRandomString,
      initialRandomStringSelector,
      editRandomStringSelector,
      SETTINGS_URL
    )
  })
})
