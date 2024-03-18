import { numGen } from '../helpers'

Cypress.Commands.add('addAndRemoveSettings', (
  header,
  inputSelector,
  createSelector,
  newDataSelector,
  newInput,
  URL
) => {
  cy.wait(4000)
  cy.get(header).click({ force: true })
  cy.get(inputSelector).type(newInput).should('have.value', newInput)
  if (newInput.includes('Test Sales Stage')) {
    cy.get('#txtSalesStagePercentage').type(numGen(2))
  }

  cy.get(createSelector).click()
  cy.wait(4000)

  cy.navigateAndCheckURL(URL)
  cy.wait(3000)
  cy.get(header).click({ force: true })
  cy.get(newDataSelector).find('input').should('have.value', newInput)
  cy.get(newDataSelector).find('.delete-item').click()
  cy.get('.swal2-actions').find('button').first().click()
  cy.wait(3000)

  cy.navigateAndCheckURL(URL)
  cy.wait(3000)
  cy.get(header).click({ force: true })
  cy.get(newDataSelector).should('not.exist')
})

Cypress.Commands.add('editAndRemoveSettings', (
  header,
  inputSelector,
  createSelector,
  initialRandomString,
  editRandomString,
  newDataSelectorInitial,
  newDataSelectorEdit,
  URL
) => {
  const initialNumGen = numGen(2)
  const newNumGen = numGen(2)

  cy.wait(4000)
  cy.get(header).click({ force: true })
  cy.get(inputSelector).type(initialRandomString).should('have.value', initialRandomString)
  if (initialRandomString.includes('SS_')) {
    cy.get('#txtSalesStagePercentage').type(initialNumGen)
  }

  cy.get(createSelector).click()
  cy.wait(3000)

  // cy.navigateAndCheckURL(URL);
  cy.reload()
  cy.wait(3000)
  cy.get(header).click({ force: true })
  if (initialRandomString.includes('SS_')) {
    cy.get(newDataSelectorInitial).find('input').first()
      .should('have.value', initialRandomString)
      .clear()
      .type(editRandomString).should('have.value', editRandomString)
      .blur()
    cy.get(newDataSelectorEdit).find('input').last()
      .should('have.value', initialNumGen)
      .clear()
      .type(newNumGen).should('have.value', newNumGen)
      .blur()
  } else {
    cy.get(newDataSelectorInitial).find('input')
      .should('have.value', initialRandomString)
      .clear()
      .type(editRandomString).should('have.value', editRandomString)
      .blur()
  }

  // remove wait with eventually and wait for network request to finish
  cy.wait(3000)

  cy.reload()
  cy.wait(3000)
  cy.get(header).click({ force: true })
  cy.get(newDataSelectorEdit).find('input').should('have.value', editRandomString)
  cy.get(newDataSelectorEdit).find('.delete-item').click({ force: true })
  cy.get('.swal2-actions').find('button').first().click()
  // remove wait with eventually and wait for network request to finish
  cy.wait(3000)

  cy.reload()
  cy.wait(3000)
  cy.get(header).click({ force: true })
  cy.get(newDataSelectorEdit).should('not.exist')
})
