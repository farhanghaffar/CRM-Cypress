/// <reference types="Cypress" />

import {
    COMPANY_LIST_URL
} from '../../urls'

context('nav bar', () => {
    beforeEach(() => {
        cy.APILogin('salesRep')
        cy.navigateAndCheckURL(COMPANY_LIST_URL)
    })

    it('Nav bar remains expended when toggled off', () => {
        cy.navBarToggleState(1)
    })

    it('Nav bar collapses when toggled on', () => {
        cy.navBarToggleState(0)
    })

    it('Sliding nav bar not visable in responsive view', () => {
        cy.viewport('iphone-8')
        cy.get('#sidebar').should('not.be.visible')
    })
})