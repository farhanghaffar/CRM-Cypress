/// <reference types="Cypress" />

import moment from 'moment'
import 'moment-timezone'
import {
  dealForm,
  eventForm,
  taskForm,
  noteForm,
  documentForm,
  contactForm,
} from '../../forms'

import {
  DEAL_LIST_URL,
  DEAL_ADD_URL,
  DEAL_EDIT_URL,
  DEAL_DETAIL_URL,
  CONTACT_EDIT_URL,
  COMPANY_LIST_URL,
  COMPANY_ADD_URL,
  COMPANY_EDIT_URL,
  COMPANY_DETAIL_URL,
  USER_EDIT_LIST,
} from '../../urls'
import { stringGen, numGen, convertFirstCharOfStringToUpperCase, listSpecificDataTypes } from '../../support/helpers'
const users = Cypress.env('users')
const subscriberId = Cypress.env('subscriberId')

context('dealer tab', () => {
  const todaysDate = moment()
  const salesRepGlobalUserId = users['salesRep'].globalUserId
  const salesRepUserId = users['salesRep'].userId
  const salesRepName = users['salesRep'].details.name
  const userData = {
    subscriberId: subscriberId,
    userId: salesRepUserId,
    globalUserId: salesRepGlobalUserId
  }

  const companyName = `AA New Test Company ${stringGen(6)}`
  const newContactName = `AAA${stringGen(5)}${numGen(4)}`
  const dealName = `test Deal ${stringGen(5)}`

  let newContact = {
    firstName: 'AAAA TEST first name',
    lastName: 'test last name',
    email: 'aaaa_test@mail.com',
    jobTitle: 'test job title',
    language: 'test language',
    birthday: '05 Nov, 2019',
    address: '1350 Abbot Kinney Boulevard',
    city: 'Venice',
    state: 'CA',
    postalCode: '90291',
    country: 'United States',
    businessPhone: '312-227-9283',
    mobilePhone: '312-227-9283',
    interests: 'test interest',
    notes: 'test notes',
    isEmail: true,
    isCall: false,
    isMarried: true,
    isHolidayCard: true,
    isHasChildren: true,
    isFormerEmployee: true,
  }

  let newCompanyId
  let dealContactId
  let globalCompanyID

  before(() => {
    cy.APILogin('salesRep')

    const companyData = {
      companyName,
      subscriberId,
      userId: salesRepUserId,
      globalUserId: salesRepGlobalUserId
    }
    cy.addCompanyAPI(companyData).then((response) => {
      newCompanyId = response.body.CompanyId
      globalCompanyID = response.body.GlobalCompanyId
      cy.navigateAndCheckURL(COMPANY_DETAIL_URL(response.body.CompanyId))
    })

    cy.addContactWithCompanyIDAPI(globalCompanyID, newContactName, userData).then((response) => {
      cy.log(`new company id ${newCompanyId}`)
      dealContactId = response.body.Contact.GlobalContactId
    })
  })

  after(() => {
    cy.deleteCompanyAPI(newCompanyId, salesRepGlobalUserId, subscriberId)
    cy.removeContactAPI(dealContactId, userData)
  })

  describe('deals', () => {
    const newContactNameForDeal = `new contact ${stringGen(4)}`

    let newDeal = {
      dealName,
      dealType: 'Maintenance',
      dealOwner: salesRepName,
      dealContact: newContactNameForDeal,
      dealContactSearch: 'A',
      dealIncoterms: 'CFR',
      dealCompetitor: 'Yusen',
      dealCommodities: 'Textiles',
      dealCompany: companyName,
      dealCompanySearch: companyName,
      dealProposalDate: todaysDate.format('DD-MMM-YY'),
      dealDecisionDate: todaysDate.add(5, 'days').format('DD-MMM-YY'),
      dealFirstshipmentDate: todaysDate.add(1, 'months').format('DD-MMM-YY'),
      dealContractEndDate: todaysDate.add(5, 'months').format('DD-MMM-YY'),
      dealIndustry: 'Automotive',
      dealCampaign: 'Campaign 001',
      dealComment: 'Comment',
    }

    let contactId

    before(() => {
      cy.addContactWithCompanyIDAPI(globalCompanyID, newContactNameForDeal, userData).then((response) => {
        contactId = response.body.Contact.GlobalContactId
      })
    })

    after(() => {
      cy.removeContactAPI(contactId, userData)
    })

    it('should add deal', () => {
      cy.navigateAndCheckURL(DEAL_ADD_URL)
      cy.newDeal('add', dealForm, newDeal, convertFirstCharOfStringToUpperCase(dealName), 'qualifying', userData)
    })

    it('should list deals', () => {
      cy.navigateAndCheckURL(DEAL_LIST_URL)

      const qualifyingNamesArray = listSpecificDataTypes(['Qualifying'], 'names', userData)
      const negotionationNamesArray = listSpecificDataTypes(['Negotiation'], 'names', userData)
      const trialShopmentNamesArray = listSpecificDataTypes(['Trial Shipment'], 'names', userData)
      const finalNegotiationNamesArray = listSpecificDataTypes(['Final Negotiation'], 'names', userData)

      cy.wait(2000)

      cy.get('[data-stage="Qualifying"]').find('.card-header-count').invoke('text').then((count) => {
        if (count == 0) {
          cy.get('[data-stage="Qualifying"] .no-deal p').contains('No active Deals')
        } else {
          cy.get('[data-stage="Qualifying"] a.hover-link')
            .each(($el, index) => {
              console.log(qualifyingNamesArray)
              cy.wrap($el).contains(qualifyingNamesArray[index])
            })
        }
      })

      cy.get('[data-stage="Negotiation"]').find('.card-header-count').invoke('text').then((count) => {
        if (count == 0) {
          cy.get('[data-stage="Negotiation"] .no-deal p').contains('No active Deals')
        } else {
          cy.get('[data-stage="Negotiation"] a.hover-link')
            .each(($el, index) => {
              cy.wrap($el).contains(negotionationNamesArray[index])
            })
        }
      })

      cy.get('[data-stage="Trial Shipment"]').find('.card-header-count').invoke('text').then((count) => {
        if (count == 0) {
          cy.get('[data-stage="Trial Shipment"] .no-deal p').contains('No active Deals')
        } else {
          cy.get('[data-stage="Trial Shipment"] a.hover-link')
            .each(($el, index) => {
              cy.wrap($el).contains(trialShopmentNamesArray[index])
            })
        }
      })

      cy.get('[data-stage="Final Negotiation"]').find('.card-header-count').invoke('text').then((count) => {
        if (count == 0) {
          cy.get('[data-stage="Final Negotiation"] .no-deal p').contains('No active Deals')
        } else {
          cy.get('[data-stage="Final Negotiation"] a.hover-link')
            .each(($el, index) => {
              cy.wrap($el).contains(finalNegotiationNamesArray[index])
            })
        }
      })
    })

    it('should search deals and find one result', () => {
      cy.listDealData(['qualifying'], userData).then((response) => {
        const searchTerm = response.body.Deals[0].DealName

        cy.navigateAndCheckURL(DEAL_LIST_URL)
        cy.get('a[data-view="list"]').click()
        cy.searchResults(searchTerm)
        cy.get('#btnSearch').click()
        cy.get('#deal-datatable .hover-link').should('have.text', searchTerm)
        cy.get('#deal-datatable').find('td').first().find('a').should('have.html', searchTerm)
      })
    })

    it('should search deals and find no results', () => {
      cy.navigateAndCheckURL(DEAL_LIST_URL)
      cy.get('a[data-view="list"]').click()
      const searchTerm = 'rhrhhfhfhjhj'

      cy.searchResults(searchTerm)
      cy.get('#deal-datatable').find('tr').should('have.length', 1)
    })

    describe('deal validation', () => {

      it('the new deal form has the correct validation messages', () => {
        cy.navigateAndCheckURL(DEAL_ADD_URL)
        cy.wait(2000)
        cy.get('#btnSave').click({ force: true })

        // validation checks
        const validationChecker = (fieldType, fieldName) => {
          const validationMessage = 'Required';
          const errorBorderTextBox = (fieldName) => `.error[id="${fieldName}"]`
          const errorBorderDropdown = (fieldName) => `.error-border[aria-labelledby="select2-${fieldName}-container"]`
          const errorTextSelector = (fieldName) => `.error-text > #${fieldName}-error`

          if (fieldType == 'textbox') {
            cy.get(errorBorderTextBox(fieldName))
              .should('have.css', 'border-color')
              .and('eq', 'rgb(205, 43, 30)')
          } else if(fieldType == 'dropdown') {
            cy.get(errorBorderDropdown(fieldName))
              .should('have.css', 'border-color')
              .and('eq', 'rgb(205, 43, 30)')
          }

          cy.get(errorTextSelector(fieldName)).should('have.text', validationMessage)

        }

        cy.get('.form-group:nth-child(1) .select2-selection.select2-selection--multiple.error-border')
          .should('have.css', 'border-color')
          .and('eq', 'rgb(205, 43, 30)')

        cy.get('.form-group:nth-child(2) .select2-selection.select2-selection--multiple.error-border')
          .should('have.css', 'border-color')
          .and('eq', 'rgb(205, 43, 30)')

        validationChecker('textbox', 'txtDealName')
        validationChecker('dropdown', 'ddlCompany')
        validationChecker('textbox', 'txtProposalDate')
        validationChecker('textbox', 'txtDecisionDate')
        validationChecker(undefined, 'ddlCompetitors')
        validationChecker(undefined, 'ddlCommodities')
        validationChecker('dropdown', 'ddlIndustry')
      })
    })
  })

  describe('deal list view', () => {
    let contactId
    const newContactName = `Contact name ${stringGen(5)}`
    let qualifyingDealId
    let negotiationDealId
    let trialShipmentDealId
    let finalNegotiationDealId
    let lostDealId
    let stalledDealId

    describe('validation', () => {

      before(() => {
        cy.navigateAndCheckURL(DEAL_LIST_URL)
      })

      it('no deals on list view shows meaningful message', () => {
        cy.intercept('/api/GlobalDeal/GetGlobalDeals', { fixture: 'deals/noDeals.json' })
        cy.navigateToListView('noData')
        cy.get('#divNoItems')
          .should('be.visible')

        cy.get('#divNoItems p.language-entry')
          .should('have.text', 'No Deals Found')

        cy.get('#divNoItems a.edit_link.btn-hover.new-deal')
          .contains('Add Deal')
      })
    })
    describe('navigating and selecting', () => {
      let dealData

      before(() => {
        cy.addContactWithCompanyIDAPI(globalCompanyID, newContactName, userData).then((response) => {
          contactId = response.body.Contact.GlobalContactId
        })
        const dealTypeSearchArray = ['qualifying', 'negotiation', 'trial shipment', 'final negotiation']

        cy.listDealData(dealTypeSearchArray, userData).then((response) => {
          dealData = response.body        
        })

        cy.navigateAndCheckURL(DEAL_LIST_URL)
      })

      after(() => {
        cy.removeContactAPI(contactId, userData)
      })

      it('opening list view will display list of deals', () => {
        cy.navigateToListView('data')

        const dealLength = dealData.Deals.length

        cy.get('#deal-datatable > tbody > tr')
          .should('have.length', dealLength)
      })

      it('select deal from list view', () => {
        const firstDealId = dealData.Deals[0].DealId
        const firstDealName = dealData.Deals[0].DealName
        const firstDealSalesStage = dealData.Deals[0].SalesStageName
        cy.scrollUntilNoNewList();
        cy.get(`#deal-datatable > tbody > tr[data-id="${firstDealId}"]`)
          .contains(firstDealName)
          .click({ force: true })

        cy.checkDealStageOnOverview(firstDealName, firstDealSalesStage.toLowerCase())
      })
    })

    describe('filtering list view', () => {
      const qualifyingDealName = `Qualifying Deal Name ${stringGen(5)}`
      const negotiationDealName = `Negotiation Deal Name ${stringGen(5)}`
      const trialShipmentDealName = `Trial Shipment Deal Name ${stringGen(5)}`
      const finalNegotiationDealName = `Final Negotiation Deal Name ${stringGen(5)}`
      const lostDealName = `Lost Deal Name ${stringGen(5)}`
      const stalledDealName = `Stalled Deal Name ${stringGen(5)}`

      before(() => {
        cy.addDeal(globalCompanyID, companyName, contactId, newContactName, qualifyingDealName, 'Qualifying', userData).then((response) => {
          qualifyingDealId = response.body
        })
        cy.addDeal(globalCompanyID, companyName, contactId, newContactName, negotiationDealName, 'Negotiation', userData).then((response) => {
          negotiationDealId = response.body
        })
        cy.addDeal(globalCompanyID, companyName, contactId, newContactName, trialShipmentDealName, 'Trial Shipment', userData).then((response) => {
          trialShipmentDealId = response.body
        })
        cy.addDeal(globalCompanyID, companyName, contactId, newContactName, finalNegotiationDealName, 'Final Negotiation', userData).then((response) => {
          finalNegotiationDealId = response.body
        })
        cy.addDeal(globalCompanyID, companyName, contactId, newContactName, lostDealName, 'Lost', userData).then((response) => {
          lostDealId = response.body
        })
        cy.addDeal(globalCompanyID, companyName, contactId, newContactName, stalledDealName, 'Stalled', userData).then((response) => {
          stalledDealId = response.body
        })

        cy.wait(5000)
        cy.navigateAndCheckURL(DEAL_LIST_URL)
        cy.navigateToListView('data')
        cy.wait(5000)
      })

      after(() => {
        cy.deleteDealAPI(qualifyingDealId, userData)
        cy.deleteDealAPI(negotiationDealId, userData)
        cy.deleteDealAPI(trialShipmentDealId, userData)
        cy.deleteDealAPI(finalNegotiationDealId, userData)
        cy.deleteDealAPI(lostDealId, userData)
        cy.deleteDealAPI(stalledDealId, userData)
      })

      it('Filter inactive deals', () => {
        const filterData = {
          desiredFilter: 'inactive',
          newFilterWording: 'Inactive',
          newFilterClassName: 'inactive',
        }

        cy.toggleListViewFilter(filterData)

        const testArray = ['lost', 'stalled']
        const inactiveDealNames = listSpecificDataTypes(testArray, 'names', userData)
        const inactiveDealIds = listSpecificDataTypes(testArray, 'id', userData)
        const inactiveSalesTypes = listSpecificDataTypes(testArray, 'dealTypes', userData)
        
        const listViewData = {
          idsArray: inactiveDealIds,
          nameArray: inactiveDealNames,
          salesStageArray: inactiveSalesTypes,
          arrayToInclude: ['Lost', 'Stalled'],
          arrayToExclude: ['Qualifying', 'Negotiation', 'Final Negotiation', 'Trial Shipment'],
        }
        cy.listViewDeals(listViewData)
      })

      it('Filter qualifying deals', () => {
        const filterData = {
          desiredFilter: 'Qualifying',
          newFilterWording: 'Qualifying',
          newFilterClassName: 'qualifying',
        }

        cy.toggleListViewFilter(filterData)

        const testArray = ['qualifying']
        const inactiveDealNames = listSpecificDataTypes(testArray, 'names', userData)
        const inactiveDealIds = listSpecificDataTypes(testArray, 'id', userData)
        const inactiveSalesTypes = listSpecificDataTypes(testArray, 'dealTypes', userData)

        const listViewData = {
          idsArray: inactiveDealIds,
          nameArray: inactiveDealNames,
          salesStageArray: inactiveSalesTypes,
          arrayToInclude: ['Qualifying'],
          arrayToExclude: ['Negotiation', 'Final Negotiation', 'Trial Shipment', 'Won', 'Lost', 'Stalled'],
        }
        
        cy.listViewDeals(listViewData)
      })      

      it('Filter negotiation deals', () => {
        const filterData = {
          desiredFilter: 'Negotiation',
          newFilterWording: 'Negotiation',
          newFilterClassName: 'negotiation',
        }

        cy.toggleListViewFilter(filterData)

        const testArray = ['negotiation']
        const inactiveDealNames = listSpecificDataTypes(testArray, 'names', userData)
        const inactiveDealIds = listSpecificDataTypes(testArray, 'id', userData)
        const inactiveSalesTypes = listSpecificDataTypes(testArray, 'dealTypes', userData)

        const listViewData = {
          idsArray: inactiveDealIds,
          nameArray: inactiveDealNames,
          salesStageArray: inactiveSalesTypes,
          arrayToInclude: ['Negotiation'],
          arrayToExclude: ['Qualifying', 'Final Negotiation', 'Trial Shipment', 'Won', 'Lost', 'Stalled'],
        }

        cy.listViewDeals(listViewData)
      })

      it('Filter trial shipment deals', () => {
        const filterData = {
          desiredFilter: 'Trial Shipment',
          newFilterWording: 'Trial Shipment',
          newFilterClassName: 'trialshipment',
        }

        cy.toggleListViewFilter(filterData)

        const testArray = ['trial shipment']
        const inactiveDealNames = listSpecificDataTypes(testArray, 'names', userData)
        const inactiveDealIds = listSpecificDataTypes(testArray, 'id', userData)
        const inactiveSalesTypes = listSpecificDataTypes(testArray, 'dealTypes', userData)

        const listViewData = {
          idsArray: inactiveDealIds,
          nameArray: inactiveDealNames,
          salesStageArray: inactiveSalesTypes,
          arrayToInclude: ['Trial Shipment'],
          arrayToExclude: ['Qualifying', 'Negotiation', 'Final Negotiation', 'Won', 'Lost', 'Stalled'],
        }

        cy.listViewDeals(listViewData)
      })

      it('Filter final negotiation deals', () => {
        const filterData = {
          desiredFilter: 'Final Negotiation',
          newFilterWording: 'Final Negotiation',
          newFilterClassName: 'finalnegotiation',
        }

        cy.toggleListViewFilter(filterData)

        const testArray = ['final negotiation']
        const inactiveDealNames = listSpecificDataTypes(testArray, 'names', userData)
        const inactiveDealIds = listSpecificDataTypes(testArray, 'id', userData)
        const inactiveSalesTypes = listSpecificDataTypes(testArray, 'dealTypes', userData)

        const listViewData = {
          idsArray: inactiveDealIds,
          nameArray: inactiveDealNames,
          salesStageArray: inactiveSalesTypes,
          arrayToInclude: ['Final Negotiation'],
          arrayToExclude: ['Qualifying', 'Negotiation', 'Trial Shipment', 'Won', 'Lost', 'Stalled'],
        }

        cy.listViewDeals(listViewData)
      })

      it('Filter won deals', () => {
        const filterData = {
          desiredFilter: 'won',
          newFilterWording: 'Won',
          newFilterClassName: 'won',
        }

        cy.toggleListViewFilter(filterData)

        const testArray = ['won']
        const inactiveDealNames = listSpecificDataTypes(testArray, 'names', userData)
        const inactiveDealIds = listSpecificDataTypes(testArray, 'id', userData)
        const inactiveSalesTypes = listSpecificDataTypes(testArray, 'dealTypes', userData)

        const listViewData = {
          idsArray: inactiveDealIds,
          nameArray: inactiveDealNames,
          salesStageArray: inactiveSalesTypes,
          arrayToInclude: ['Won'],
          arrayToExclude: ['Qualifying', 'Negotiation', 'Trial Shipment', 'Final Negotiation', 'Lost', 'Stalled'],
        }

        cy.listViewDeals(listViewData)
      })

      it('Filter lost deals', () => {
        const filterData = {
          desiredFilter: 'lost',
          newFilterWording: 'Lost',
          newFilterClassName: 'lost',
        }

        cy.toggleListViewFilter(filterData)

        const testArray = ['lost']
        const inactiveDealNames = listSpecificDataTypes(testArray, 'names', userData)
        const inactiveDealIds = listSpecificDataTypes(testArray, 'id', userData)
        const inactiveSalesTypes = listSpecificDataTypes(testArray, 'dealTypes', userData)

        const listViewData = {
          idsArray: inactiveDealIds,
          nameArray: inactiveDealNames,
          salesStageArray: inactiveSalesTypes,
          arrayToInclude: ['Lost'],
          arrayToExclude: ['Qualifying', 'Negotiation', 'Trial Shipment', 'Final Negotiation', 'Won', 'Stalled'],
        }

        cy.listViewDeals(listViewData)
      })

      it('Filter stalled deals', () => {
        const filterData = {
          desiredFilter: 'stalled',
          newFilterWording: 'Stalled',
          newFilterClassName: 'stalled',
        }

        cy.toggleListViewFilter(filterData)

        const testArray = ['stalled']
        const inactiveDealNames = listSpecificDataTypes(testArray, 'names', userData)
        const inactiveDealIds = listSpecificDataTypes(testArray, 'id', userData)
        const inactiveSalesTypes = listSpecificDataTypes(testArray, 'dealTypes', userData)

        const listViewData = {
          idsArray: inactiveDealIds,
          nameArray: inactiveDealNames,
          salesStageArray: inactiveSalesTypes,
          arrayToInclude: ['Stalled'],
          arrayToExclude: ['Qualifying', 'Negotiation', 'Trial Shipment', 'Final Negotiation', 'Won', 'Lost'],
        }

        cy.listViewDeals(listViewData)
      })

      it('Filter all deals', () => {
        const filterData = {
          desiredFilter: 'all',
          newFilterWording: 'All',
          newFilterClassName: 'all',
        }

        cy.toggleListViewFilter(filterData)

        const testArray = ['qualifying', 'negotiation', 'trial shipment', 'final negotiation', 'won', 'lost', 'stalled']
        const inactiveDealNames = listSpecificDataTypes(testArray, 'names', userData)
        const inactiveDealIds = listSpecificDataTypes(testArray, 'id', userData)
        const inactiveSalesTypes = listSpecificDataTypes(testArray, 'dealTypes', userData)

        const listViewData = {
          idsArray: inactiveDealIds,
          nameArray: inactiveDealNames,
          salesStageArray: inactiveSalesTypes,
          arrayToInclude: ['Qualifying', 'Negotiation', 'Trial Shipment', 'Final Negotiation', 'Stalled', 'Lost'],
          arrayToExclude: [' '],
        }

        cy.listViewDeals(listViewData)
      })
    })
  })

  describe('won, lost and stalled deals', () => {
    describe('edit', () => {
      const newContactName = `Contact name ${stringGen(5)}`
      const dealName = `Deal name edit deal stage ${stringGen(5)}`
      let contactId
      let dealID

      before(() => {
        cy.addContactWithCompanyIDAPI(globalCompanyID, newContactName, userData).then((response) => {
          contactId = response.body.Contact.GlobalContactId
        })
      })

      beforeEach(() => {
        cy.addDeal(globalCompanyID, companyName, contactId, newContactName, dealName, 'Qualifying', userData).then((response) => {
          dealID = response.body
        })
      })

      afterEach(() => {
        cy.deleteDealAPI(dealID, userData)
      })

      after(() => {
        cy.removeContactAPI(contactId, userData)
      })

      it('Edit deal and change deal status to Won and select a reason', () => {
        const dealForm = {
          wonLostReason: {
            id: 'ddlWonLostReason',
            type: 'select',
            option: { force: true },
          },
        }

        const newDeal = {
          wonLostReason: 'Relationship',
        }

        cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealID))
        cy.checkDealStageOnOverview(dealName, 'qualifying')
        cy.editDeal()
        cy.selectSalesStage('Won')
        cy.newDeal('edit', dealForm, newDeal, dealName, 'won', userData)
      })

      it('Edit deal and change deal status to Lost and select a reason', () => {
        const dealForm = {
          wonLostReason: {
            id: 'ddlWonLostReason',
            type: 'select',
            option: { force: true },
          },
        }
        const newDeal = {
          wonLostReason: 'Competition',
        }

        cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealID))
        cy.checkDealStageOnOverview(dealName, 'qualifying')
        cy.editDeal()
        cy.selectSalesStage('Lost')
        cy.newDeal('edit', dealForm, newDeal, dealName, 'lost', userData)
      })

      it('Edit deal and change deal status to Stalled', () => {
        const dealForm = {
          wonLostReason: {
            id: 'ddlWonLostReason',
            type: 'select',
            option: { force: true },
          },
        }
        const newDeal = {
          dealComment: 'test',
        }

        cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealID))
        cy.checkDealStageOnOverview(dealName, 'qualifying')
        cy.editDeal()
        cy.selectSalesStage('Stalled')
        cy.newDeal('edit', dealForm, newDeal, dealName, 'stalled', userData)
      })
    })

    describe('won and lost reason dropdown', () => {
      it('won reason dropdowns displays correct values', () => {

      })

      it('lost reason dropdown displays correct values', () => {

      })
    })
  })

  describe('deal widgets without data', () => {
    let dealID
    let companyID
    let contactID
    const companyName = `Deal Events Company ${stringGen(5)}`
    const newContactName = `New Contact ${numGen(4)}`
    const newDealName = `New Deal For Events ${stringGen(6)}`

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

      cy.addContactWithCompanyIDAPI(globalCompanyID, newContactName, userData).then((response) => {
        contactID = response.body.Contact.GlobalContactId
      })

      cy.addDeal(globalCompanyID, companyName, contactID, newContactName, newDealName, 'Qualifying', userData).then((response) => {
        dealID = response.body
      })
    })

    after(() => {
      cy.deleteCompanyAPI(companyID, salesRepGlobalUserId, subscriberId)
      cy.deleteDealAPI(dealID, userData)
      cy.removeContactAPI(contactID, userData)
    })

    describe('last activity and next widgets do not display with no event or task', () => {
      before(() => {
        cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealID))
      })

      it('Last Activity doesn\'t display with no event or task', () => {
        cy.noWidgetVisible('lastActivity')
      })

      it('Next widget doesn\'t display with no event or task', () => {
        cy.noWidgetVisible('next')
      })
    })
  })

  describe('deal widgets with data', () => {
    let widgetDealId
    let widgetCompanyId
    let contactID
    let widgetGlobalCompanyId
    const companyNameWidgets = `Deal Events Company ${stringGen(5)}`
    const newContactNameWidget = `New Contact ${numGen(4)}`
    const newDealName = `New Deal For Events ${stringGen(6)}`

    before(() => {
      const companyData = {
        companyName: companyNameWidgets,
        subscriberId,
        userId: salesRepUserId,
        globalUserId: salesRepGlobalUserId
      }
      cy.addCompanyAPI(companyData).then((response) => {
        widgetCompanyId = response.body.CompanyId
        widgetGlobalCompanyId = response.body.GlobalCompanyId

        console.log(widgetCompanyId)
        console.log(widgetGlobalCompanyId)

        cy.addContactWithCompanyIDAPI(widgetGlobalCompanyId, newContactNameWidget, userData).then((response) => {
          contactID = response.body.Contact.GlobalContactId
        })

        cy.addDeal(widgetGlobalCompanyId, companyNameWidgets, contactID, newContactNameWidget, newDealName, 'Qualifying', userData).then((response) => {
          widgetDealId = response.body
        })
      })
    })

    after(() => {
      cy.deleteCompanyAPI(widgetCompanyId, salesRepGlobalUserId, subscriberId)
      cy.deleteDealAPI(widgetDealId, userData)
      cy.removeContactAPI(contactID, userData)
    })

    describe('widget functionality', () => {

      beforeEach(() => {
        cy.navigateAndCheckURL(DEAL_DETAIL_URL(widgetDealId))
      })

      it('Selecting company from company widget takes user to correct company', () => {
        cy.intercept({
          url: `/api/GlobalDeal/GetGlobalDeals`,
          method: 'POST',
        }).as('getCompany')
        cy.get('#lblCompanyName')
          .should('have.text', companyNameWidgets)
          .click()
        cy.wait('@getCompany')
        cy.get('.page-title #lblCompanyName')
          .should('have.text', companyNameWidgets)
      })

      // can no longer see contact
      it.skip('Selecting contact from contact widget takes user to correct contact', () => {
        cy.intercept({
          url: `/api/Contact/GetContact?contactId=${widgetDealId}&subscriberId=${subscriberId}`,
          method: 'GET',
        }).as('getContact')
        cy.get('#lblPrimaryContactName')
          .should('have.text', newContactName)
          .click()
        cy.wait('@getContact')
        cy.get('.page-title #lblContactName')
          .should('have.text', newContactName)
      })
    })

    describe('next and last actitivty with event', () => {
      const eventTitle = `Event - ${numGen(5)}`
      const todaysDate = moment()
      let newEventId

      before(() => {
        const newEventData = {
          subscriberId: subscriberId,
          globalUserId: salesRepGlobalUserId,
          id: salesRepUserId,
          userName: salesRepName,
          name: eventTitle,
          description: `<p><br></p>`,
          isAllDay: false,
          location: 'Manchester',
          isRecurring: false,
          startTime: `${todaysDate.add(5, 'days').format('YYYY-MM-DD')} 15:00`,
          endTime: `${todaysDate.format('YYYY-MM-DD')} 16:00`,
          dealId: widgetDealId,
        }

        cy.addEventWithAllData(widgetGlobalCompanyId, newEventData).then((response) => {
          newEventId = response.body
        })

        cy.navigateAndCheckURL(DEAL_DETAIL_URL(widgetDealId))
      })

      after(() => {
        cy.removeEventAPI(newEventId, false, userData)
      })

      it('Deal next widget with data - event', () => {
        const eventData = {
          name: eventTitle,
          date: `${moment().add(5, 'days').format('ddd, DD-MMM-YY')} 15:00`,
          time: '15:00 - 16:00 Pacific Time',
          location: 'Manchester',
          type: 'Meeting',
        }

        const { name, date, time, location, type } = eventData

        cy.checkNextWidgetData('event', 'EVENT', name, date, time, location, type)
      })

      it('Deal last activity widget - event', () => {
        const todaysDate = moment()
        const eventData = {
          activity: 'EVENT',
          eventName: eventTitle,
          added: `${todaysDate.format('DD-MMM-YY')}`,
          addedBy: `${salesRepName}`,
        }

        const { activity, eventName, added, addedBy } = eventData

        cy.checkActivityWidget(activity, eventName, added, addedBy)
      })
    })

    describe('next and last actitivty with task', () => {
      const newTaskName = `Task name for widget ${numGen(5)}`
      const todaysDate = moment()
      let newTaskId

      before(() => {
        cy.request({
          method: 'POST',
          url: '/api/task/SaveTask',
          body: {
            'Task': {
              'ActivityId': null,
              'SubscriberId': subscriberId,
              'OwnerUserIdGlobal': salesRepGlobalUserId,
              'TaskName': newTaskName,
              'Description': 'Description123456789',
              'DueDate': todaysDate.add(2, 'days').format('DD-MMM-YY'),
              'DealIds': widgetDealId,
              'CompanyId': newCompanyId,
              'UpdateUserIdGlobal': salesRepGlobalUserId,
              'UserIdGlobal': salesRepGlobalUserId,
              'CompanyIdGlobal': widgetGlobalCompanyId,
            },
            'Invites': [{ 'AttendeeType': 'Required', 'ContactId': '', 'ContactName': '', 'SubscriberId': subscriberId, 'InviteType': 'contact' }],
          },
        }).then((response) => {
          newTaskId = response.body
        })

        cy.navigateAndCheckURL(DEAL_DETAIL_URL(widgetDealId))
      })

      after(() => {
        cy.deleteTaskAPI(newTaskId, salesRepGlobalUserId, subscriberId)
      })

      it('Contact next widget with data - task', () => {
        const todaysDate = moment()
        const taskData = {
          name: newTaskName,
          date: `${todaysDate.add(2, 'days').format('DD-MMM-YY')}`,
          time: '',
          location: '',
          type: '',
        }

        const { name, date, time, location, type } = taskData

        cy.checkNextWidgetData('task', 'TASK', name, date, time, location, type)
      })

      it('Contact last activity widget - task', () => {
        const todaysDate = moment()
        const eventData = {
          activity: 'TASK',
          eventName: newTaskName,
          added: `${todaysDate.format('DD-MMM-YY')}`,
          addedBy: `${salesRepName}`,
        }

        const { activity, eventName, added, addedBy } = eventData

        cy.checkActivityWidget(activity, eventName, added, addedBy)
      })
    })
  })

  describe('deal quotes', () => {
    let dealID
    const newDealName = `New Deal For Events ${stringGen(6)}`
    before(() => {
      const user = 'salesRep';
      cy.login(user)
      cy.get('#navSidebar_lblUserName')
        .should('have.text', users[user].details.name)

      cy.addDeal(globalCompanyID, companyName, dealContactId, newContactName, newDealName, 'Qualifying', userData).then((response) => {
        dealID = response.body
      })
    })

    after(() => {
      cy.deleteDealAPI(dealID, userData)
    })

    describe('validation', () => {
      context('quotes page', () => {

        beforeEach(() => {
          cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealID))
          cy.navigateToDealTab('quotes')
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
          cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealID))
          cy.navigateToDealTab('quotes')
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

        it('Company and deal locked on form', () => {
          cy.quotesFieldsReadOnly('deals', companyName, '', newDealName)
        })
      })
    })
  })

  describe('events', () => {
    let dealID
    let companyID
    let contactID
    let eventGlobalCompanyID
    const eventsCompanyName = `Deal Events Company ${stringGen(5)}`
    const newContactName = 'Test Contact'
    const newDealName = `New Deal For Events ${stringGen(6)}`

    before(() => {
      const companyData = {
        companyName,
        subscriberId,
        userId: salesRepUserId,
        globalUserId: salesRepGlobalUserId
      }
      cy.addCompanyAPI(companyData).then((response) => {
        companyID = response.body.CompanyId
        eventGlobalCompanyID = response.body.GlobalCompanyId
      })

      cy.addContactWithCompanyIDAPI(eventGlobalCompanyID, newContactName, userData).then((response) => {
        contactID = response.body.Contact.ContactId
      })

      cy.addDeal(globalCompanyID, companyName, contactID, newContactName, newDealName, 'Qualifying', userData).then((response) => {
        dealID = response.body
      })
    })

    after(() => {
      cy.deleteDealAPI(dealID, userData)
      cy.deleteCompanyAPI(companyID, salesRepGlobalUserId, subscriberId)
    })

    describe('event validation', () => {

      before(() => {
        cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealID))
        cy.navigateToDealTab('events')
      })

      it('No events on deal displays meaningful message', () => {
        cy.noEventsOnTab()
      })

      it('New event form pre-populates deal and company', () => {
        cy.selectAddEventHeader()
        cy.get('#select2-ddlCompany-container')
          .contains(companyName)

        cy.get(`ul.select2-selection__rendered > li.select2-selection__choice[title="${newDealName}"]`)
          .contains(newDealName)
      })
    })

    describe('deal event functionality', () => {
      const testEventName = `New Test Event ${stringGen(6)}`
      let newEvent = {

        eventTitle: testEventName,
        eventLocation: 'Los Angeles',
        eventStartDate: moment().format('DD-MMM-YY'),
        eventEndDate: moment().format('DD-MMM-YY'),
        eventStartTime: '4:00am',
        eventEndTime: '4:30am',
        eventReminder: '5 Minutes',
      }

      const { eventTitle } = newEvent

      it('should add deal events', () => {
        cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealID))
        cy.intercept({
          method: 'POST',
          url: '/api/CalendarEvent/SaveCalendarEvent',
        }).as('saveEvent')
        cy.navigateToDealTab('events')
        cy.addEventOnTab(newEvent, false)

        cy.wait('@saveEvent').then((xhr) => {
          const eventID = xhr.response.body

          cy.get(`[data-event-id="${eventID}"]`).should('be.visible')
          cy.get(`[data-event-id="${eventID}"] .hover-link`).contains(eventTitle)
          cy.removeEventAPI(eventID, false, userData)
        })
      })

      it('should list deal events', () => {
        const eventName = 'Event for Deal'
        const newEventData = {
          subscriberId: subscriberId,
          globalUserId: salesRepGlobalUserId,
          id: salesRepUserId,
          userName: salesRepName,
          name: eventName,
          description: `<p><br></p>`,
          isAllDay: false,
          location: 'Manchester',
          isRecurring: false,
          startTime: `${todaysDate.add(5, 'days').format('YYYY-MM-DD')} 15:00`,
          endTime: `${todaysDate.add(5, 'days').format('YYYY-MM-DD')} 16:00`,
          dealId: dealID
        }

        cy.addEventWithAllData(globalCompanyID, newEventData).then((response) => {
          cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealID))
          cy.get('a[href="#tab-calendar-events"]:first').click()
          cy.get(`[data-event-id="${response.body}"] .hover-link`).contains(eventName)
          cy.removeEventAPI(response.body, false, userData)
        })
      })

      it('should delete test deal events', () => {
        const eventName = 'Delete Event for Deal'
        const newEventData = {
          subscriberId: subscriberId,
          globalUserId: salesRepGlobalUserId,
          id: salesRepUserId,
          userName: salesRepName,
          name: eventName,
          description: `<p><br></p>`,
          isAllDay: false,
          location: 'Manchester',
          isRecurring: false,
          startTime: `${moment().format('YYYY-MM-DD')} 15:00`,
          endTime: `${moment().format('YYYY-MM-DD')} 16:00`,
          dealId: dealID,
        }

        cy.addEventWithAllData(globalCompanyID, newEventData).then((response) => {
          cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealID))
          cy.navigateToDealTab('events')
          cy.deleteEventOnTab(eventName, response.body)
          cy.wait(5000)
          cy.get('.swal2-cancel')
            .click()
        })
      })
    })
  })

  describe('tasks', () => {
    let globalContactID
    let dealId
    const newDealName = `New Deal ${stringGen(5)}`

    before(() => {
      cy.addDeal(globalCompanyID, companyName, dealContactId, newContactName, newDealName, 'Qualifying', userData).then((response) => {
        dealId = response.body
        cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
        cy.get('#main').find('#lblGlobalCompanyId').invoke('text').then((companyId) => {
          globalContactID = companyId
        })
      })
    })

    after(() => {
      cy.deleteDealAPI(dealId, userData)
    })

    const uniqueTaskTitle = `T${stringGen(6)}`
    let newTask = {
      taskTitle: uniqueTaskTitle,
      taskDescription: 'Test Task Description',
      taskDueDate: '12/30/2020',
    }

    describe('task validation', () => {
      before(() => {
        cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))

        // Click "Add" Task
        cy.navigateToDealTab('tasks')
      })

      it('no tasks displays meaningful message', () => {
        cy.noTasks()
      })

      it('unable to proceed if used has not inputted data into task name, description and due date', () => {
        cy.validationTaskTester()
      })
    })

    let newTaskID

    describe('task functionality', () => {

      it('should add deal tasks', () => {
        cy.intercept({
          method: 'POST',
          url: '/api/task/SaveTask',
        }).as('saveTask')
        cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))

        // Click "Add" Task
        cy.navigateToDealTab('tasks')
        cy.addTask(newTask, uniqueTaskTitle)
        cy.get('.row-wrapper')
          .invoke('attr', 'data-activityid')
          .then((taskid) => {
            newTaskID = taskid
            cy.deleteTaskAPI(newTaskID, salesRepGlobalUserId, subscriberId)
          })
      })

      it('should delete test deal tasks', () => {
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
              'DealIds': `${dealId}`,
              'UpdateUserIdGlobal': salesRepGlobalUserId,
              'CompanyIdGlobal': globalCompanyID,
              'UserIdGlobal': salesRepGlobalUserId,
            },
          },
        }).then((response) => {
          cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
          cy.navigateToDealTab('tasks')
          cy.deleteTask(response.body)
        })
      })

      it('should edit deal tasks', () => {
        cy.intercept({
          url: '/api/task/SaveTask',
          method: 'POST',
        }).as('saveTask')

        cy.request({
          method: 'POST',
          url: '/api/task/SaveTask',
          body: {
            'Task': {
              'ActivityId': null,
              'SubscriberId': subscriberId,
              'OwnerUserIdGlobal': salesRepGlobalUserId,
              'TaskName': 'Task name for edit',
              'Description': 'Description',
              'DueDate': '2020-03-31',
              'DealIds': dealId,
              'CompanyId': newCompanyId,
              'UpdateUserIdGlobal': salesRepGlobalUserId,
              'CompanyIdGlobal': globalContactID,
            },
            'Invites': [{ 'AttendeeType': 'contact', 'ContactId': null, 'ContactName': '', 'SubscriberId': subscriberId }],
          },
        }).then((response) => {
          cy.intercept({
            url: `/api/Task/GetTask?taskId=${response.body}&subscriberId=${subscriberId}`,
            method: 'GET',
          }).as('editWait')
          const taskID = response.body

          let newChangeTask = {
            taskTitle: 'Another New Test Task Title',
          }

          cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
          cy.navigateToDealTab('tasks')

          cy.get(`div[data-activityid="${taskID}"]`).contains('Task name for edit')
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
    })
  })

  describe('notes', () => {
    let dealId
    // let globalCompanyID;
    const newDealName = `New Deal ${stringGen(5)}`

    before(() => {
      cy.addDeal(globalCompanyID, companyName, dealContactId, newContactName, newDealName, 'Qualifying', userData).then((response) => {
        dealId = response.body
        cy.wait(3000)
        // cy.navigateAndCheckURL(DEAL_DETAIL_URL(response.body))
        // cy.get("#main").find('#lblGlobalCompanyId').invoke('text').then((companyId) => {
        //   globalCompanyID = companyId
        // })
      })
    })

    after(() => {
      cy.deleteDealAPI(dealId, userData)
    })

    beforeEach(() => {
      cy.intercept({
        method: 'GET',
        url: `/api/deal/GetDealSalesStageTimeline?subscriberId=${subscriberId}&dealId=${dealId}`,
      }).as('waitPageLoad')
      cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
      cy.wait('@waitPageLoad')
    })

    it('No notes shows meaningful message', () => {
      cy.navigateToDealTab('notes')
      cy.noNotesDisplaysCorrectly()
    })

    it('Note validation (no note)', () => {
      cy.navigateToDealTab('notes')
      cy.checkNoNoteValidation()
    })

    it('should add deal notes', () => {
      const newNoteName = `Test Note ${stringGen(7)}`
      let newNote = {
        note: newNoteName,
      }

      cy.navigateToDealTab('notes')
      cy.addNote(newNote, newNoteName, salesRepName, salesRepGlobalUserId)
    })

    it('should edit deal notes', () => {
      const addNoteAPI = {
        globalCompanyId: globalCompanyID,
        noteContent: `New Note For Edit ${stringGen(5)}`,
        contactId: 0,
        dealId,
      }

      cy.addNoteAPI('deal', addNoteAPI, userData).then((response) => {
        const noteId = response.body

        cy.reload()
        cy.wait('@waitPageLoad')
        cy.navigateToDealTab('notes')
        cy.editNote(addNoteAPI.noteContent, `New Edit Note ${numGen(5)}`, noteId, salesRepName, salesRepGlobalUserId)
      })
    })

    it('should delete test deal notes', () => {
      const addNoteAPI = {
        globalCompanyId: globalCompanyID,
        noteContent: `New Note For Delete ${stringGen(5)}`,
        contactId: 0,
        dealId,
      }

      cy.addNoteAPI('deal', addNoteAPI, userData).then((response) => {
        const noteId = response.body

        cy.reload()
        cy.wait('@waitPageLoad')
        cy.navigateToDealTab('notes')
        cy.wait(2000)
        cy.deleteNote(addNoteAPI.noteContent, noteId)
      })
    })

    it('add note on deal overview page', () => {
      cy.intercept({
        url: '/api/note/savenote',
        method: 'POST',
      }).as('saveNote')
      cy.intercept('/api/note/GetNotes').as('getNote')
      const noteText = stringGen(20)

      cy.get('#txtNote')
        .type(noteText)
      cy.get('#note-add > a')
        .click()
      cy.wait('@saveNote').then((xhr) => {
        cy.wait('@getNote')
        cy.get('#tab-notes')
          .should('be.visible')

        cy.get('[data-activityid] [data-col-id="createdDate"]')
          .should('have.text', moment().tz('America/Los_Angeles').format('ddd, DD MMM, YYYY'))

        cy.get('[data-activityid] [data-col-id="note"]')
          .should('have.text', noteText)

        cy.get('[data-activityid] [data-col-id="owner"]')
          .should('have.text', salesRepName)
      })
    })
  })


  describe('documents', () => {
    let dealId
    const newDealName = `New Deal ${stringGen(5)}`

    before(() => {
      cy.addDeal(globalCompanyID, companyName, dealContactId, newContactName, newDealName, 'Qualifying', userData).then((response) => {
        dealId = response.body
      })
    })

    after(() => {
      cy.deleteDealAPI(dealId, userData)
    })
    const docTitle = `Test Doc Title ${numGen(5)}`
    let newDocument = {
      docTitle,
      docDescription: 'Test doc Description',
    }

    describe('document validation', () => {
      before(() => {
        cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
        cy.navigateToDealTab('documents')
      })

      it('No documents message', () => {
        cy.noDocumentsValidation()
      })

      it('Document validation - Title', () => {
        cy.checkDocumentValidationMessage('title')
      })

      it('Document validation - document', () => {
        cy.checkDocumentValidationMessage('document')
      })

      it('Document validation - upload large image (over 10MB)', () => {
        cy.checkDocumentValidationMessage('largeFileType')
      })

      it('Document validation - Upload incorrect file type', () => {
        cy.checkDocumentValidationMessage('incorrectFileType')
      })
    })

    describe('document functionality', () => {
      it('should delete test deal documents', () => {
        // ADDING WITH API BREAKS DELETE?? NEEDS INVESTIGATING
        // cy.addDocumentAPI(dealId, userData)
        cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
        cy.addDocument('deal', globalCompanyID, '', dealId, newDocument, docTitle, newDocument.docDescription)
        cy.deleteDocument()
      })

      it('should add deal documents', () => {
        cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
        cy.addDocument('deal', globalCompanyID, '', dealId, newDocument, docTitle, newDocument.docDescription)
      })

      it('should successfully download document', () => {
        cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
        cy.addDocument('deal', globalCompanyID, '', dealId, newDocument, docTitle, newDocument.docDescription)
        cy.wait(2000)
        cy.get('#documentsWrapper [data-col-id="fileName"] .hover-link')
          .invoke('attr', 'href')
          .then((downloadLink) => {
            cy.log(downloadLink)
            cy.get(`a[href="${downloadLink}"]`).should('be.visible')
            cy.request({
              method: 'GET',
              url: downloadLink,
            }).then((response) => {
              expect(response.status).to.eq(200)
            })
          })
      })

      it('should list deal documents', () => {
        cy.intercept('/api/document/GetDocuments', { fixture: 'documents/documentData.js' })
        cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
        // click document tab
        cy.get('a[href="#tab-documents"]:first').click()

        // document title and description
        cy.get('#documentsWrapper .items-wrap .row-wrapper').should(($documents) => {
          expect($documents, '3 items').to.have.length(3)
          expect($documents.eq(0), 'first item').to.contain('Document 3 Title').to.contain('bird.jpg')
          expect($documents.eq(1), 'second item').to.contain('Document 2 Title').to.contain('penguin.jpg')
          expect($documents.eq(2), 'third item').to.contain('Document 1 Title').to.contain('sloth.jpg')
        })
      })
    })
  })

  describe('contacts', () => {
    let dealId
    let newContactName = `Contact ${stringGen(4)}`
    let newContactId
    const newDealName = `New Deal ${stringGen(5)}`    

    before(() => {
      cy.addDeal(globalCompanyID, companyName, dealContactId, newContactName, newDealName, 'Qualifying', userData).then((response) => {
        dealId = response.body
      })


      cy.addContactWithCompanyIDAPI(globalCompanyID, newContactName, userData).then((response) => {
        newContactId = response.body.Contact.ContactId
      })
    })

    after(() => {
      cy.deleteDealAPI(dealId, userData)
    })
    it('should add new contact - contact', () => {
      var contactFullName ="AAA "+newContactName
      cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
      cy.get('a[data-set="new_contact"]:first').click()
      cy.get('a[data-target="#addContactDialog"]')
        .first()
        .should('have.html', 'Add Contact')
        .click()
      
      cy.get('span').contains('Select Contact').click()
      cy.wait(5000)
      cy.get('li').contains(contactFullName).first().should('be.visible').click()
      cy.get('#btnAddContactSave').should('be.visible').click()
      cy.wait(5000)
      cy.get('a').contains(contactFullName).should('be.visible')
    })

    it('should edit the contact - contact', () => {
      const newContactNumber = `+590 277${numGen(3)}`
      
      cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
      cy.get('a[data-set="new_contact"]:first').click()
      cy.editContact(newContactName, newContactNumber);
      cy.get('.contact-card').contains(newContactNumber).should('be.visible')
    })

    it('should delete the contact - contact', () => {
      var contactFullName ="AAA "+newContactName

      cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
      cy.get('a[data-set="new_contact"]:first').click()
      cy.removeContact(newContactName)
      cy.get('.contact-card').should('not.include.text', contactFullName)     
    })
  })

  describe('sales team', () => {
    let dealId
    const newDealName = `New Deal ${stringGen(5)}`

    before(() => {
      cy.addDeal(globalCompanyID, companyName, dealContactId, newContactName, newDealName, 'Qualifying', userData).then((response) => {
        dealId = response.body
      })
    })

    after(() => {
      cy.deleteDealAPI(dealId, userData)
    })

    it('should add the sales team member - team', () => {
      const newSalesMember = users['locationManager']
      let newSearch = {
        salesTeamMember: newSalesMember.details.name,
        salesTeamMemberSearch: newSalesMember.details.name,
        salesRole: 'Country Leader',
      }

      cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
      cy.navigateToDealTab('salesTeam')

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
      cy.removeSalesTeamMember(newSalesMember.userId, newSalesMember.details.name)
    })

    it('should remove the sales team member - team', () => {
      const newSalesMember = users['locationManager']
      let newSearch = {
        salesTeamMember: newSalesMember.details.name,
        salesTeamMemberSearch: newSalesMember.details.name,
        salesRole: 'Country Leader',
      }

      cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
      cy.navigateToDealTab('salesTeam')

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
      cy.salesTeamChecker(newSalesMember.details.name, newSalesTeamMember.salesRole, newSalesMember.userId)
      cy.removeSalesTeamMember(newSalesMember.userId, newSalesMember.details.name)
    })

    it('should edit the sales team user role - team', () => {
      const newSalesRoleSelector = {
        salesRole: {
          id: 'AddSalesTeamMember_ddlSalesTeamRole',
          type: 'select',
          option: { force: true },
        },
      }

      let newSalesRole = {
        salesRole: 'Country Leader',
      }

      const newSalesMember = users['locationManager']
      let newSearch = {
        salesTeamMember: newSalesMember.details.name,
        salesTeamMemberSearch: newSalesMember.details.name,
        salesRole: 'Country Leader',
      }

      const editSalesMember = users['locationManager']
      let editSearch = {
        salesTeamMember: editSalesMember.details.name,
        salesTeamMemberSearch: editSalesMember.details.name,
        salesRole: 'Global Leader',
      }

      cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealId))
      cy.navigateToDealTab('salesTeam')

      const newSalesTeamMember = {
        salesName: newSearch.salesTeamMember,
        salesJobTitle: newSalesMember.details.jobTitle,
        salesLocation: newSalesMember.details.city,
        salesEmail: newSalesMember.details.email,
        salesAddress: newSalesMember.details.address,
        salesNumber: newSalesMember.details.number,
        userId: newSalesMember.details.userId,
        salesRole: newSearch.salesRole,
        editSalesRole: editSearch.salesRole,
      }
      cy.addSalesTeamMember('add', newSearch, newSalesMember.userId, newSalesTeamMember)
      cy.salesTeamChecker(newSalesMember.details.name, newSalesTeamMember.salesRole, newSalesMember.userId)
      cy.editSalesTeamMember('edit', editSearch, newSalesMember.userId, newSalesTeamMember)  
      cy.salesTeamChecker(newSalesMember.details.name, newSalesTeamMember.editSalesRole, newSalesMember.userId)
      cy.removeSalesTeamMember(newSalesMember.userId, newSalesMember.details.name)
    })
  })
})
