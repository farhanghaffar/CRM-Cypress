/// <reference types="Cypress" />

import {
    COMPANY_LIST_URL,
    ACTIVITY_URL
} from '../../urls'

context('navBar-language-translation', () => {
    beforeEach(() => {
        // change to Spanish
        cy.APILogin('crmAdmin')
        cy.navigateAndCheckURL(COMPANY_LIST_URL)
        cy.changeUserLanguage('Spanish')
    })

    afterEach(() => {
        // change back to English
        cy.changeUserLanguage('English')
    })

    it('nav bar options translate to Spanish', () => {
        cy.clearCookies()
        cy.APILogin('crmAdmin')
        cy.navigateAndCheckURL(COMPANY_LIST_URL)
        cy.navBarToggleState(1)

        //test each option has been translated to spanish
        const optionTranslatedToSpanish = (selector, translatedText) => cy.get(selector).should('have.class', 'language-entry').and('have.text', translatedText)

        optionTranslatedToSpanish('#navSidebar_liActivity .item-text', 'Actividad')
        optionTranslatedToSpanish('#navSidebar_liDashboard .item-text', 'Tablero')
        optionTranslatedToSpanish('#navSidebar_liDeals .item-text', 'Ofertas')
        optionTranslatedToSpanish('#navSidebar_liCompanies .item-text', 'Compañías')
        optionTranslatedToSpanish('#navSidebar_liContacts .item-text', 'Contactos')
        optionTranslatedToSpanish('#navSidebar_liCalendar .item-text', 'Calendario')
        optionTranslatedToSpanish('#navSidebar_liReports .item-text', 'Informes')
        optionTranslatedToSpanish('#navSidebar_liSupport .item-text', 'Ayuda')
        optionTranslatedToSpanish('#navSidebar_liUsers .item-text', 'Usuarios')
        optionTranslatedToSpanish('#navSidebar_liLocations .item-text', 'Ubicaciones')
        optionTranslatedToSpanish('#navSidebar_liLanguages .item-text', 'Idiomas')
        optionTranslatedToSpanish('#navSidebar_liSettings .item-text', 'Configuraciones')
        optionTranslatedToSpanish('#navSidebar_liCampaigns .item-text', 'Campañas')
    })
})