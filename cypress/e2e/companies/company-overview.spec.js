import moment from 'moment'
import { eventForm } from '../../forms'
import { COMPANY_LIST_URL, COMPANY_DETAIL_URL } from '../../urls'
import { stringGen, numGen, numberWithCommas } from '../../support/helpers'
const users = Cypress.env('users')
const subscriberId = Cypress.env('subscriberId')

context('company-companyOverview', () => {
  const salesRepGlobalUserId = users['salesRep'].globalUserId
  const salesRepUserId = users['salesRep'].userId
  const salesRepName = users['salesRep'].details.name
  const userData = {
    subscriberId: subscriberId,
    userId: salesRepUserId,
    globalUserId: salesRepGlobalUserId
  }

  before(() => {
    cy.APILogin('salesRep')
  })
  describe.skip('Panel view', () => {
    // FEATURE BEING CHANGED
    beforeEach(() => {
      cy.visit(COMPANY_LIST_URL)
      cy.navigateAndCheckPanelView()
    })
    it('should test the panel view listings', () => {
      cy.intercept('/api/Company/GetCompaniesGlobal', { fixture: 'fixture:companies/companyList.json' })
      cy.reload()

    })
  })


  const companyName = `${stringGen(8)} ${numGen(3)}`
  let companyId

  describe('Filters', () => {
    before(() => {
      const companyData = {
        companyName,
        subscriberId,
        userId: salesRepUserId,
        globalUserId: salesRepGlobalUserId
      }
      cy.addCompanyAPI(companyData).then((response) => {
        companyId = response.body.CompanyId
      })
    })

    after(() => {
      cy.deleteCompanyAPI(companyId, salesRepGlobalUserId, subscriberId)
    })

    beforeEach(() => {
      cy.visit(COMPANY_LIST_URL)
    })

    it('Search for company name', () => {
      cy.searchAndCheckCompanyName(companyName)
    })

    // it('Search for company country', () => {
    //     const companySearch = { country: 'United States' }
    //     cy.searchAndCheckCompanyCountry(companySearch.country)
    // })

    it('Search for company city', () => {
      const citySearch = 'San Pedro'

      cy.searchAndCheckCompanyCity(citySearch)
    })

    it('Search for company post code', () => {
      const postCodeSearch = stringGen(10)
      const companyName = `POST CODE ${stringGen(4)}${numGen(2)}`

      cy.request({
        method: 'POST',
        url: '/api/company/SaveCompany',
        body: {
          'Company': {
            'SubscriberId': subscriberId,
            'CompanyId': 987654,
            'CompanyName': `${companyName}`,
            'Address': 'Test123',
            'City': 'San Pedro',
            'Phone': '',
            'PostalCode': postCodeSearch,
            'CountryName': 'United States',
            'User': salesRepUserId,
            'CompanyTypes': 'Carrier',
            'Industry': 'Chemical',
            'Source': 'LinkedIn',
            'Fax': '',
            'Website': '',
            'CampaignName': '',
            'UpdateUserId': salesRepUserId,
            'Division': '',
            'CompanyCode': '',
            'StateProvince': '',
            'Active': false,
            'UpdateUserIdGlobal': salesRepGlobalUserId,
            'CompanyOwnerUserId': salesRepUserId,
            'IsCustomer': false,
            'Comments': '',
            'Competitors': "",
            'ParentCode': ''
          },
          'UpdatedUserIdGlobal': salesRepGlobalUserId
        },
      }).then((response) => {
        cy.wait(4000)
        cy.searchAndCheckCompanyPostcode(postCodeSearch, companyName)
        cy.deleteCompanyAPI(response.body.CompanyId, salesRepGlobalUserId, subscriberId)
      })
    })
  })
descrive
  describe('Widgets - no data', () => {
    before(() => {
      const companyData = {
        companyName,
        subscriberId,
        userId: salesRepUserId,
        globalUserId: salesRepGlobalUserId
      }
      cy.addCompanyAPI(companyData).then((response) => {
        companyId = response.body.CompanyId
        expect(response.status).to.eq(200)
        cy.visit(COMPANY_DETAIL_URL(companyId))
      })
      cy.wait(3000)
    })

    after(() => {
      cy.deleteCompanyAPI(companyId, salesRepGlobalUserId, subscriberId)
    })

    it('Last Activity doesn\'t display with no event or task', () => {
      cy.noWidgetVisible('lastActivity')
    })

    it('Next widget doesn\'t display with no event or task', () => {
      cy.noWidgetVisible('next')
    })

    it('Company info widget without data', () => {
      const companyData = {
        address: 'Test123',
        number: '',
        fax: '',
        website: '',
      }

      const { address, number, fax, website } = companyData

      cy.checkCompanyDetails('no data', address, number, fax, website)
    })

    it('No deals should show meaningful message', () => {
      cy.get('.overview-nodeals.empty-box .e-text')
        .should('have.text', 'no deals')
        .should('be.visible')
      cy.get('.overview-nodeals.empty-box .primary-btn[data-action="new-deal"]')
        .should('be.visible')
    })
  })

  describe('Widgets - data', () => {
    const widgetCompanyName = stringGen(8);
    let widgetGlobalCompanyId

    before(() => {
      const companyData = {
        companyName: widgetCompanyName,
        subscriberId,
        userId: salesRepUserId,
        globalUserId: salesRepGlobalUserId
      }
      cy.addCompanyAPI(companyData).then((response) => {
        companyId = response.body.CompanyId
        expect(response.status).to.eq(200)
        cy.visit(COMPANY_DETAIL_URL(companyId))
      })

      cy.get('#main').find('#lblGlobalCompanyId').invoke('text').then((newCompanyId) => {
        widgetGlobalCompanyId = newCompanyId
      })
    })

    after(() => {
      cy.deleteCompanyAPI(companyId, salesRepGlobalUserId, subscriberId)
    })

    it('Company info widget with data', () => {
      const companyData = {
        address: 'Test123',
        number: '+448976645231',
        fax: '0123456789',
        website: 'www.google.com',
      }

      const { address, number, fax, website } = companyData

      cy.checkCompanyDetails('data', address, number, fax, website)
    })

    describe('next and last actitivty with event', () => {
      const eventTitle = `Event - ${numGen(5)}`
      const todaysDate = moment()
      let newEventId
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
        dealId: '',
      }


      before(() => {
        console.log(newEventData)
        console.log(widgetGlobalCompanyId)
        cy.addEventWithAllData(widgetGlobalCompanyId, newEventData).then((response) => {
          newEventId = response.body
        })

        cy.navigateToTab('overview')
        cy.reload()
      })

      after(() => {
        cy.removeEventAPI(newEventId, false, userData)
      })

      it('Company next widget with data - event', () => {
        const todaysDate = moment()
        const eventData = {
          name: eventTitle,
          date: `${todaysDate.add(5, 'days').format('ddd, DD-MMM-YY')} 15:00`,
          time: '15:00 - 16:00 Pacific Time',
          location: 'Manchester',
          type: 'Meeting',
        }

        const { name, date, time, location, type } = eventData

        cy.checkNextWidgetData('event', 'EVENT', name, date, time, location, type)
      })

      it('Company last activity widget - event', () => {
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
              'DealIds': 0,
              'CompanyId': companyId,
              'UpdateUserIdGlobal': salesRepGlobalUserId,
              'UserIdGlobal': salesRepGlobalUserId,
              'CompanyIdGlobal': widgetGlobalCompanyId,
            },
            'Invites': [{ 'AttendeeType': 'Required', 'ContactId': '', 'ContactName': '', 'SubscriberId': subscriberId, 'InviteType': 'contact' }],
          },
        }).then((response) => {
          newTaskId = response.body
        })

        cy.navigateToTab('overview')
        cy.reload()
      })

      after(() => {
        // cy.deleteTaskAPI(newTaskId, salesRepGlobalUserId, subscriberId)
      })

      it('Company next widget with data - task', () => {
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

      it('Company last activity widget - task', () => {
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

    it('Deals and lanes should display correctly on company overview', () => {
      const dealRevenueResponse1 = {
        'Revenue': 356700.7726,
        'Profit': 30044849.6439,
        'SpotProfit': 0.0,
        'SpotRevenue': 0.0,
        'CurrencySymbol': '$',
      }

      const dealRevenueResponse2 = {
        'Revenue': 500.0,
        'Profit': 20.0,
        'SpotProfit': 0.0,
        'SpotRevenue': 0.0,
        'CurrencySymbol': '$',
      }

      cy.intercept(`/api/GlobalDeal/GetGlobalDeals`, { fixture: 'companies/companyDeals.json' })

      cy.intercept(`/api/deal/GetDealRevenueFromUserCurrency?dealId=400&userId=${salesRepUserId}&dealSubscriberId=${subscriberId}&userSubscriberId=${subscriberId}`, dealRevenueResponse1)

      cy.intercept(`/api/deal/GetDealRevenueFromUserCurrency?dealId=600&userId=${salesRepUserId}&dealSubscriberId=${subscriberId}&userSubscriberId=${subscriberId}`, dealRevenueResponse2)

      const dealOne = {
        dealId: 400,
        dealName: 'Clothing to US East',
        dealStatus: 'Negotiation',
        dealDecisionDate: '01-Mar-20',
        dealRevenue: '$ 356,700',
        dealProposalDate: '12-Apr-20',
        dealProfit: '$ 30,044,849',
      }

      const dealTwo = {
        dealId2: 500,
        dealName2: 'Deal to Spain',
        dealStatus2: 'Final Negotiation',
        dealDecisionDate2: '10-Aug-20',
        dealRevenue2: '$ 0',
        dealProposalDate2: '25-Dec-20',
        dealProfit2: '$ 0',
      }

      const dealThree = {
        dealId3: 600,
        dealName3: 'UK to USA East Coast Ocean FCL',
        dealStatus3: 'Qualifying',
        dealDecisionDate3: '29-Feb-20',
        dealRevenue3: '$ 500',
        dealProposalDate3: '14-Feb-20',
        dealProfit3: '$ 20',
      }

      const { dealId, dealName, dealStatus, dealDecisionDate, dealRevenue, dealProposalDate, dealProfit } = dealOne
      const { dealId2, dealName2, dealStatus2, dealDecisionDate2, dealRevenue2, dealProposalDate2, dealProfit2 } = dealTwo
      const { dealId3, dealName3, dealStatus3, dealDecisionDate3, dealRevenue3, dealProposalDate3, dealProfit3 } = dealThree

      cy.reload()
      cy.testIndividualDealOnCompany(dealId, dealName, dealStatus, dealDecisionDate, dealRevenue, dealProposalDate, dealProfit)
      cy.testIndividualDealOnCompany(dealId2, dealName2, dealStatus2, dealDecisionDate2, dealRevenue2, dealProposalDate2, dealProfit2)
      cy.testIndividualDealOnCompany(dealId3, dealName3, dealStatus3, dealDecisionDate3, dealRevenue3, dealProposalDate3, dealProfit3)
    })
  })
})
