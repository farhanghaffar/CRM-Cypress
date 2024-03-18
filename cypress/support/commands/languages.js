import { ACTIVITY_URL } from '../../urls';

Cypress.Commands.add('changeUserLanguage', (language) => {
    cy.intercept('/api/user/SaveProfile').as('saveProfile')
    cy.get('#navSidebar_imgUserProfilePic')
        .click()
    cy.get('#ddlDisplayLanguage')
        .select(language, { force: true })
    cy.get('#btnSave')
        .click()
    cy.wait('@saveProfile')
})