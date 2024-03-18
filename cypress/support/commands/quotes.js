import { stringGen, numGen, convertFirstCharOfStringToUpperCase } from '../../support/helpers'

const quotesSelectors = {
    quoteForm: {
        btnCancel: '#QuoteAddEdit_btnCancel',
        btnClose: '#QuoteAddEdit_btnClose',
        btnSave: '#QuoteAddEdit_btnSave'
    },
    quoteOverview: {
        quoteStatus: '.data-grid-column-val[data-col-id="status"]',
        quoteName: '.data-grid-column-val[data-col-id="name"]',
        quoteCreated: '.data-grid-column-val[data-col-id="created"]',
        quoteValidTo: '.data-grid-column-val[data-col-id="validUntil"]',
        quoteDeal: '.data-grid-column-val[data-col-id="deal"]',
        quoteCompany: '.data-grid-column-val[data-col-id="company"]',
        quoteContact: '.data-grid-column-val[data-col-id="contact"]',
        quoteAmount: '.data-grid-column-val[data-col-id="amount"]',
        quoteEdit: '.data-grid-column-val[data-col-id="actions"]'
    }
}

const { btnCancel, btnClose, btnSave } = quotesSelectors.quoteForm;
const { quoteStatus, quoteName, quoteCreated, quoteValidTo, quoteDeal, quoteCompany, quoteContact, quoteAmount, quoteEdit } = quotesSelectors.quoteOverview;

Cypress.Commands.add('validateQuoteOverview', (quoteId, status, name, created, valid, deal, company, contact, amount) => {
    const quoteSelector = `.row-wrapper[data-cypress-id="${quoteId}"]`

    //status, name, created, valid until, deal, company, contact, amount visible on overview
    cy.get(`${quoteSelector} ${quoteStatus}`).contains(status)
    cy.get(`${quoteSelector} ${quoteName}`).contains(name)
    cy.get(`${quoteSelector} ${quoteCreated}`).contains(created)
    cy.get(`${quoteSelector} ${quoteValidTo}`).contains(valid)
    cy.get(`${quoteSelector} ${quoteDeal}`).contains(deal)
    cy.get(`${quoteSelector} ${quoteCompany}`).contains(company)
    cy.get(`${quoteSelector} ${quoteContact}`).contains(contact)
    cy.get(`${quoteSelector} ${quoteAmount}`).contains(amount)
})

Cypress.Commands.add('validateQuoteFormEdit', () => {

})

Cypress.Commands.add('noQuotesPageDisplayed', () => {
    cy.get('.data-grid-overlay.data-grid-overlay-noItems')
        .should('be.visible')

    cy.get('.data-grid-overlay-noItems button.primary-btn')
        .contains('Add Quote')

    cy.get('.data-grid-overlay-noItems')
        .contains('No Quotes')
})

Cypress.Commands.add('openQuotesForm', (type) => {
    if (type == 'body') {
        cy.get('.data-grid-overlay-noItems button.primary-btn')
            .click()
    } else {
        cy.get('#btnAddQuote')
            .click()
    }

    cy.get('#contentOverlayQuoteAddEdit .row-form-groups')
        .should('be.visible')
})

Cypress.Commands.add('closeQuotesForm', (type) => {
    if (type == 'body') {
        cy.get(btnCancel).click()
    } else {
        cy.get(btnClose).click()
    }

    cy.get('.row-form-groups').should('not.be.visible')
})

