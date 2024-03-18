/// <reference types="Cypress" />

import { SETTINGS_URL } from '../../../urls'
import { stringGen } from '../../../support/helpers'

context.skip('settings.tags', () => {

  const tagSelectors = {
    tagContainer: '#divTags',
    tagHeader: '#divTagsTabHeader',
    newTag: '#txtNewTag',
    addTag: '#btnAddTag',
  }
  const { tagContainer, tagHeader, newTag, addTag } = tagSelectors
  const getNewTag = (tagName) => `${tagContainer} tr[data-current-tag="${tagName}"]`

  before(() => {
    cy.APILogin('crmAdmin')
    // set language
    localStorage.setItem('language_code', 'en-US')
  })

  it('should list tags', () => {
    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.get(tagHeader).click()
    cy.get(tagContainer)
      .find('tr')
      .should('have.length.gte', 4)
  })

  it('should add and remove tags', () => {
    const uniqueString = stringGen(5)
    const tagName = `Test Tag_${uniqueString}`
    const addedTag = getNewTag(tagName)

    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.addAndRemoveSettings(
      tagHeader,
      newTag,
      addTag,
      addedTag,
      tagName,
      SETTINGS_URL
    )
  })

  it('should edit tags', () => {
    const initialRandomString = stringGen(9)
    const editRandomString = stringGen(8)
    const initialRandomStringSelector = getNewTag(initialRandomString)
    const editRandomStringSelector = getNewTag(editRandomString)

    cy.navigateAndCheckURL(SETTINGS_URL)
    cy.editAndRemoveSettings(
      tagHeader,
      newTag,
      addTag,
      initialRandomString,
      editRandomString,
      initialRandomStringSelector,
      editRandomStringSelector,
      SETTINGS_URL
    )
  })
})
