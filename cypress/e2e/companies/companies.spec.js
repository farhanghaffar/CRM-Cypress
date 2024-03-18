/// <reference types="Cypress" />

import moment from 'moment'
import { contactForm, companyForm, dealForm, taskForm, userForm } from '../../forms'
import {
  COMPANY_LIST_URL,
  COMPANY_ADD_URL,
  COMPANY_EDIT_URL,
  COMPANY_DETAIL_URL,
} from '../../urls'
import { stringGen, numGen, convertFirstCharOfStringToUpperCase } from '../../support/helpers'
const users = Cypress.env('users')
const subscriberId = Cypress.env('subscriberId')

context('companies', () => {
  const salesRepGlobalUserId = users['salesRep'].globalUserId
  const salesRepUserId = users['salesRep'].userId
  const salesRepName = users['salesRep'].details.name
  const userData = {
    subscriberId: subscriberId,
    userId: salesRepUserId,
    globalUserId: salesRepGlobalUserId
  }

  const navigateToCompanyAndTab = () => {
    cy.get('[title="View Company"]')
      .contains(newCompanyName)
      .click()
  }
  const newCompanyName = `${stringGen(5)}${numGen(3)}${stringGen(5)}${numGen(4)}`
  let newCompany = {
    companyName: newCompanyName,
    companyType: 'Carrier',
    division: stringGen(8),
    owner: salesRepName,
    industry: 'Automotive',
    companyCode: `${stringGen(3)}${numGen(3)}`,
    phone: numGen(9),
    fax: numGen(9),
    source: 'Historic Relationship',
    address: `${numGen(3)} ${stringGen(10)} Road`,
    city: stringGen(12),
    state: 'CA',
    postalCode: numGen(5),
    country: 'United States',
    website: `${stringGen(9)}.com`,
    note: stringGen(20),
    isActive: true,
    isCustomer: true,
  }

  const dealName = `Test Deal ${stringGen(5)}`
  const newContactName = `Test Contact ${stringGen(5)}`
  const todaysDate = moment()
  let newDeal = {
    dealName,
    dealType: 'Maintenance',
    dealIncoterms: 'CFR',
    dealCompetitor: 'Yusen',
    dealCommodities: 'Automotive',
    dealProposalDate: todaysDate.format('DD-MMM-YY'),
    dealDecisionDate: todaysDate.add(5, 'days').format('DD-MMM-YY'),
    dealFirstshipmentDate: todaysDate.add(1, 'months').format('DD-MMM-YY'),
    dealContractEndDate: todaysDate.add(5, 'months').format('DD-MMM-YY'),
    dealIndustry: 'Automotive',
    dealCampaign: 'Campaign 001',
    dealComment: 'Comment',
  }

  let newContact = {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'aaaa_test@mail.com',
    jobTitle: 'Test Job Title',
    address: 'Test123',
    businessPhone: '312-227-9283',
    mobilePhone: '312-227-9283',
    notes: 'test notes',
    isEmail: true,
    isCall: false,
    // isMarried: true,
    isHolidayCard: true,
    // isHasChildren: true,
    isFormerEmployee: true,
  }

  before(() => {
    cy.APILogin('salesRep')

    // set language
    localStorage.setItem('language_code', 'en-US')
  })

  let newCompanyId

  describe('company page', () => {

    it('should add new company', () => {
      cy.intercept({
        url: '/api/company/SaveCompany',
        method: 'POST',
      }).as('saveCompany')
      cy.navigateAndCheckURL(COMPANY_ADD_URL)
      cy.companyAlreadyExists(newCompanyName)
      cy.fillForm(companyForm, newCompany)
      cy.get('#btnSave').click()
      cy.wait('@saveCompany').then((xhr) => {
        cy.fillForm(contactForm, newContact)
        cy.get('#contactAddEdit_btnSave').click()
        cy.get('#lblCompanyName').contains(convertFirstCharOfStringToUpperCase(newCompany.companyName))
        cy.deleteCompanyAPI(xhr.response.body.CompanyId, salesRepGlobalUserId, subscriberId)
      })
    })

    it('should list companies', () => {
      cy.navigateAndCheckURL(COMPANY_LIST_URL)
      cy.getCompanyList(userData).then((response) => {
        // get ful list of data
        const body = response.body
        const companyData = {
          totalCompanies: body.Records,
          companies: body.Companies,
        }
        const { totalCompanies, companies } = companyData

        let companyNames = []

        for (let i = 0; i < companies.length; i++) {
          companyNames.push(companies[i].CompanyName)
        }

        // cy.get('.total-records').should('have.text', `${totalCompanies} records`)
        cy.get('.items-overflow-inner [data-col-id="name"]')
          .each(($el, index) => {
            if (index < 20) {
              cy.wrap($el).contains(companyNames[index])
            }
          })
      })
    })

    it('should search companies and find one result', () => {
      cy.navigateAndCheckURL(COMPANY_LIST_URL)
      cy.getCompanyList(userData).then((response) => {
        const secondCompanyName = response.body.Companies[1].CompanyName

        cy.searchResultsCompanies(secondCompanyName)
        cy.get('[data-col-id="name"]')
          .should('have.length', 2)
        cy.get('.items-overflow-inner [data-col-id="name"]')
          .should('have.text', secondCompanyName)
      })
    })

    it('should search companies and find no results', () => {
      const searchText = 'rhrhhfhfhjhj'

      cy.navigateAndCheckURL(COMPANY_LIST_URL)
      cy.searchResultsCompanies(searchText)
      cy.wait(1000)
      cy.get('.search-form:last-child .btn-search').click()
      cy.get('.data-grid-overlay.data-grid-overlay-noItems')
        .contains('No Companies')
    })
  })

  describe('Global Company Search', () => {
    const companyName = `${numGen(5)}${stringGen(10)}`
    let globalCompanyId
    let companyId

    describe('existing company', () => {
      before(() => {
        const companyData = {
          companyName,
          subscriberId,
          userId: salesRepUserId,
          globalUserId: salesRepGlobalUserId
        }
        cy.addCompanyAPI(companyData).then((response) => {
          globalCompanyId = response.body.GlobalCompanyId
          companyId = response.body.CompanyId
        })

        cy.navigateAndCheckURL(COMPANY_LIST_URL)
      })

      after(() => {
        cy.deleteCompanyAPI(globalCompanyId, salesRepGlobalUserId, subscriberId)
      })

      it('search for company and displays correct information', () => {
        const searchResults = {
          globalCompanyId,
          companyTitle: companyName,
          companyDivision: 'Finance',
          companyAddress: 'San Pedro, Cali, United States',
          companySalesTeam: salesRepName,
        }

        cy.openGlobalCompaniesLookupAndSearch(companyName)
        cy.globalCompanyRowChecker('existing', searchResults)
      })

      it('user will be able to view company if already on the sales team', () => {
        cy.wait(1000)
        cy.get(`#companyLookupDialog_dataGrid .row-wrapper[data-cypress-id="${globalCompanyId}"] [data-action-type="view"]`)
          .contains('View')

        cy.get(`#companyLookupDialog_dataGrid .row-wrapper[data-cypress-id="${globalCompanyId}"] [data-action-type="view"]`).click({ force: true })
        cy.url().should('include', `Companies/CompanyDetail/CompanyDetail.aspx?companyId=${companyId}&subscriberId=${subscriberId}`)
        cy.get('#lblCompanyName').contains(companyName)
      })
    })

    describe.skip('requet access', () => {
      it('user will be able to request access to a new company in which they are not on the sales team', () => {

      })

      it('user will be able to gain access to company when accepted', () => {

      })
    })
  })

  describe('contact', () => {
    const newCompanyName = `AA New Test Company ${stringGen(6)}`
    let newCompanyId

    before(() => {
      const companyData = {
        companyName:newCompanyName,
        subscriberId,
        userId: salesRepUserId,
        globalUserId: salesRepGlobalUserId
      }
      cy.addCompanyAPI(companyData).then((response) => {
        newCompanyId = response.body.CompanyId
      })
    })

    after(() => {
      cy.deleteCompanyAPI(newCompanyId, salesRepGlobalUserId, subscriberId)
    })

    it('should add new primary contact when adding a company', () => {
      cy.navigateAndCheckURL(COMPANY_LIST_URL)
      cy.searchResultsCompanies(newCompanyName)
      cy.get('[data-col-id="name"]>a')
        .contains(newCompanyName)
        .click()
      cy.navigateToTab('contact')
      cy.addContactTab(newContact, userData)
    })

    it('should edit the contact - contact', () => {     
      const newContactNumber = `+590 277${numGen(3)}`
      cy.navigateAndCheckURL(COMPANY_LIST_URL)
      cy.searchResultsCompanies(newCompanyName)
      cy.get('[data-col-id="name"]>a')
        .contains(newCompanyName)
        .click()
      cy.navigateToTab('contact')
      cy.addContactTab(newContact, userData)
      cy.get('a[data-set="new_contact"]:first').click()
      cy.editContact(newContact.firstName+" "+newContact.lastName, newContactNumber);
      cy.get('.contact-card').contains(newContactNumber).should('be.visible')
    })

    it('should delete the contact - contact', () => {   
    const newContactNumber = `+590 277${numGen(3)}`
    const contactFullName = newContact.firstName+" "+newContact.lastName
      cy.navigateAndCheckURL(COMPANY_LIST_URL)
      cy.searchResultsCompanies(newCompanyName)
      cy.get('[data-col-id="name"]>a')
        .contains(newCompanyName)
        .click()
      cy.navigateToTab('contact')
      cy.addContactTab(newContact, userData)
      // cy.removeContact(contactFullName)
      // cy.get('.contact-card').should('not.include.text', contactFullName)
    })
  })

  describe('sales team', () => {
    const companyName = `AA New Test Company ${stringGen(6)}`
    let newCompanyId

    before(() => {
      const companyData = {
        companyName,
        subscriberId,
        userId: salesRepUserId,
        globalUserId: salesRepGlobalUserId
      }
      cy.addCompanyAPI(companyData).then((response) => {
        newCompanyId = response.body.CompanyId
      })
    })

    after(() => {
      cy.deleteCompanyAPI(newCompanyId, salesRepGlobalUserId, subscriberId)
    })

    it('should add the sales team member - team', () => {
      const newSalesMember = users['salesManager']
      let newSearch = {
        salesTeamMember: newSalesMember.details.name,
        salesTeamMemberSearch: newSalesMember.details.name,
        salesRole: 'Country Leader',
      }

      cy.navigateAndCheckURL(COMPANY_DETAIL_URL(newCompanyId))
      cy.navigateToTab('salesTeam')

      const newSalesTeamMember = {
        salesName: newSearch.salesTeamMember,
        salesJobTitle: newSalesMember.details.jobTitle,
        salesLocation: newSalesMember.details.city,
        salesEmail: newSalesMember.details.email,
        salesAddress: newSalesMember.details.address,
        salesNumber: newSalesMember.details.number,
        salesRole: newSearch.salesRole,
      }

      cy.addSalesTeamMember('add', newSearch, newSalesMember.userId, newSalesTeamMember)
      cy.deleteSalesTeamUserAPI('company', newSalesMember.userId, 0, 0, newCompanyId, salesRepGlobalUserId, subscriberId)
    })

    it('should edit the sales team user role - team', () => {
      const newSalesMember = users['locationManager']
      const newSalesRoleSelector = {
        salesRole: {
          id: 'AddSalesTeamMember_ddlSalesTeamRole',
          type: 'select',
          option: { force: true },
        },
      }

      const addSalesTeamUser = {
        companyId: newCompanyId,
        contactId: 0,
        dealId: 0,
        globalUserId: newSalesMember.globalUserId,
        userId: newSalesMember.userId,
        salesTeamRole: 'SALES MANAGER',
        subscriberId: subscriberId
      }
      let newSalesRole = {
        salesRole: 'Country Leader',
      }

      cy.addSalesTeamMemberAPI('company', addSalesTeamUser)
      cy.navigateAndCheckURL(COMPANY_DETAIL_URL(newCompanyId))
      cy.navigateToTab('salesTeam')
      cy.salesTeamChecker(newSalesMember.details.name, addSalesTeamUser.salesTeamRole, addSalesTeamUser.userId)
      cy.editSalesTeam(addSalesTeamUser.userId, newSalesRoleSelector, newSalesRole)
      cy.salesTeamChecker(newSalesMember.details.name, newSalesRole.salesRole, addSalesTeamUser.userId)
      cy.deleteSalesTeamUserAPI('company', addSalesTeamUser.userId, 0, 0, newCompanyId, salesRepGlobalUserId, subscriberId)
    })

    it('should remove the sales team member - team', () => {
      const newSalesMember = users['districtManager']
      const addSalesTeamUser = {
        companyId: newCompanyId,
        contactId: 0,
        dealId: 0,
        globalUserId: newSalesMember.globalUserId,
        userId: newSalesMember.userId,
        salesTeamRole: 'SALES MANAGER',
        subscriberId: subscriberId
      }

      cy.addSalesTeamMemberAPI('company', addSalesTeamUser)
      cy.navigateAndCheckURL(COMPANY_DETAIL_URL(newCompanyId))
      cy.navigateToTab('salesTeam')
      cy.salesTeamChecker(newSalesMember.details.name, addSalesTeamUser.salesTeamRole, addSalesTeamUser.userId)
      cy.removeSalesTeamMember(addSalesTeamUser.userId, newSalesMember.details.name)
    })
  })

  describe('deals', () => {
    let companyID
    let globalCompanyID
    const companyName = `New Company Name ${stringGen(4)}${numGen(4)}`

    before(() => {
      const companyData = {
        companyName,
        subscriberId,
        userId: salesRepUserId,
        globalUserId: salesRepGlobalUserId
      }
      cy.addCompanyAPI(companyData).then((response) => {
        companyID = response.body.CompanyId
        globalCompanyID = response.body.GlobalCompanyId
      })
    })

    beforeEach(() => {
      cy.navigateAndCheckURL(COMPANY_DETAIL_URL(companyID))
      cy.navigateToTab('deals')
    })

    after(() => {
      cy.deleteCompanyAPI(companyID, salesRepGlobalUserId, subscriberId)
    })

    it('No deals shows correct message - active', () => {
      cy.noDealMessageTabs('active')
    })

    it('No deals shows correct message - inactive', () => {
      cy.noDealMessageTabs('inactive')
    })

    it('should add new Deal - overview', () => {
      cy.addContactWithCompanyIDAPI(globalCompanyID, newContactName, userData)
      cy.selectNewDealFromTab()
      cy.get('span[aria-labelledby=select2-ddlContact-container]').click()
      cy.get('#select2-ddlContact-results')
        .contains(`AAA ${newContactName}`)
        .click()
      cy.newDeal('add', dealForm, newDeal, dealName, 'qualifying', userData)
    })

    it('Ensure company field is locked to company', () => {
      cy.selectNewDealFromTab()
      cy.get(`#select2-ddlCompany-container[title="${companyName} - San Pedro"]`)
        .should('be.visible')
        .and('have.text', `${companyName} - San Pedro`)
        .click()
      cy.get('.select2-dropdown.select2-dropdown--below')
        .should('not.exist')
    })

    describe('drag and drop deals', () => {
      let contactID
      let dealID
      const dealName = `Deal Drag test ${stringGen(5)}`

      before(() => {
        cy.addContactWithCompanyIDAPI(globalCompanyID, newContactName, userData).then((response) => {
          contactID = response.body.Contact.GlobalContactId
        })
        cy.addDeal(globalCompanyID, companyName, contactID, newContactName, dealName, 'Qualifying', userData).then((response) => {
          dealID = response.body
        })
      })

      after(() => {
        cy.removeContactAPI(contactID, userData)
        cy.deleteDealAPI(dealID, userData)
      })


      it('Drag and drop deal into Negotiation', () => {
        cy.wait(4000)
        cy.dragAndDropDeal('Qualifying', 'Negotiation')
      })

      it('Drag and drop deal into Trial Shipment', () => {
        cy.wait(4000)
        cy.dragAndDropDeal('Negotiation', 'Trial Shipment')
      })

      it('Drag and drop deal into Final Negotiation', () => {
        cy.wait(4000)
        cy.dragAndDropDeal('Trial Shipment','Final Negotiation')
      })
    })

    let dealDataContactID
    let wonDealID
    let lostDealID
    let stalledDealID
    let qualID
    let trialID
    const wonDealName = `Won deal ${stringGen(5)}`
    const lostDealName = `Lost deal ${stringGen(5)}`
    const stalledDealName = `Stalled deal ${stringGen(5)}`
    const qualifyingDealName = `Qual name ${stringGen(5)}`
    const trialDealName = `Trial name ${stringGen(5)}`

    describe('deal data', () => {

      before(() => {
        cy.addContactWithCompanyIDAPI(globalCompanyID, newContactName, userData).then((response) => {
          dealDataContactID = response.body.Contact.ContactId
        })
        cy.addDeal(globalCompanyID, companyName, dealDataContactID, newContactName, wonDealName, 'Won', userData).then((response) => {
          wonDealID = response.body
        })
        cy.addDeal(globalCompanyID, companyName, dealDataContactID, newContactName, lostDealName, 'Lost', userData).then((response) => {
          lostDealID = response.body
        })
        cy.addDeal(globalCompanyID, companyName, dealDataContactID, newContactName, stalledDealName, 'Stalled', userData).then((response) => {
          stalledDealID = response.body
        })
        cy.addDeal(globalCompanyID, companyName, dealDataContactID, newContactName, qualifyingDealName, 'Qualifying', userData).then((response) => {
          qualID = response.body
        })
        cy.addDeal(globalCompanyID, companyName, dealDataContactID, newContactName, trialDealName, 'Trial Shipment', userData).then((response) => {
          trialID = response.body
        })
      })

      after(() => {
        cy.deleteDealAPI(wonDealID, userData)
        cy.deleteDealAPI(lostDealID, userData)
        cy.deleteDealAPI(stalledDealID, userData)
        cy.deleteDealAPI(qualID, userData)
        cy.deleteDealAPI(trialID, userData)
      })

      it('Inactive tab displays data correctly', () => {
        //ASSERTIONS
        cy.toggleTabs('inactive')
        cy.wait(4000)
        cy.get('.deals-box[data-stage="Won"] .DGreen')
          .contains('Won')
        cy.get('.deals-box[data-stage="Lost"] .DRed')
          .contains('Lost')
        cy.get('.deals-box[data-stage="Stalled"] .DGrey')
          .contains('Stalled')
        const wonDeals = [wonDealName]
        const lostDeals = [lostDealName]
        const stalledDeals = [stalledDealName]

        cy.dealsListTest('Won', 1, wonDeals)
        cy.dealsListTest('Lost', 1, lostDeals)
        cy.dealsListTest('Stalled', 1, stalledDeals)
      })

      it('Test list view for deals', () => {
        const listViewChecker = ({ dealID, dealName, company, owner, stage }) => {
          const dealSelector = `tr[data-id="${dealID}"]`

          cy.get(`${dealSelector} .hover-link`).contains(dealName)
          cy.get(`${dealSelector} td:nth-of-type(2) .company`).contains(company)
          cy.get(`${dealSelector} td:nth-of-type(4)`).contains(owner)
          cy.get(`${dealSelector} td[data-sales-stage-id]`).contains(stage)
        }

        const trialDeal = { dealID: trialID, dealName: trialDealName, company: companyName, owner: salesRepName, stage: 'Trial Shipment' }
        const wonDeal = { dealID: wonDealID, dealName: wonDealName, company: companyName, owner: salesRepName, stage: 'Won' }
        const lostDeal = { dealID: lostDealID, dealName: lostDealName, company: companyName, owner: salesRepName, stage: 'Lost' }
        const stalledDeal = { dealID: stalledDealID, dealName: stalledDealName, company: companyName, owner: salesRepName, stage: 'Stalled' }
        const qualDeal = { dealID: qualID, dealName: qualifyingDealName, company: companyName, owner: salesRepName, stage: 'Qualifying' }

        cy.get('[data-view="list"]').click()
        cy.get('[data-type-card="#active-deal"]').click()
        cy.get('#list-view').should('be.visible')
        listViewChecker(trialDeal)
        listViewChecker(qualDeal)
        cy.toggleTabs('inactive')
        listViewChecker(wonDeal)
        listViewChecker(lostDeal)
        listViewChecker(stalledDeal)
      })
    })
  })

  describe('company quotes', () => {
    let companyID
    const companyName = `New Company Name ${stringGen(4)}${numGen(4)}`
    before(() => {
      const user = 'salesRep';
      cy.login(user)
      cy.get('#navSidebar_lblUserName')
        .should('have.text', users[user].details.name)

      const companyData = {
        companyName,
        subscriberId,
        userId: salesRepUserId,
        globalUserId: salesRepGlobalUserId
      }
      cy.addCompanyAPI(companyData).then((response) => {
        companyID = response.body.CompanyId
      })
    })

    after(() => {
      cy.deleteCompanyAPI(companyID, salesRepGlobalUserId, subscriberId)
    })

    describe('validation', () => {
      context('quotes page', () => {

        beforeEach(() => {
          cy.navigateAndCheckURL(COMPANY_DETAIL_URL(companyID))
          cy.navigateToTab('quotes')
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
          cy.navigateAndCheckURL(COMPANY_DETAIL_URL(companyID))
          cy.navigateToTab('quotes')
          cy.openQuotesForm('header')
        })

        it('Quote name and valid until date are required', () => {
          cy.quotesFormRequiredFields()
        })

        it('Cancel out of form using cross', () => {
          cy.closeQuotesForm('')
        })

        it('Cancel out of form via cancel button', () => {
          cy.closeQuotesForm('body')
        })

        it('Company locked on form', () => {
          cy.quotesFieldsReadOnly('companies', companyName, '', '')
        })
      })
    })
  })

  describe('company events', () => {
    let companyID
    const companyName = `New Company Name ${stringGen(4)}${numGen(4)}`

    before(() => {
      const companyData = {
        companyName,
        subscriberId,
        userId: salesRepUserId,
        globalUserId: salesRepGlobalUserId
      }
      cy.addCompanyAPI(companyData).then((response) => {
        companyID = response.body.CompanyId
      })
    })

    beforeEach(() => {
      cy.navigateAndCheckURL(COMPANY_DETAIL_URL(companyID))
      cy.navigateToTab('events')
    })

    after(() => {
      cy.deleteCompanyAPI(companyID, salesRepGlobalUserId, subscriberId)
    })

    it('No events on event tab displays correct messages', () => {
      cy.noEventsOnTab()
    })

    it('Event form should have company locked', () => {
      cy.selectAddEventHeader()
      cy.get('#select2-ddlCompany-container')
        .contains(companyName)
    })

    const eventTitle = 'New Event On Company'
    let eventID

    it('Add event to company', () => {
      cy.intercept({
        method: 'POST',
        url: '/api/calendarevent/GetCompanyCalendarEvents',
      }).as('getCalendarEvents')
      cy.intercept({
        method: 'POST',
        url: '/api/CalendarEvent/SaveCalendarEvent',
      }).as('addEventAPI')
      const newEvent = {
        eventTitle,
        eventLocation: 'Guatemala',
        eventStartDate: moment().format('DD-MMM-YY'),
        eventEndDate: moment().format('DD-MMM-YY'),
        eventStartTime: '11:00am',
        eventEndTime: '11:30am',
        eventReminder: '5 Minutes',
      }

      const eventsList = [eventTitle]

      cy.addEventOnTab(newEvent, false)
      cy.wait('@addEventAPI').then((xhr) => {
        eventID = xhr.response.body
      })
      cy.eventsTabList(eventsList)
    })

    it('Delete event', () => {
      cy.deleteEventOnTab(eventTitle, eventID)
      cy.get('[data-cypress-testing-id="call-to-action-add-event"]')
        .should('be.visible')
    })
  })

  describe('company documents', () => {
    let companyID
    let globalCompanyID
    const companyName = `New Company Name ${stringGen(4)}${numGen(4)}`

    before(() => {
      const companyData = {
        companyName,
        subscriberId,
        userId: salesRepUserId,
        globalUserId: salesRepGlobalUserId
      }
      cy.addCompanyAPI(companyData).then((response) => {
        companyID = response.body.CompanyId
        globalCompanyID = response.body.GlobalCompanyId
      })
    })

    after(() => {
      cy.deleteCompanyAPI(companyID, salesRepGlobalUserId, subscriberId)
    })

    describe('document validation', () => {
      before(() => {
        cy.navigateAndCheckURL(COMPANY_DETAIL_URL(companyID))
        cy.navigateToTab('documents')
      })
      it('No documents message', () => {
        cy.noDocumentsValidation()
      })

      it('Document validation - name', () => {
        cy.checkDocumentValidationMessage('title')
      })

      it('Document validation - document', () => {
        cy.checkDocumentValidationMessage('document')
      })

      it('Document validation - upload large image (over 5MB)', () => {
        cy.checkDocumentValidationMessage('largeFileType')
      })
    })

    describe('document functionality', () => {
      beforeEach(() => {
        cy.navigateAndCheckURL(COMPANY_DETAIL_URL(companyID))
        cy.navigateToTab('documents')
      })
      it('Delete document', () => {
        const docTitle = `Test Doc Title ${numGen(5)}`
        let newDocument = {
          docTitle,
          docDescription: 'Test doc Description',
        }

        cy.addDocument('company', globalCompanyID, '', '', newDocument, docTitle, newDocument.docDescription, false)
        cy.deleteDocument()
      })

      it('Add a new document', () => {
        const docTitle = `Test Doc Title ${numGen(5)}`
        let newDocument = {
          docTitle,
          docDescription: 'Test doc Description',
        }

        cy.addDocument('company', globalCompanyID, '', '', newDocument, docTitle, newDocument.docDescription, true)
      })

      it('Document remove file', () => {
        cy.get('.docListing .button.add.add-document').click()
        const fileName = 'images/sloth.jpg'

        cy.get('.add-document #drop-wrp').selectFile('cypress/fixtures/images/sloth.jpg', {
          action: 'drag-drop'
      })
        cy.wait(4000)
        const previewSelector = '.dz-preview.dz-processing.dz-image-preview.dz-complete img[alt="sloth.jpg"]'

        cy.get(previewSelector).should('be.visible')
        cy.get('a.dz-remove').should('have.text', 'Remove file').click()
        cy.get(previewSelector).should('not.exist')
        cy.get('.dz-message.needsclick').should('be.visible')
      })
    })
  })

  describe('Companies - Related Companies', () => {
    let companyID
    const companyName = `New Company Name ${stringGen(4)}${numGen(4)}`

    before(() => {
      const companyData = {
        companyName: companyName,
        subscriberId,
        userId: salesRepUserId,
        globalUserId: salesRepGlobalUserId
      }
      cy.addCompanyAPI(companyData).then((response) => {
        companyID = response.body.CompanyId
      })
    })

    beforeEach(() => {
      cy.navigateAndCheckURL(COMPANY_DETAIL_URL(companyID))
      cy.navigateToTab('relatedCompanies')
    })

    after(() => {
      cy.deleteCompanyAPI(companyID, salesRepGlobalUserId, subscriberId)
    })
    let relatedCompanyID
    const companyNameForRelated = `${stringGen(5)} Related Company ${stringGen(5)}`

    // it('Related Company Validation - no company', () => {
    //   cy.relatedCompaniesValidation('noCompany');
    // })

    // it('Related Company Validation - no link type', () => {
    //   cy.relatedCompaniesValidation('linkType');
    // })

    it('Close related company Form', () => {
      cy.relatedCompaniesValidation('close')
    })

    it('No related companies messages', () => {
      cy.noRelatedCompanies()
    })

    it('Add related company and details display correctly', () => {
      const companyData = {
        companyName: companyNameForRelated,
        subscriberId,
        userId: salesRepUserId,
        globalUserId: salesRepGlobalUserId
      }
      console.log(companyData)
      cy.addCompanyAPI(companyData).then((response) => {
        relatedCompanyID = response.body.CompanyId
        const testFirstRecord = {
          linkType: 'Agent',
          city: 'San Pedro',
          country: 'United States',
          relationType: 'Agent',
        }

        cy.addRelatedCompany(companyNameForRelated, 1, testFirstRecord)
      })
    })

    it('Remove Related Company', () => {
      cy.deleteRelatedCompany('individual', 1, companyName)
      cy.deleteCompanyAPI(relatedCompanyID, salesRepGlobalUserId, subscriberId)
    })

    const relatedCompanyOneName = 'Rel Company 1'
    const relatedCompanyTwoName = 'Rel Company 2'
    const relatedCompanyThreeName = 'Rel Company 3'
    let companyOne
    let companyTwo
    let companyThree

    it.skip('Add multiple related companies and details display correctly', () => {

      const companyData1 = {
        relatedCompanyOneName,
        subscriberId,
        userId: salesRepUserId,
        globalUserId: salesRepGlobalUserId
      }
      cy.addCompanyAPI(companyData1).then((response) => {
        companyOne = response.body.CompanyId
      })
      const companyData2 = {
        relatedCompanyTwoName,
        subscriberId,
        userId: salesRepUserId,
        globalUserId: salesRepGlobalUserId
      }
      cy.addCompanyAPI(companyData2).then((response) => {
        companyTwo = response.body.CompanyId
      })
      const companyData3 = {
        relatedCompanyThreeName,
        subscriberId,
        userId: salesRepUserId,
        globalUserId: salesRepGlobalUserId
      }
      cy.addCompanyAPI(companyData3).then((response) => {
        companyThree = response.body.CompanyId
      })

      const relatedCompanyOne = {
        city: 'San Pedro',
        country: 'United States',
        relationType: 'Supplier',
      }

      cy.addRelatedCompany(relatedCompanyOneName, 1, relatedCompanyOne)

      const relatedCompanyTwo = {
        city: 'San Pedro',
        country: 'United States',
        relationType: 'Supplier',
      }

      cy.addRelatedCompany(relatedCompanyTwoName, 2, relatedCompanyTwo)

      const relatedCompanyThree = {
        city: 'San Pedro',
        country: 'United States',
        relationType: 'Supplier',
      }

      cy.addRelatedCompany(relatedCompanyThreeName, 3, relatedCompanyThree)

      cy.get('table.related-companies-table tbody td').should('have.length', 3)

    })

    it.skip('Delete multiple related companies', () => {
      cy.deleteRelatedCompany('all', 1, '')
      cy.deleteCompanyAPI(companyOne, salesRepGlobalUserId, subscriberId)
      cy.deleteCompanyAPI(companyTwo, salesRepGlobalUserId, subscriberId)
      cy.deleteCompanyAPI(companyThree, salesRepGlobalUserId, subscriberId)
    })

    it.skip('Request Access Related Company', () => {
      //need to ask how this works
    })

    it.skip('Change Relation Type Related Company', () => {
      //bug
    })
  })

  describe('company notes', () => {
    let companyID
    let globalCompanyID
    const companyName = `New Company Name ${stringGen(4)}${numGen(4)}`

    before(() => {
      const companyData = {
        companyName,
        subscriberId,
        userId: salesRepUserId,
        globalUserId: salesRepGlobalUserId
      }
      cy.addCompanyAPI(companyData).then((response) => {
        companyID = response.body.CompanyId
        globalCompanyID = response.body.GlobalCompanyId
      })
    })
    beforeEach(() => {
      cy.navigateAndCheckURL(COMPANY_DETAIL_URL(companyID))
      cy.wait(3000)
    })

    after(() => {
      cy.deleteCompanyAPI(companyID, salesRepGlobalUserId, subscriberId)
    })

    it('No notes shows meaningful message', () => {
      cy.navigateToTab('notes')
      cy.noNotesDisplaysCorrectly()
    })

    it('Note validation (no note)', () => {
      cy.navigateToTab('notes')
      cy.checkNoNoteValidation()
    })

    it('Add note', () => {
      const newNoteName = `New Note for Automation ${stringGen(7)} ${numGen(7)}`
      let newNote = {
        note: newNoteName,
      }

      cy.navigateToTab('notes')
      cy.addNote(newNote, newNoteName, salesRepName, salesRepGlobalUserId)
    })

    it('Edit note', () => {
      const addNoteAPI = {
        globalCompanyId: globalCompanyID,
        noteContent: `New Note For Edit ${stringGen(5)}`,
        contactId: 0,
        dealId: 0,
      }

      cy.addNoteAPI('company', addNoteAPI, userData).then((response) => {
        const noteId = response.body

        cy.reload()
        cy.wait(3000)
        cy.navigateToTab('notes')
        cy.editNote(addNoteAPI.noteContent, `New Note ${numGen(5)}`, noteId, salesRepName, salesRepGlobalUserId)
      })
    })

    it('Delete note', () => {
      const addNoteAPI = {
        globalCompanyId: globalCompanyID,
        noteContent: `New Note For Delete ${stringGen(5)}`,
        contactId: 0,
        dealId: 0,
      }

      cy.addNoteAPI('company', addNoteAPI, userData).then((response) => {
        const noteId = response.body

        cy.reload()
        cy.wait(3000)
        cy.navigateToTab('notes')
        cy.deleteNote(addNoteAPI.noteContent, noteId)
      })
    })
  })

  describe('company tasks', () => {
    let companyID
    let globalCompanyID
    const companyName = `New Company Name ${stringGen(4)}${numGen(4)}`

    before(() => {
      const companyData = {
        companyName,
        subscriberId,
        userId: salesRepUserId,
        globalUserId: salesRepGlobalUserId
      }
      cy.addCompanyAPI(companyData).then((response) => {
        companyID = response.body.CompanyId
        globalCompanyID = response.body.GlobalCompanyId
      })
    })
    beforeEach(() => {
      cy.navigateAndCheckURL(COMPANY_DETAIL_URL(companyID))
    })

    after(() => {
      cy.deleteCompanyAPI(companyID, salesRepGlobalUserId, subscriberId)
    })

    describe('task validation', () => {
      beforeEach(() => {
        cy.navigateToTab('tasks')
      })

      it('no tasks displays meaningful message', () => {
        cy.noTasks()
      })

      it('unable to proceed if used has not inputted data into task name, description and due date', () => {
        cy.validationTaskTester()
      })
    })

    describe('task functionality', () => {
      let newTaskID

      it('Add new task', () => {
        let newTask = {
          taskTitle: `T${stringGen(5)}`,
          taskDescription: 'Test Task Description',
          taskDueDate: new Date().toDateString(),
        }

        cy.navigateToTab('tasks')
        cy.addTask(newTask, newTask.taskTitle)
        cy.get('.row-wrapper')
          .invoke('attr', 'data-activityid')
          .then((taskid) => {
            newTaskID = taskid
            cy.deleteTaskAPI(newTaskID, salesRepGlobalUserId, subscriberId)
          })
      })

      it('edit task', () => {
        cy.intercept({
          url: '/api/task/SaveTask',
          method: 'POST',
        }).as('saveTask')

        const taskData = {
          subscriberId,
          globalUserId: salesRepGlobalUserId,
          taskName: `TASK_${numGen(6)}`,
          taskDescription: 'EDIT TASK',
          dueDate: moment().format('MM/DD/YYYY'),
          globalCompanyID: globalCompanyID
        }

        cy.addTaskAPIUsers(taskData).then((response) => {
          cy.intercept({
            url: `/api/Task/GetTask?taskId=${response.body}&subscriberId=${subscriberId}`,
            method: 'GET',
          }).as('editWait')
          const taskID = response.body

          let newChangeTask = {
            taskTitle: 'Edited task123',
          }

          cy.navigateToTab('tasks')
          cy.get(`div[data-activityid="${taskID}"]`).contains(taskData.taskName)
          cy.get(`div[data-activityid="${taskID}"] .fa.fa-edit`).click()
          cy.wait('@editWait')

          // Change Titleprimary-btn btnSaveTask
          cy.fillForm(taskForm, newChangeTask)
          cy.get('#TaskAddEdit_btnTaskAdd').click()
          cy.wait('@saveTask')

          cy.get(`div[data-activityid="${taskID}"]`).contains(newChangeTask.taskTitle)

          cy.deleteTaskAPI(taskID, salesRepGlobalUserId, subscriberId)
        })
      })

      it('Delete task', () => {
        const taskNameDelete = 'Task name for edit'

        cy.request({
          method: 'POST',
          url: '/api/task/SaveTask',
          body: {
            'Task': {
              'SubscriberId': subscriberId,
              'OwnerUserIdGlobal': salesRepGlobalUserId,
              'TaskName': taskNameDelete,
              'Description': 'Description',
              'DueDate': moment().format('DD-MMM-YY'),
              'DealIds': null,
              'UpdateUserIdGlobal': salesRepGlobalUserId,
              'CompanyIdGlobal': globalCompanyID,
              'UserIdGlobal': salesRepGlobalUserId,
            },
          },
        }).then((response) => {
          cy.navigateToTab('tasks')
          cy.deleteTask(response.body)
        })
      })
    })
  })

  describe('companyList - pagination', () => {

    it('should show a meaningful user message with no companies added', () => {
      cy.intercept('/api/Company/GetCompaniesGlobal', { fixture: 'companies/noCompanies.json' })

      cy.navigateAndCheckURL(COMPANY_LIST_URL)

      const noItemsContainer = '.data-grid-overlay.data-grid-overlay-noItems'

      cy.get(`${noItemsContainer}`)
        .contains('No Companies')

      cy.get(`${noItemsContainer} button.primary-btn`)
        .should('be.visible')
        .contains('Add Company')
    })
  })
})