Cypress.Commands.add('quotesFieldsReadOnly', (type, companyName, contactName, dealName) => {
    const companyReadOnly = () => {
        cy.get('.select2-container--disabled #select2-QuoteAddEdit_ddlGlobalCompany-container')
            .should('be.visible')
            .and('contain', companyName)
        cy.get('#select2-QuoteAddEdit_ddlGlobalCompany-container').click()
        cy.get('#select2-QuoteAddEdit_ddlGlobalCompany-results').should('not.exist')
    }

    const dealReadOnly = () => {
        cy.get('.select2-container--disabled [aria-labelledby="select2-QuoteAddEdit_ddlGlobalDeal-container"]')
            .should('be.visible')
            .and('contain', contactName)
        cy.get('[aria-labelledby="select2-QuoteAddEdit_ddlGlobalDeal-container"]').click()
        cy.get('#select2-QuoteAddEdit_ddlGlobalDeal-results').should('not.exist')
    }

    const contactReadOnly = () => {
        cy.get('.select2-container--disabled [aria-labelledby="select2-QuoteAddEdit_ddlContact-container"]')
            .should('be.visible')
            .and('contain', dealName)
        cy.get('[aria-labelledby="select2-QuoteAddEdit_ddlContact-container"]').click()
        cy.get('#select2-QuoteAddEdit_ddlContact-results').should('not.exist')
    }

    if (type == 'companies') {
        companyReadOnly()

    } else if (type == 'deals') {
        companyReadOnly()
        dealReadOnly()
    } else {
        companyReadOnly()
        contactReadOnly()
    }

})

Cypress.Commands.add('quoteSaveForm', () => {
    cy.get(btnSave).click()
})

Cypress.Commands.add('quotesFormRequiredFields', (type = '') => {
    cy.quoteSaveForm()
    const requiredBorderTest = (selector) => cy.get(selector).should('have.css', 'border-color').and('eq', 'rgb(205, 43, 30)')

    requiredBorderTest('#QuoteAddEdit_txtQuoteName')
    requiredBorderTest('#QuoteAddEdit_txtQuoteValidTo')
    if (type == 'quotes') {
        requiredBorderTest('[aria-labelledby="select2-QuoteAddEdit_ddlGlobalCompany-container"]')
    }
})

Cypress.Commands.add('quoteSelectUserFilter', (userName) => {
    cy.get('.col-auto.row.no-gutters .form-group-filter-owner .select2-selection.select2-selection--single')
        .click()
    cy.get('#select2-ddlFilterOwner-results')
        .contains(userName)
        .click()
})

Cypress.Commands.add('quoteSelectStatusFilter', (status) => {
    cy.get('#select2-ddlFilterQuoteStatus-container')
        .click()
    cy.get('#select2-ddlFilterQuoteStatus-results')
        .contains(status)
        .click()
})

Cypress.Commands.add('quoteBodyContainsItem', (quoteName) => {
    cy.get('#quotes-data-grid .items-overflow-inner > .row-wrapper')
        .should('contain', quoteName)
})

Cypress.Commands.add('quoteBodyDoesNotContainItem', (quoteName) => {
    cy.get('#quotes-data-grid .items-overflow-inner > .row-wrapper')
        .should('not.contain', quoteName)
})

Cypress.Commands.add('addQuoteAPI', ({ subscriberId, userId, userIdGlobal, quoteName, quoteStatus = "", quoteCode = "", quoteMode = "", companyId, companyIdGlobal, companyName, contactId = null, dealId = null, quoteValidTo, quoteAmount = "", quoteDetails = "", quoteConditions = "", quoteNotes = "" }) => {
    cy.request({
        url: '/api/quote/SaveQuote/',
        method: 'POST',
        body: {
            "SubscriberId": subscriberId,
            "UserId": userId,
            "UserIdGlobal": userIdGlobal,
            "Documents": [],
            "GlobalQuote": {
                "QuoteName": quoteName,
                "QuoteStatus": quoteStatus,
                "QuoteCode": quoteCode,
                "QuoteMode": quoteMode,
                "CompanyId": companyId,
                "CompanyIdGlobal": companyIdGlobal,
                "CompanyName": companyName,
                "ContactId": contactId,
                "DealId": dealId,
                "QuoteValidTo": quoteValidTo,
                "QuoteAmount": quoteAmount,
                "QuoteDetails": quoteDetails,
                "QuoteConditions": quoteConditions,
                "QuoteNotes": quoteNotes
            }
        }
    })
})

Cypress.Commands.add('deleteQuoteApi', (subscriberId, userId, userIdGlobal, quoteGlobalId) => {
    cy.request({
        url: '/api/quote/DeleteQuote/',
        method: 'POST',
        body: {
            "SubscriberId": subscriberId,
            "UserId": userId,
            "UserIdGlobal": userIdGlobal,
            "QuoteIdGlobal": quoteGlobalId
        }
    })
})