/// <reference types="Cypress" />

import { quotesForm } from '../../forms'
import { QUOTES_URL } from '../../urls'
import moment from 'moment'
import 'moment-timezone'
import { stringGen, convertFirstCharOfStringToUpperCase, numberWithCommas } from '../../support/helpers'
const users = Cypress.env('users')
const subscriberId = Cypress.env('subscriberId')
const salesRepUser = users['salesRep']
const salesManagerUser = users['salesManager']

context('quotes', () => {
    describe('validation', () => {
        before(() => {
            const user = 'salesRep';
            cy.login(user)
            cy.get('#navSidebar_lblUserName')
                .should('have.text', users[user].details.name)
            // cy.APILogin('salesRep')
        })

        context('quotes page', () => {

            beforeEach(() => {
                cy.navigateAndCheckURL(QUOTES_URL)
            })

            it('No quotes returned displays the no quotes page', () => {
                cy.intercept('api/quote/GetQuotes', { "CurrencySymbol": "$", "IsLastPage": true, "OverdueGlobalQuoteCount": 0, "OverdueGlobalQuotes": [], "GlobalQuotes": [], "GlobalQuotesExtended": [] })
                cy.reload()
                cy.noQuotesPageDisplayed()
            })

            it('Add quote button in body displays form', () => {
                cy.intercept('api/quote/GetQuotes', { "CurrencySymbol": "$", "IsLastPage": true, "OverdueGlobalQuoteCount": 0, "OverdueGlobalQuotes": [], "GlobalQuotes": [], "GlobalQuotesExtended": [] })
                cy.reload()
                cy.openQuotesForm('body')
            })

            it('Add quote button in header displays form', () => {
                cy.openQuotesForm('header')
            })
        })

        context('quotes form', () => {

            beforeEach(() => {
                cy.navigateAndCheckURL(QUOTES_URL)
                // cy.openQuotesForm('header')
            })

            it('Quote name, company and valid until date are required', () => {
                cy.quotesFormRequiredFields('quotes')
            })

            it('Cancel out of form using cross', () => {
                cy.closeQuotesForm('')
            })

            it('Cancel out of form via cancel button', () => {
                cy.closeQuotesForm('body')
            })
        })
    })

    describe('quotes filtering', () => {
        let quoteUserGlobalQuoteId
        let quoteAcceptedGlobalQuoteId
        let quoteRecievedGlobalQuoteId
        let quoteOpenGlobalQuoteId
        let quoteDeclinedGlobalQuoteId
        let companyName = `Quote company ${stringGen(6)}`
        let newCompanyId
        let newGlobalCompanyId

        const companyData = {
            companyName,
            subscriberId,
            userId: salesManagerUser.userId,
            globalUserId: salesManagerUser.globalUserId
        }
        const quoteUser = {
            subscriberId: subscriberId,
            userId: salesRepUser.userId,
            userIdGlobal: salesRepUser.globalUserId,
            quoteName: stringGen(8),
            companyId: newCompanyId,
            companyIdGlobal: newGlobalCompanyId,
            companyName: companyName,
            quoteValidTo: moment().format('DD-MMM-YY')
        }

        const quoteAccepted = {
            subscriberId: subscriberId,
            userId: salesManagerUser.userId,
            userIdGlobal: salesManagerUser.globalUserId,
            quoteName: stringGen(8),
            quoteStatus: 'accepted',
            companyId: newCompanyId,
            companyIdGlobal: newGlobalCompanyId,
            companyName: companyName,
            quoteValidTo: moment().format('DD-MMM-YY')
        }

        const quoteRecieved = {
            subscriberId: subscriberId,
            userId: salesManagerUser.userId,
            userIdGlobal: salesManagerUser.globalUserId,
            quoteName: stringGen(8),
            quoteStatus: 'received',
            companyId: newCompanyId,
            companyIdGlobal: newGlobalCompanyId,
            companyName: companyName,
            quoteValidTo: moment().format('DD-MMM-YY')
        }

        const quoteOpen = {
            subscriberId: subscriberId,
            userId: salesManagerUser.userId,
            userIdGlobal: salesManagerUser.globalUserId,
            quoteName: stringGen(8),
            quoteStatus: 'open',
            companyId: newCompanyId,
            companyIdGlobal: newGlobalCompanyId,
            companyName: companyName,
            quoteValidTo: moment().format('DD-MMM-YY')
        }

        const quoteDeclined = {
            subscriberId: subscriberId,
            userId: salesManagerUser.userId,
            userIdGlobal: salesManagerUser.globalUserId,
            quoteName: stringGen(8),
            quoteStatus: 'declined',
            companyId: newCompanyId,
            companyIdGlobal: newGlobalCompanyId,
            companyName: companyName,
            quoteValidTo: moment().format('DD-MMM-YY')
        }

        before(() => {
            const user = 'salesManager';
            cy.login(user)
            cy.get('#navSidebar_lblUserName')
                .should('have.text', salesManagerUser.details.name)

            cy.addCompanyAPI(companyData).then((response) => {
                newCompanyId = response.body.CompanyId
                newGlobalCompanyId = response.body.GlobalCompanyId
            })

            cy.addQuoteAPI(quoteUser).then((response) => {
                quoteUserGlobalQuoteId = response.body.QuoteIdGlobal
            })

            cy.addQuoteAPI(quoteAccepted).then((response) => {
                quoteAcceptedGlobalQuoteId = response.body.QuoteIdGlobal
            })

            cy.addQuoteAPI(quoteRecieved).then((response) => {
                quoteRecievedGlobalQuoteId = response.body.QuoteIdGlobal
            })

            cy.addQuoteAPI(quoteOpen).then((response) => {
                quoteOpenGlobalQuoteId = response.body.QuoteIdGlobal
            })

            cy.addQuoteAPI(quoteDeclined).then((response) => {
                quoteDeclinedGlobalQuoteId = response.body.QuoteIdGlobal
            })
        })

        beforeEach(() => {
            cy.intercept('/api/quote/GetQuotes').as('getQuotes')
            cy.navigateAndCheckURL(QUOTES_URL)
        })

        after(() => {
            const salesManagerUserId = salesManagerUser.userId
            const salesManagerGlobalUserId = salesManagerUser.globalUserId
            cy.deleteQuoteApi(subscriberId, salesManagerUserId, salesManagerGlobalUserId, quoteUserGlobalQuoteId)
            cy.deleteQuoteApi(subscriberId, salesManagerUserId, salesManagerGlobalUserId, quoteAcceptedGlobalQuoteId)
            cy.deleteQuoteApi(subscriberId, salesManagerUserId, salesManagerGlobalUserId, quoteRecievedGlobalQuoteId)
            cy.deleteQuoteApi(subscriberId, salesManagerUserId, salesManagerGlobalUserId, quoteOpenGlobalQuoteId)
            cy.deleteQuoteApi(subscriberId, salesManagerUserId, salesManagerGlobalUserId, quoteDeclinedGlobalQuoteId)
            cy.deleteCompanyAPI(newCompanyId, salesManagerGlobalUserId, subscriberId)
        })

        context('status', () => {
            it('Filter by User', () => {
                cy.quoteSelectUserFilter(salesRepUser.details.name)
                cy.wait('@getQuotes')
                cy.quoteBodyContainsItem(quoteUser.quoteName)
                // cy.quoteBodyDoesNotContainItem(quoteAccepted.quoteName)
                // cy.quoteBodyDoesNotContainItem(quoteRecieved.quoteName)
                cy.quoteBodyDoesNotContainItem(quoteOpen.quoteName)
                cy.quoteBodyDoesNotContainItem(quoteDeclined.quoteName)
            })

            it('Filter by Accepted', () => {
                cy.quoteSelectStatusFilter('Accepted')
                cy.wait('@getQuotes')
                cy.quoteBodyContainsItem(quoteAccepted.quoteName)
                cy.quoteBodyDoesNotContainItem(quoteUser.quoteName)
                cy.quoteBodyDoesNotContainItem(quoteRecieved.quoteName)
                cy.quoteBodyDoesNotContainItem(quoteOpen.quoteName)
                cy.quoteBodyDoesNotContainItem(quoteDeclined.quoteName)
            })

            it('Filter by Recieved', () => {
                cy.quoteSelectStatusFilter('Received')
                cy.wait('@getQuotes')
                cy.quoteBodyContainsItem(quoteRecieved.quoteName)
                cy.quoteBodyDoesNotContainItem(quoteAccepted.quoteName)
                cy.quoteBodyDoesNotContainItem(quoteUser.quoteName)
                cy.quoteBodyDoesNotContainItem(quoteOpen.quoteName)
                cy.quoteBodyDoesNotContainItem(quoteDeclined.quoteName)
            })

            it('Filter by Open', () => {
                cy.quoteSelectStatusFilter('Open')
                cy.wait('@getQuotes')
                cy.quoteBodyContainsItem(quoteOpen.quoteName)
                // cy.quoteBodyDoesNotContainItem(quoteAccepted.quoteName)
                // cy.quoteBodyDoesNotContainItem(quoteRecieved.quoteName)
                cy.quoteBodyDoesNotContainItem(quoteUser.quoteName)
                cy.quoteBodyDoesNotContainItem(quoteDeclined.quoteName)
            })

            it('Filter by Declined', () => {
                cy.quoteSelectStatusFilter('Declined')
                cy.wait('@getQuotes')
                cy.quoteBodyContainsItem(quoteDeclined.quoteName)
                cy.quoteBodyDoesNotContainItem(quoteAccepted.quoteName)
                cy.quoteBodyDoesNotContainItem(quoteRecieved.quoteName)
                cy.quoteBodyDoesNotContainItem(quoteOpen.quoteName)
                cy.quoteBodyDoesNotContainItem(quoteUser.quoteName)
            })

            it('Filter by All', () => {
                cy.quoteSelectStatusFilter('All')
                cy.wait('@getQuotes')
                cy.quoteBodyContainsItem(quoteUser.quoteName)
                cy.quoteBodyContainsItem(quoteAccepted.quoteName)
                cy.quoteBodyContainsItem(quoteRecieved.quoteName)
                cy.quoteBodyContainsItem(quoteOpen.quoteName)
                cy.quoteBodyContainsItem(quoteDeclined.quoteName)
            })
        })

        context('keyword', () => {
            const searchQuotes = (text) => cy.get('#txtSearch').type(`${text}{enter}`)
            it('Valid search', () => {
                searchQuotes(quoteAccepted.quoteName)
                cy.wait('@getQuotes')
                cy.quoteBodyContainsItem(quoteAccepted.quoteName)
                cy.quoteBodyDoesNotContainItem(quoteUser.quoteName)
                cy.quoteBodyDoesNotContainItem(quoteRecieved.quoteName)
                cy.quoteBodyDoesNotContainItem(quoteOpen.quoteName)
                cy.quoteBodyDoesNotContainItem(quoteDeclined.quoteName)
            })

            it('Invalid search', () => {
                searchQuotes(stringGen(10))
                cy.wait('@getQuotes')
                cy.noQuotesPageDisplayed()
            })
        })
    })

    describe('quotes functionality', () => {
        const companyName = `Quote Company ${stringGen(4)}`
        const contactName = `Quote Contact ${stringGen(4)}`
        const dealName = `Quote Deal ${stringGen(4)}`
        let newCompanyId
        let globalCompanyId
        let contactId
        let dealId

        const salesManagerUserData = {
            subscriberId: subscriberId,
            userId: salesManagerUser.userId,
            globalUserId: salesManagerUser.globalUserId
        }

        before(() => {
            const user = 'salesManager';
            cy.login(user)
            cy.get('#navSidebar_lblUserName')
                .should('have.text', salesManagerUser.details.name)

            const companyData = {
                companyName,
                subscriberId,
                userId: salesManagerUser.userId,
                globalUserId: salesManagerUser.globalUserId
            }

            cy.addCompanyAPI(companyData).then((response) => {
                newCompanyId = response.body.CompanyId
                globalCompanyId = response.body.GlobalCompanyId

                cy.addContactWithCompanyIDAPI(globalCompanyId, contactName, salesManagerUserData).then((response) => {
                    contactId = response.body.Contact.GlobalContactId
                })

                cy.addDeal(globalCompanyId, companyName, contactId, contactName, dealName, 'Qualifying', salesManagerUserData).then((response) => {
                    dealId = response.body
                })
            })
        })

        after(() => {
            cy.deleteDealAPI(dealId, salesManagerUserData)
            cy.removeContactAPI(contactId, salesManagerUserData)
            cy.deleteCompanyAPI(newCompanyId, salesManagerUserData.globalUserId, subscriberId)
        })

        beforeEach(() => {
            cy.navigateAndCheckURL(QUOTES_URL)
        })

        it('Add a quote', () => {
            let quoteId

            const quoteData = {
                quoteName: stringGen(8),
                quoteStatus: 'accepted',
                quoteCode: 'test',
                quoteMode: 'sea',
                quoteCompany: companyName,
                quoteCompanySearch: 'Quote',
                quoteContact: contactName,
                quoteContactSearch: 'Quote',
                quoteDeal: dealName,
                quoteDealSearch: 'Quote',
                quoteValidTo: moment().format('DD-MMM-YY'),
                quoteAmount: '1000',
                quoteDetails: `QUOTE DETAILS ${stringGen(8)}`,
                quoteConditions: `CONDITIONS ${stringGen(10)}`,
                quoteNotes: `NEW NOTE FOR QUOTE ${stringGen(20)}`
            }

            const { quoteName, quoteStatus, quoteAmount } = quoteData

            cy.intercept('/api/quote/SaveQuote/').as('saveQuote')
            cy.openQuotesForm('header')
            cy.fillForm(quotesForm, quoteData)
            cy.quoteSaveForm()
            cy.wait('@saveQuote').then((xhr) => {
                quoteId = xhr.response.body.QuoteIdGlobal

                const createdFormat = 'ddd, DD-MMM-YY'

                cy.validateQuoteOverview(
                    quoteId,
                    convertFirstCharOfStringToUpperCase(quoteStatus),
                    convertFirstCharOfStringToUpperCase(quoteName),
                    moment().format(createdFormat),
                    moment().format(createdFormat),
                    dealName,
                    companyName,
                    contactName,
                    `$${numberWithCommas(quoteAmount)}`
                )

                cy.deleteQuoteApi(subscriberId, salesManagerUserData.userId, salesManagerUserData.globalUserId, quoteId)
            })
        })

        // it('Add quote with attachment', () => {

        // })

        // it('Add quote amount on overview', () => {

        // })

        // it('Change quote status on overview', () => {

        // })

        // it('Edit Quote', () => {

        // })

        // it('Delete Quote', () => {

        // })
    })
})