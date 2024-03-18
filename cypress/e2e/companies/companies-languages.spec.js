/// <reference types="Cypress" />

import {
    COMPANY_DETAIL_URL,
    COMPANY_LIST_URL
} from '../../urls'
import { numGen, stringGen } from '../../support/helpers'
const users = Cypress.env('users')
const subscriberId = Cypress.env('subscriberId')

context('company-language-translation', () => {
    const optionTranslatedToSpanish = (selector, translatedText) => cy.get(selector).should('have.text', translatedText)
    const placeholdersTranslatedToSpanish = (selector, text) => cy.get(selector).should('have.attr', 'placeholder', text)
    const salesRepGlobalUserId = users['salesRep'].globalUserId
    const salesRepUserId = users['salesRep'].userId
    const salesRepName = users['salesRep'].details.name
    const userData = {
        subscriberId: subscriberId,
        userId: salesRepUserId,
        globalUserId: salesRepGlobalUserId
    }
    before(() => {
        // change to Spanish
        cy.APILogin('crmAdmin')
        cy.navigateAndCheckURL(COMPANY_LIST_URL)
        cy.changeUserLanguage('Spanish')
    })

    after(() => {
        // change back to English
        cy.navigateAndCheckURL(COMPANY_LIST_URL)
        cy.changeUserLanguage('English')
    })

    context('company-list-language-translation', () => {
        before(() => {
            cy.navigateAndCheckURL(COMPANY_LIST_URL)
        })
        it('header options translated to Spanish', () => {
            optionTranslatedToSpanish('.page-title', 'Compañías')
            optionTranslatedToSpanish('#btnGlobal > span', 'Global')
            optionTranslatedToSpanish('#btnAddCompany > span', 'Empresa')

            //placeholders
            placeholdersTranslatedToSpanish('#txtKeyword', 'Buscar')
            cy.get('#select2-ddlCountry-container > .select2-selection__placeholder').should('have.text', 'Pais')
            placeholdersTranslatedToSpanish('#txtCity', 'Ciudad')
            placeholdersTranslatedToSpanish('#txtPostalCode', 'Codigo Postal')
        })

        it('table headers translated to Spanish', () => {
            optionTranslatedToSpanish('.header-wrap [data-col-id="name"]', 'Nombre')
            optionTranslatedToSpanish('.header-wrap [data-col-id="city"]', 'Ciudad')
            optionTranslatedToSpanish('.header-wrap [data-col-id="country"]', 'Pais')
            optionTranslatedToSpanish('.header-wrap [data-col-id="salesTeam"]', 'Equipo de ventas')
            optionTranslatedToSpanish('.header-wrap [data-col-id="lastActivity"]', 'Última Actividad')
            optionTranslatedToSpanish('.header-wrap [data-col-id="nextActivity"]', 'Actividad Siguiente')
        })
    })

    context('company-view-language-translation', () => {
        let newCompanyId
        const companyName = `COMPANY_LANGUAGE_${stringGen(5)}`
        before(() => {
            const companyData = {
                companyName,
                subscriberId,
                userId: salesRepUserId,
                globalUserId: salesRepGlobalUserId
            }
            cy.addCompanyAPI(companyData).then((response) => {
                newCompanyId = response.body.CompanyId
                cy.navigateAndCheckURL(COMPANY_DETAIL_URL(response.body.CompanyId))
            })
        })

        after(() => {
            cy.deleteCompanyAPI(newCompanyId, salesRepGlobalUserId, subscriberId)
        })

        it('breadcrumb translated to Spanish', () => {
            optionTranslatedToSpanish('.bread_crumb > a', 'Compañías')
            optionTranslatedToSpanish('.bread_crumb > span:nth-of-type(2)', 'Detalle de la empresa')
        })

        it('headers translated to Spanish', () => {
            optionTranslatedToSpanish('.desktop-panel-nav li > a#aOverview > span', 'Visión general')
            optionTranslatedToSpanish('.desktop-panel-nav [data-type="deals"] span', 'Ofertas')
            optionTranslatedToSpanish('.desktop-panel-nav [data-type="events"] span', 'Eventos')
            optionTranslatedToSpanish('.desktop-panel-nav [data-type="tasks"] span', 'Tareas')
            optionTranslatedToSpanish('.desktop-panel-nav [data-type="notes"] span', 'Notas')
            optionTranslatedToSpanish('.desktop-panel-nav [data-type="documents"] span', 'Documentos')
            optionTranslatedToSpanish('.desktop-panel-nav [data-type="contacts"] span', 'Contactos')
            optionTranslatedToSpanish('.desktop-panel-nav [data-type="messaging"] span', 'Mensajes')
            optionTranslatedToSpanish('.desktop-panel-nav [data-type="salesteam"] span', 'Equipo de ventas')
            optionTranslatedToSpanish('.desktop-panel-nav [data-type="activity"] span', 'Activity Log')
            optionTranslatedToSpanish('.desktop-panel-nav [data-type="relatedcompanies"] span', 'Compañías relacionadas')
        })

        it('details widget translated to Spanish', () => {
            optionTranslatedToSpanish('.detail-card h3 span', 'Detalles')
            optionTranslatedToSpanish('#lblCompanyCodeHeader', 'Codigo de compañia')
            optionTranslatedToSpanish('.detail-card .inner-wrp:nth-of-type(2) > div.card-label', 'Origen')
            optionTranslatedToSpanish('.detail-card .inner-wrp:nth-of-type(3) > div.card-label', 'Tipo')
            optionTranslatedToSpanish('.detail-card .inner-wrp:nth-of-type(4) > div.card-label', 'Industria')
            optionTranslatedToSpanish('.detail-card .inner-wrp:nth-of-type(5) > div.card-label', 'Perfil actualizado')
            optionTranslatedToSpanish('.detail-card .inner-wrp:nth-of-type(6) > div.card-label', 'Creado')
            optionTranslatedToSpanish('.detail-card .inner-wrp:nth-of-type(7) > div.card-label', 'Comentarios')
        })

        it('notes widget translated to Spanish', () => {
            optionTranslatedToSpanish('.overview-note.note-textarea .btnAddNote', 'Añadir la nota')
            placeholdersTranslatedToSpanish('.overview-note.note-textarea #txtNote', 'nota')
        })

        it('contact widget translated to Spanish', () => {
            optionTranslatedToSpanish('#divSalesOwnerContainer h3 span', 'Dueño de ventas')
        })
    })
})