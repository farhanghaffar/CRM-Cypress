/// <reference types="Cypress" />

import moment from 'moment'
import {
  dealForm,
  eventForm,
  taskForm,
  noteForm,
  documentForm,
  contactForm,
} from '../../forms'
import {
  DEAL_EDIT_URL,
  DEAL_DETAIL_URL,
  CONTACT_LIST_URL,
  CONTACT_ADD_URL,
  CONTACT_EDIT_URL,
  CONTACT_DETAIL_URL,
  COMPANY_DETAIL_URL,
  COMPANY_LIST_URL,
} from '../../urls'
import { stringGen, numGen } from '../../support/helpers'
const users = Cypress.env('users')
const subscriberId = Cypress.env('subscriberId')

context('contact-tab', () => {
  const salesRepGlobalUserId = users['salesRep'].globalUserId
  const salesRepUserId = users['salesRep'].userId
  const salesRepName = users['salesRep'].details.name
  const salesRepJobTitle = users['salesRep'].details.jobTitle
  const salesRepCity = users['salesRep'].details.city
  const salesRepCountry = users['salesRep'].details.country
  const salesRepEmail = users['salesRep'].details.email
  const salesRepnumber = users['salesRep'].details.number
  const userData = {
    subscriberId: subscriberId,
    userId: salesRepUserId,
    globalUserId: salesRepGlobalUserId
  }

  const companyName = `AA New Test Company ${stringGen(6)}`
  let newContact = {
    firstName: `Afn${stringGen(3)}`,
    lastName: `Ln${stringGen(6)}`,
    email: 'aaaa_test@mail.com',
    jobTitle: 'test job title',
    address: '1350 Abbot Kinney Boulevard',
    city: 'Venice',
    state: 'CA',
    postalCode: '90291',
    country: 'United States',
    businessPhone: '312-227-9283',
    mobilePhone: '312-227-9283',
    notes: 'test notes',
    isEmail: true,
    isCall: false,
    // isMarried: true,
    isHolidayCard: true,
    // isHasChildren: true,
    isFormerEmployee: true,
    company: `${companyName}`,
    companySearch: 'aa',
  }

  let newCompanyId
  let contactId
  let contactName
  let globalCompanyID

  before(() => {
    cy.APILogin('salesRep')
    cy.listContacts(userData).then((response) => {
      contactId = response.body.Contacts[0].ContactId
      contactName = response.body.Contacts[0].ContactName
    })
    const companyData = {
      companyName,
      subscriberId,
      userId: salesRepUserId,
      globalUserId: salesRepGlobalUserId
    }
    cy.addCompanyAPI(companyData).then((response) => {
      newCompanyId = response.body.CompanyId
      globalCompanyID = response.body.GlobalCompanyId
    })

    localStorage.setItem('language_code', 'en-US')
  })

  after(() => {
    cy.deleteCompanyAPI(newCompanyId, salesRepGlobalUserId, subscriberId)
  })

  describe('contacts', () => {

    it('should add contact', () => {
      cy.navigateAndCheckURL(CONTACT_LIST_URL)
      cy.get('#btnAddContact').click()

      // Fill the form
      const contactName = `${newContact.firstName} ${newContact.lastName}`
      cy.addContact(contactForm, newContact, contactName)
    })

    it('should list contacts', () => {
      cy.navigateAndCheckURL(CONTACT_LIST_URL)
      cy.get('div[data-col-id="name"]>div>div>a').last().scrollIntoView();
      cy.listContacts(userData).then((response) => {
        const body = response.body
        const contactData = {
          totalContacts: body.Records,
          contacts: body.Contacts,
        }

        //get company name list
        const { totalContacts, contacts } = contactData
        let contactNames = []
        cy.log(contacts.length)
        for (let i = 0; i < contacts.length; i++) {
          contactNames.push(contacts[i].ContactName)
        }
        cy.get('#totalRecords').should('have.text', `${totalContacts} records`)
        cy.get('div[data-col-id="name"]>div>div>a')
        .each(($el, index, $list) => { 
            cy.wrap($el).scrollIntoView().should('have.text', `${contactNames[index]}`)
          })
      })
    })

    it('should edit test contact', () => {
      const newContactName = `AAA${stringGen(5)}${numGen(4)}`

      cy.addContactWithCompanyIDAPI(globalCompanyID, newContactName, userData)
      cy.intercept({
        method: 'POST',
        url: '/api/contact/SaveContact',
      }).as('saveContact')
      cy.navigateAndCheckURL(CONTACT_LIST_URL)
      const newNumber = `+9${numGen(8)}`
      cy.editContacts(newContactName, newNumber);
      cy.get('#contactAddEdit_btnSave').click({ force: true })
      cy.wait('@saveContact').then((xhr) => {
        const newContactId = xhr.response.body.Contact.GlobalContactId
        cy.get('#lblBusinessPhone').should('be.visible').contains(newNumber)
      })
    })
  })

  describe('contact form', () => {
    before(() => {
      cy.navigateAndCheckURL(CONTACT_LIST_URL)
      cy.navigateToNewContactForm()
    })

    it('required validation for First Name, Last Name, Email, Job Title and Company', () => {
      cy.contactFormValidationChecker('required')
    })

    it('invalid email address validation message', () => {
      cy.contactFormValidationChecker('email')
    })

    it('Selecting company populates address, city, country, postal code amd state', () => {
      // relies on hardcoded address values inside the add company API call on line 82
      cy.fillForm(contactForm, { company: `${companyName}`, companySearch: 'aa' })

      cy.get('#contactAddEdit_txtAddress')
        .invoke('val')
        .then((val) => {
          console.log(val)
        })
      // const $el = Cypress.$('#contactAddEdit_txtAddress').val()
      // console.log($el)
      // expect($el).to.equal('Test123')

    })
  })

  describe('contact list', () => {
    let contactId
    const newContactName = `Contact for search functionality ${stringGen(6)}`

    before(() => {
      cy.addContactWithCompanyIDAPI(globalCompanyID, newContactName, userData).then((response) => {
        contactId = response.body.Contact.GlobalContactId
      })
      cy.navigateAndCheckURL(CONTACT_LIST_URL)
    })

    after(() => {
      cy.removeContactAPI(contactId, userData)
    })

    describe('search functionality', () => {
      it('perform valid search and return 1 result', () => {
        cy.searchForContactName('valid', `AAA ${newContactName}`)
      })

      it('preform invalid search and return meaningful message', () => {
        cy.searchForContactName('invalid', 'tsrdtcfygvuhjlhugyfutdrxysxdtfcygvhjb')
      })
    })
  })

  describe('contact overview widgets', () => {
    describe('contact overview no data', () => {
      const newContactName = `Widget Testing ${stringGen(5)}`
      let contactId
      const noInfoContact = {
        contactFirstName: 'AA First',
        contactJobTitle: 'Guy',
        contactEmailAddress: 'test@test.test',
        contactType: 'Transportation Manager',
        contactCountry: '127 Dying Bird Lane, LA, 67899, United States',
      }

      const { contactFirstName, contactJobTitle, contactEmailAddress, contactType, contactCountry } = noInfoContact

      before(() => {
        cy.intercept({
          method: 'POST',
          url: '/api/GlobalDeal/GetGlobalDeals',
        }).as('waitForPage')
        cy.addContactWithCompanyIDAPI(globalCompanyID, newContactName, userData).then((response) => {
          contactId = response.body.Contact.GlobalContactId
        })

        cy.navigateAndCheckURL(CONTACT_LIST_URL)
        cy.searchForContactNameAndOpen(newContactName);
        cy.wait('@waitForPage')
      })

      after(() => {
        cy.removeContactAPI(contactId, userData)
      })

      it('Last Activity doesn\'t display with no event or task', () => {
        cy.noWidgetVisible('lastActivity')
      })

      it('Next widget doesn\'t display with no event or task', () => {
        cy.noWidgetVisible('next')
      })

      it('info widget displays minimal information', () => {
        cy.contactInfoWidgetMinimialData(contactCountry, contactEmailAddress)
        cy.get('.col-left-box > .ibox.basic-card:nth-of-type(1) .info-icon').should('have.length', 2)
      })

      it('details widget displays minimal information', () => {
        cy.contactDetailsWidgetMinimalData(contactType, contactJobTitle)
        cy.get('.ibox.widget.basic-card.detail-card .ibox-content .inner-wrp').should('have.length', 7)
        cy.get('.ibox.widget.basic-card.detail-card .overview-checks .check.check-off').should('have.length', 4)
      })
    })

    describe('contact overview with data', () => {
      const newContactName = `Widget Testing ${stringGen(5)}`
      let contactId
      const noInfoContact = {
        contactFirstName: 'AA First',
        contactJobTitle: 'Testing',
        contactEmailAddress: 'testemail123@gmail.com',
        contactMobilePhone: '1234567890',
        contactBusinessPhone: '0987654321',
        contactType: 'Finance',
        contactCity: 'Manhatten',
        contactComments: 'THIS IS THE COMMENT OF ALL COMMENTS',
        contactState: 'New York',
        contactPreviousEmployer: 'Riot Games - Los Angeles',
        contactAddress: '123 Tom Street',
        contactPostCode: '123PDF',
        contactCountry: 'United States',
        contactHobby: 'Hockey, Painting',
      }

      const {
        contactFirstName,
        contactJobTitle,
        contactEmailAddress,
        contactMobilePhone,
        contactBusinessPhone,
        contactType,
        contactCity,
        contactComments,
        contactState,
        contactPreviousEmployer,
        contactAddress,
        contactPostCode,
        contactCountry,
        contactHobby,
      } = noInfoContact

      const fullName = `${contactFirstName} ${newContactName}`

      before(() => {
        cy.request({
          method: 'POST',
          url: '/api/contact/SaveContact',
          body: {
            'Contact': {
              'BirthdayDay': '8',
              'BirthdayMonth': '2',
              'BusinessAddress': contactAddress,
              'BusinessCity': contactCity,
              'BusinessCountry': contactCountry,
              'BusinessPhone': contactBusinessPhone,
              'BusinessPostalCode': contactPostCode,
              'BusinessStateProvince': contactState,
              'Comments': contactComments,
              'ContactName': newContactName,
              'ContactOwnerUserIdGlobal': userData.globalUserId,
              'ContactType': contactType,
              'Email': contactEmailAddress,
              'FirstName': contactFirstName,
              'FormerEmployee': 1,
              'GlobalCompanyId': globalCompanyID,
              'GlobalContactId': 1,
              'HasChildern': 1,
              'Hobbies': contactHobby,
              'HolidayCards': 1,
              'LastName': newContactName,
              'Married': 1,
              'MobilePhone': contactMobilePhone,
              'OkToCall': 1,
              'PreviousEmployees': contactPreviousEmployer,
              'ReceiveEmail': 1,
              'SubscriberId': subscriberId,
              'Title': contactJobTitle,
              'UpdateUserId': userData.userId,
              'UpdateUserIdGlobal': userData.globalUserId
            },
            'ProfilePic': null,
            'UpdateUserIdGlobal': userData.globalUserId
          },
        }).then((response) => {
          contactId = response.body.Contact.GlobalContactId
        })

        cy.navigateAndCheckURL(CONTACT_LIST_URL)
        cy.searchForContactNameAndOpen(newContactName);
      })

      after(() => {
        cy.removeContactAPI(contactId, userData)
      })

      it('info widget displays all information', () => {
        const addressConcat = `${contactAddress}, ${contactCity}, ${contactState}, ${contactPostCode}, ${contactCountry}`

        cy.contactInfoWidgetAllData(addressConcat, contactEmailAddress, contactBusinessPhone, contactMobilePhone)
        cy.get('.col-left-box > .ibox.basic-card:nth-of-type(1) .info-icon').should('have.length', 4)
      })

      it('details widget displays all information', () => {
        cy.contactDetailsWidgetAllData(contactType, contactJobTitle, 'February 8th', contactPreviousEmployer)
        cy.get('.ibox.widget.basic-card.detail-card .ibox-content .inner-wrp').should('have.length', 9)
        cy.get('.ibox.widget.basic-card.detail-card .overview-checks .check.check-on').should('have.length', 4)
      })

      it('company info widget displays correctly', () => {
        cy.contactCompanyInfoWidget(companyName, 'Test123, San Pedro, Cali, P90812F, United States')
      })

      it('Contact Owner widget displays correctly', () => {
        const contactOwnerDetails = {
          name: salesRepName,
          jobTitle: salesRepJobTitle,
          city: salesRepCity,
          country: salesRepCountry,
          email: salesRepEmail,
          number: salesRepnumber,
        }

        cy.contactOwnerWidget(contactOwnerDetails)
      })

      describe('company info widget', () => {
        afterEach(() => {
          cy.navigateAndCheckURL(CONTACT_LIST_URL)
          cy.searchForContactNameAndOpen(newContactName);
        })

        it('can select company from company info widget', () => {
          cy.get('[data-action="company-detail"]').click()
          cy.get('#lblCompanyName').should('have.text', companyName)
          cy.url().should('have.string', `/Companies/CompanyDetail/CompanyDetail.aspx?companyId=${newCompanyId}&subscriberId=${subscriberId}`)
        })

        it('select edit company takes user to edit company form', () => {
          cy.get('.col-left-box > .right-col > .ibox.basic-card:nth-of-type(1) [data-action="edit-company"]').click()
          cy.get('#lblBreadcrumbHeader').should('have.text', 'Edit Company ')
          cy.get(`#txtCompanyName[value="${companyName}"]`).should('be.visible')
          cy.get('#txtAddress').contains('Test123')
          cy.get('#txtCity[value="San Pedro"]').should('be.visible')
          cy.get('#select2-ddlCountry-container').contains('United States')
          cy.get('#txtPostalCode[value="P90812F"]').should('be.visible')
          cy.get('#select2-ddlCompanyType-container').contains('Carrier')
          cy.get('#select2-ddlOwner-container').contains(salesRepName)
          cy.get('#select2-ddlIndustry-container').contains('Chemical')
        })
      })

      describe.skip('next and last actitivty with event', () => {
        const eventTitle = `Event - ${numGen(5)}`
        const todaysDate = moment()
        let newEventId

        before(() => {
          const eventData = {
            subscriberId: subscriberId,
            name: eventTitle,
            id: salesRepUserId,
            globalUserId: salesRepGlobalUserId,
            userName: salesRepName,
            globalCompanyId: globalCompanyID,
            startTime: `${todaysDate.add(5, 'days').format('YYYY-MM-DD')} 15:00`,
            endTime: `${todaysDate.add(5, 'days').format('YYYY-MM-DD')} 15:00`,
            inviteeGlobalUserId: contactId,
            inviteeUserName: newContactName,
          }

          cy.addNewEventAPI(true, eventData).then((response) => {
            newEventId = response.body
          })

          cy.reload()
        })

        after(() => {
          cy.removeEventAPI(newEventId, false, userId)
        })

        it('Contact next widget with data - event', () => {
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

        it('Contact last activity widget - event', () => {
          const todaysDate = moment()
          const eventData = {
            activity: 'EVENT',
            eventName: eventTitle,
            added: `${todaysDate.format('DD-MMM-YY')}`,
            addedBy: `by ${salesRepName}`,
          }

          const { activity, eventName, added, addedBy } = eventData

          cy.checkActivityWidget(activity, eventName, added, addedBy)
        })
      })

      describe.skip('next and last actitivty with task', () => {
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
                'CompanyId': newCompanyId,
                'UpdateUserIdGlobal': salesRepGlobalUserId,
                'UserIdGlobal': salesRepGlobalUserId,
                'CompanyIdGlobal': globalCompanyID,
              },
              'Invites': [{ 'AttendeeType': 'Required', 'ContactId': contactId, 'ContactName': newContactName, 'SubscriberId': subscriberId, 'InviteType': 'contact' }],
            },
          }).then((response) => {
            newTaskId = response.body
          })

          cy.reload()
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
            addedBy: `by ${salesRepName}`,
          }

          const { activity, eventName, added, addedBy } = eventData

          cy.checkActivityWidget(activity, eventName, added, addedBy)
        })
      })
    })
  })

  describe('deals', () => {
    const navigateToDealsTabFromContact = () => {
      cy.navigateAndCheckURL(CONTACT_LIST_URL)
      // cy.get('#tblContacts')
      //   .contains(newContactName)
      //   .click()
      cy.searchForContactNameAndOpen(newContactName);
      cy.navigateToContactTab('deals')
    }
    const todaysDate = moment()
    const dealName = `New deal ${stringGen(6)}`
    let newDeal = {
      dealName: `${dealName}`,
      dealType: 'Maintenance',
      dealIncoterms: 'CFR',
      dealCompetitor: 'Yusen',
      dealCommodities: 'Chemicals',
      dealProposalDate: todaysDate.format('DD-MMM-YY'),
      dealDecisionDate: todaysDate.add(5, 'days').format('DD-MMM-YY'),
      dealFirstshipmentDate: todaysDate.add(1, 'months').format('DD-MMM-YY'),
      dealContractEndDate: todaysDate.add(5, 'months').format('DD-MMM-YY'),
      dealIndustry: 'Energy',
      dealComment: 'Comment',
    }

    let newChangeDeal = {
      dealName: `EDITED DEAL TITLE ${stringGen(5)}`,
    }

    let dealContactId
    let dealId
    let companyId
    const newContactName = `AAA${stringGen(5)}${numGen(4)}`

    before(() => {
      cy.addContactWithCompanyIDAPI(globalCompanyID, newContactName, userData).then((response) => {
        dealContactId = response.body.Contact.GlobalContactId
      })
    })

    after(() => {
      cy.removeContactAPI(dealContactId, userData)
    })

    it('Loading Deals... displays when getDeals API call is pending', () => {
      cy.intercept('/api/GlobalDeal/GetGlobalDeals', (req) => {
        req.reply((res) => {
        })
      })

      navigateToDealsTabFromContact()
      cy.testLoadingText('Qualifying')
      cy.testLoadingText('Negotiation')
      cy.testLoadingText('Trial Shipment')
      // cy.testLoadingText('Final Negotiation')
    })

    it('No deals shows correct message - active', () => {
      navigateToDealsTabFromContact()
      cy.noDealMessageTabs('active')
    })

    it('No deals shows correct message - inactive', () => {
      navigateToDealsTabFromContact()
      cy.noDealMessageTabs('inactive')
    })

    it('should add deal', () => {
      navigateToDealsTabFromContact()
      cy.get('a[data-action="new-deal"]:first').click({ force: true })

      cy.intercept({
        method: 'POST',
        url: '/api/deal/SaveDeal',
      }).as('dealID')

      // Fill the form
      cy.fillForm(dealForm, newDeal)

      // Click Save
      cy.get('#btnSave').click({ force: true })
      cy.wait('@dealID').then((xhr) => {
        dealId = xhr.response.body
        cy.get('#divLaneAddEdit').should('be.visible')
      })

      cy.wait(8000)
      cy.navigateAndCheckURL(CONTACT_LIST_URL)
      
      cy.searchForContactNameAndOpen(newContactName);
      cy.navigateToContactTab('deals')
      cy.get('#active-deal > div > [data-stage="Qualifying"]')
        .contains(dealName)
    })

    it('should list deals', () => {
      navigateToDealsTabFromContact()
      const dealDetails = {
        dataStage: 'Qualifying',
        dealID: dealId,
        dealTitle: dealName,
        dealCompanyName: companyName,
        dealOwner: salesRepName,
      }

      cy.testDealCard(dealDetails)
    })

    it('should edit deals', () => {
      cy.wait(4000)
      navigateToDealsTabFromContact()
      cy.get(`.cd-title [title="${dealName}"]`).click()
      cy.wait(4000)
      cy.get('.desktop-header-dropdown .edit-button').click()

      // Change Title
      cy.fillForm(dealForm, newChangeDeal)

      // Save
      cy.get('#btnSave').click()

      cy.get('#lblDealNameTop').should('have.text', newChangeDeal.dealName)

      cy.navigateAndCheckURL(CONTACT_LIST_URL)
      cy.searchForContactNameAndOpen(newContactName);
      cy.navigateToContactTab('deals')

      cy.get(`[data-id="${dealId}"].grid-box .cd-title > a`)
        .should('have.text', newChangeDeal.dealName)

      cy.wait(3000)
    })

    it('should delete deals', () => {
      cy.intercept({
        method: 'GET',
        url: `/api/deal/DeleteDeal/?dealId=${dealId}&userId=${salesRepUserId}&dealSubscriberId=${subscriberId}&userSubscriberId=${subscriberId}`,
      }).as('deleteDeal')
      navigateToDealsTabFromContact()
      cy.get(`.cd-title [title="${newChangeDeal.dealName}"]`).click()
      cy.wait(5000)
      cy.get('.desktop-header-dropdown .edit-button').click()

      // Click Save
      cy.get('#btnDelete').click()

      // Confirm Yes
      cy.get('.swal2-actions > :nth-child(1)').click()
      cy.wait('@deleteDeal')

      cy.wait(2000)
      cy.navigateAndCheckURL(CONTACT_LIST_URL)
      cy.searchForContactNameAndOpen(newContactName);
      cy.navigateToContactTab('deals')

      cy.get('#active-deal').should('not.contain.text', newChangeDeal.dealName)
    })

    it('selecting Deal Form should have company and contact locked', () => {
      navigateToDealsTabFromContact()
      cy.get('.deals-acts [data-action="new-deal"]')
        .click()
      cy.get('.select2.select2-container.select2-container--default .select2-selection--single[aria-labelledby="select2-ddlContact-container"]')
        .should('be.visible')
      // .should('have.css', 'background-color')
      // .and('eq', 'rgb(238, 238, 238)')
      cy.get('#select2-ddlContact-container').should('have.text', `AAA ${newContactName}`)

      cy.get('.select2.select2-container.select2-container--default.select2-container--disabled .select2-selection--single[aria-labelledby="select2-ddlCompany-container"]')
        .should('be.visible')
        .should('have.css', 'background-color')
        .and('eq', 'rgb(238, 238, 238)')
      cy.get('#select2-ddlCompany-container').should('have.text', `${companyName} - San Pedro`)
    })

    describe('contact deal - data', () => {
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

      before(() => {
        cy.addDeal(globalCompanyID, companyName, dealContactId, newContactName, wonDealName, 'Won', userData).then((response) => {
          wonDealID = response.body
        })
        cy.addDeal(globalCompanyID, companyName, dealContactId, newContactName, lostDealName, 'Lost', userData).then((response) => {
          lostDealID = response.body
        })
        cy.addDeal(globalCompanyID, companyName, dealContactId, newContactName, stalledDealName, 'Stalled', userData).then((response) => {
          stalledDealID = response.body
        })
        cy.addDeal(globalCompanyID, companyName, dealContactId, newContactName, qualifyingDealName, 'Qualifying', userData).then((response) => {
          qualID = response.body
        })
        cy.addDeal(globalCompanyID, companyName, dealContactId, newContactName, trialDealName, 'Trial Shipment', userData).then((response) => {
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
        navigateToDealsTabFromContact()
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
        const listViewChecker = ({ dealID, dealName, company, city, owner, stage }) => {

          const dealSelector = `tr[data-id="${dealID}"]`

          cy.get(`${dealSelector} .hover-link`).contains(dealName)
          cy.get(`${dealSelector} td:nth-of-type(2) .company`).contains(company)
          cy.get(`${dealSelector} :nth-of-type(3) .company`).contains(city)
          cy.get(`${dealSelector} td:nth-of-type(4)`).contains(owner)
          cy.get(`${dealSelector} td[data-sales-stage-id]`).contains(stage)
        }

        const trialDeal = { dealID: trialID, dealName: trialDealName, company: companyName, city: salesRepCity, owner: salesRepName, stage: 'Trial Shipment' }
        const wonDeal = { dealID: wonDealID, dealName: wonDealName, company: companyName, city: salesRepCity, owner: salesRepName, stage: 'Won' }
        const lostDeal = { dealID: lostDealID, dealName: lostDealName, company: companyName, city: salesRepCity, owner: salesRepName, stage: 'Lost' }
        const stalledDeal = { dealID: stalledDealID, dealName: stalledDealName, company: companyName, city: salesRepCity, owner: salesRepName, stage: 'Stalled' }
        const qualDeal = { dealID: qualID, dealName: qualifyingDealName, company: companyName, city: salesRepCity, owner: salesRepName, stage: 'Qualifying' }

        navigateToDealsTabFromContact()
        cy.get('[data-view="list"]').click()
        cy.get('[data-type-card="#active-deal"]').click()
        cy.get('#list-view').should('be.visible')
        listViewChecker(trialDeal)
        listViewChecker(qualDeal)
        cy.get('[data-type-card="#inactive-deal"]').click()
        listViewChecker(stalledDeal)
        listViewChecker(lostDeal)
        listViewChecker(wonDeal)
      })
    })
  })

  describe('contact quotes', () => {
    let contactID
    const newContactName = `AAA${stringGen(5)}${numGen(4)}`

    before(() => {
      cy.addContactWithCompanyIDAPI(globalCompanyID, newContactName, userData).then((response) => {
        contactID = response.body.Contact.GlobalContactId
      })
    })

    after(() => {
      cy.removeContactAPI(contactID, userData)
    })

    describe('validation', () => {
      context('quotes page', () => {

        beforeEach(() => {
          cy.clearCookies()
          const user = 'salesRep';
          cy.login(user)
          cy.get('#navSidebar_lblUserName')
            .should('have.text', users[user].details.name)
          cy.navigateAndCheckURL(CONTACT_LIST_URL)
          cy.searchForContactNameAndOpen(newContactName);
          cy.navigateToContactTab('quotes')
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
          cy.clearCookies()
          const user = 'salesRep';
          cy.login(user)
          cy.get('#navSidebar_lblUserName')
            .should('have.text', users[user].details.name)
          cy.navigateAndCheckURL(CONTACT_LIST_URL)
          cy.searchForContactNameAndOpen(newContactName);
          cy.navigateToContactTab('quotes')
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

        it('Company and contact locked on form', () => {
          cy.quotesFieldsReadOnly('contacts', companyName, newContactName, '')
        })
      })
    })
  })

  describe('events', () => {
    let eventContactId
    let newEventId
    const newContactName = `AAA${stringGen(5)}${numGen(4)}`

    before(() => {
      cy.addContactWithCompanyIDAPI(globalCompanyID, newContactName, userData).then((response) => {
        eventContactId = response.body.Contact.GlobalContactId
      })
    })

    after(() => {
      cy.removeContactAPI(eventContactId, userData)
    })

    const navigateToEventsTabFromContact = () => {
      cy.navigateAndCheckURL(CONTACT_LIST_URL)
      cy.searchForContactNameAndOpen(newContactName);
      cy.navigateToContactTab('events')
    }
    const eventTitle = `New Test Event ${stringGen(5)}`
    let newEvent = {
      eventTitle,
      // eventType: 'Meeting',
      // TODO: Cartegory
      eventLocation: 'Los Angeles',
      eventStartDate: moment().format('DD-MMM-YY'),
      eventEndDate: moment().format('DD-MMM-YY'),
      // eventStartTime: '4:00am',
      // eventEndTime: '4:30am',
      // eventReminder: '5 Minutes',
    }

    let newChangeEvent = {
      eventTitle: 'Another New Test Event Title',
    }

    it('New event form - company pre populated and read only', () => {
      navigateToEventsTabFromContact()
      cy.wait(3000)
      cy.selectAddEventHeader()
      cy.get('#select2-ddlCompany-container')
        .contains(companyName)
    })

    it('New event form - Logged in user and contact shown in guests', () => {
      navigateToEventsTabFromContact()
      cy.wait(2000)
      cy.selectAddEventHeader()
      cy.get('#tblInvites')
        .contains(salesRepName)
      cy.get(`tr[data-id="${eventContactId}"]`)
        .contains(`AAA ${newContactName}`)
    })

    it('No events on company displays correct messages', () => {
      navigateToEventsTabFromContact()
      cy.noEventsOnTab()
    })

    it('should add events', () => {
      cy.intercept({
        method: 'POST',
        url: '/api/CalendarEvent/SaveCalendarEvent',
      }).as('addEventAPI')
      cy.intercept({
        method: 'POST',
        url: '/api/calendarevent/GetContactCalendarEvents',
      }).as('contactEvents')
      navigateToEventsTabFromContact()
      cy.wait('@contactEvents')
      cy.wait(3000)
      cy.addEventOnTab(newEvent, true)
      cy.attendeesFromOutsideYourCompanyPopup('do not send')
      cy.wait('@addEventAPI').then((xhr) => {
        newEventId = xhr.response.body
        cy.wait('@contactEvents')
        cy.get('.event-title').contains(eventTitle)
      })
    })

    it('should edit events', () => {
      cy.intercept({
        method: 'GET',
        url: `/api/CalendarEvent/GetCalendarEvent?calendarEventId=${newEventId}&userId=${salesRepUserId}&subscriberId=${subscriberId}`,
      }).as('getEvent')
      cy.intercept({
        method: 'POST',
        url: '/api/calendarevent/GetContactCalendarEvents',
      }).as('contactEvents')
      navigateToEventsTabFromContact()
      cy.wait('@contactEvents')
      // cy.wait(5000)
      cy.get('#divEvents').contains(newEvent.eventTitle).click()

      cy.wait('@getEvent')

      cy.viewEventModalOverviewEditClose({ eventName: newEvent.eventTitle, type: 'edit' })
      cy.wait('@getEvent')
      cy.wait(2000)
      cy.get('#txtEventTitle').clear()
      // Change Title
      cy.fillForm(eventForm, newChangeEvent)

      // Save
      cy.get('#btnSave').click({ force: true })
      cy.skipWaitingForInvitationEmail('dont send')
      cy.attendeesFromOutsideYourCompanyPopup('do not send')
      cy.wait('@contactEvents')
      cy.get('.event-title').contains(newChangeEvent.eventTitle)
    })

    it('should delete test deal events', () => {
      cy.intercept({
        method: 'POST',
        url: '/api/calendarevent/GetContactCalendarEvents',
      }).as('contactEvents')
      navigateToEventsTabFromContact()
      cy.wait('@contactEvents')
      cy.deleteEventOnTab(newChangeEvent.eventTitle, newEventId)
      cy.get('[data-cypress-testing-id="call-to-action-add-event"]')
        .should('be.visible')
    })
  })

  describe('tasks', () => {
    let tasksContactId
    const newContactName = `AAA${stringGen(5)}${numGen(4)}`

    before(() => {
      cy.addContactWithCompanyIDAPI(globalCompanyID, newContactName, userData).then((response) => {
        tasksContactId = response.body.Contact.GlobalContactId
      })
    })

    after(() => {
      cy.removeContactAPI(tasksContactId, userData)
    })

    const navigateToTasksTabFromContact = () => {
      cy.navigateAndCheckURL(CONTACT_LIST_URL)
      cy.searchForContactNameAndOpen(newContactName);
      cy.navigateToContactTab('tasks')
    }

    let newTask = {
      taskTitle: `A${stringGen(5)}`,
      taskDescription: 'Test Task Description',
      taskDueDate: new Date().toDateString(),
    }

    let newTaskID

    describe('task validation', () => {
      it('no tasks displays meaningful message', () => {
        navigateToTasksTabFromContact()
        cy.noTasks()
      })

      it('unable to proceed if used has not inputted data into task name, description and due date', () => {
        cy.validationTaskTester()
      })
    })

    describe('task functionality', () => {
      it('should add tasks', () => {
        navigateToTasksTabFromContact()

        cy.addTask(newTask, newTask.taskTitle)
        cy.get('.row-wrapper')
          .invoke('attr', 'data-activityid')
          .then((taskid) => {
            newTaskID = taskid
            cy.deleteTaskAPI(newTaskID, salesRepGlobalUserId, subscriberId)
          })
      })

      it('should edit tasks', () => {
        cy.intercept('/api/Task/GetTasks').as('getTasks')
        cy.intercept({
          url: '/api/task/SaveTask',
          method: 'POST',
        }).as('saveTask')

        const taskData = {
          subscriberId,
          globalUserId: salesRepGlobalUserId,
          taskName: `TASK_${numGen(6)}`,
          taskDescription: 'EDIT TASK',
          dueDate: moment().format('DD-MMM-YY'),
          globalCompanyID: globalCompanyID,
          invitesArray: [{ InviteType: 'contact', GlobalContactId: tasksContactId, ContactName: newContactName, SubscriberId: subscriberId }]
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

          navigateToTasksTabFromContact()
          cy.get(`div[data-activityid="${taskID}"]`).contains(taskData.taskName)
          cy.get(`div[data-activityid="${taskID}"] .fa.fa-edit`).click()
          cy.wait('@editWait')

          // Change Titleprimary-btn btnSaveTask
          cy.fillForm(taskForm, newChangeTask)
          cy.get('#TaskAddEdit_btnTaskAdd').click()
          cy.wait('@saveTask')

          cy.wait('@getTasks')
          cy.wait(3000)
          cy.get(`div[data-activityid="${taskID}"]`).contains(newChangeTask.taskTitle)

          cy.deleteTaskAPI(taskID, salesRepGlobalUserId, subscriberId)
        })
      })

      it('should delete tasks', () => {
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
            'Invites': [{ 'InviteType': 'contact', 'GlobalContactId': tasksContactId, 'ContactName': `AAA ${newContactName}`, 'SubscriberId': subscriberId }],
          },
        }).then((response) => {
          navigateToTasksTabFromContact()
          cy.deleteTask(response.body)
        })
      })
    })
  })

  describe('notes', () => {
    let notesContactId
    const newContactName = `AAA${stringGen(5)}${numGen(4)}`

    before(() => {
      cy.addContactWithCompanyIDAPI(globalCompanyID, newContactName, userData).then((response) => {
        notesContactId = response.body.Contact.GlobalContactId
        cy.wait(5000)
      })
    })

    after(() => {
      cy.removeContactAPI(notesContactId, userData)
    })

    const navigateToNotesTabFromContact = () => {
      cy.intercept({
        method: 'POST',
        url: '/api/GlobalDeal/GetGlobalDeals',
      }).as('waitPageLoad')
      cy.navigateAndCheckURL(CONTACT_LIST_URL)
      cy.searchForContactNameAndOpen(newContactName);
      cy.wait('@waitPageLoad')
      cy.navigateToContactTab('notes')
    }

    it('No notes shows meaningful message', () => {
      navigateToNotesTabFromContact()
      cy.noNotesDisplaysCorrectly()
    })

    it('Note validation (no note)', () => {
      navigateToNotesTabFromContact()
      cy.checkNoNoteValidation()
    })

    it('should add notes', () => {
      const newNoteName = `New Note for Automation ${stringGen(7)} ${numGen(7)}`
      let newNote = {
        note: newNoteName,
      }

      navigateToNotesTabFromContact()
      cy.addNote(newNote, newNoteName, salesRepName, salesRepGlobalUserId)
    })

    it('should edit notes', () => {
      const addNoteAPI = {
        globalCompanyId: globalCompanyID,
        noteContent: `New Note For Edit ${stringGen(5)}`,
        contactId: notesContactId,
        dealId: 0,
      }

      cy.addNoteAPI('contact', addNoteAPI, userData).then((response) => {
        const noteId = response.body

        navigateToNotesTabFromContact()
        cy.editNote(addNoteAPI.noteContent, `New Edit Note ${numGen(5)}`, noteId, salesRepName, salesRepGlobalUserId)
      })
    })

    it('should delete notes', () => {
      const addNoteAPI = {
        globalCompanyId: globalCompanyID,
        noteContent: `New Note For Delete ${stringGen(5)}`,
        contactId: notesContactId,
        dealId: 0,
      }

      cy.addNoteAPI('contact', addNoteAPI, userData).then((response) => {
        const noteId = response.body

        navigateToNotesTabFromContact()
        cy.deleteNote(addNoteAPI.noteContent, noteId)
      })
    })
  })

  describe.skip('documents', () => {
    let documentsContactId
    const newContactName = `AAA${stringGen(5)}${numGen(4)}`

    before(() => {
      cy.addContactWithCompanyIDAPI(globalCompanyID, newContactName, userData).then((response) => {
        documentsContactId = response.body.Contact.GlobalContactId
        cy.wait(5000)
      })
    })

    after(() => {
      cy.removeContactAPI(documentsContactId, userData)
    })
    const docTitle = `Test-Doc-Title-${numGen(5)}`
    let newDocument = {
      docTitle,
      docDescription: 'Test doc Description',
    }

    const navigateToDocumentsTabFromContact = () => {
      cy.navigateAndCheckURL(CONTACT_LIST_URL)
      cy.get('#tblContacts')
        .contains(newContactName)
        .click()
      cy.navigateToContactTab('documents')
    }

    describe('document validation', () => {
      before(() => {
        navigateToDocumentsTabFromContact()
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

      it('Document validation - upload large image (over 5MB)', () => {
        cy.checkDocumentValidationMessage('largeFileType')
      })
    })

    describe('document functionality', () => {

      it('should delete test deal documents', () => {
        cy.navigateAndCheckURL(CONTACT_DETAIL_URL(documentsContactId))
        navigateToDocumentsTabFromContact()
        cy.addDocument('contact', globalCompanyID, documentsContactId, '', newDocument, docTitle, newDocument.docDescription)
        cy.deleteDocument()
      })

      it('should add document', () => {
        cy.navigateAndCheckURL(CONTACT_DETAIL_URL(documentsContactId))
        cy.addDocument('contact', globalCompanyID, documentsContactId, '', newDocument, docTitle, newDocument.docDescription)
      })

      it('should successfully download document', () => {
        cy.navigateAndCheckURL(CONTACT_DETAIL_URL(documentsContactId))
        cy.addDocument('contact', globalCompanyID, documentsContactId, '', newDocument, docTitle, newDocument.docDescription)
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
        cy.navigateAndCheckURL(CONTACT_DETAIL_URL(documentsContactId))
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

  describe('sales team', () => {
    let salesTeamContactId
    const newContactName = `AAA${stringGen(5)}${numGen(4)}`

    before(() => {
      cy.addContactWithCompanyIDAPI(globalCompanyID, newContactName, userData).then((response) => {
        salesTeamContactId = response.body.Contact.GlobalContactId
      })
    })

    after(() => {
      cy.removeContactAPI(salesTeamContactId, userData)
    })

    const navigateToSalesTeamTabFromContact = () => {
      cy.navigateAndCheckURL(CONTACT_LIST_URL)
      cy.searchForContactNameAndOpen(newContactName);
      cy.navigateToContactTab('salesTeam')
    }

    it('should add sales team member', () => {
      const newSalesMember = users['locationManager']
      let newSearch = {
        salesTeamMember: newSalesMember.details.name,
        salesTeamMemberSearch: newSalesMember.details.name,
        salesRole: 'Sales Manager',
      }

      navigateToSalesTeamTabFromContact()

      const newSalesTeamMember = {
        salesName: newSearch.salesTeamMember,
        salesJobTitle: newSalesMember.details.jobTitle,
        salesLocation: newSalesMember.details.city,
        salesEmail: newSalesMember.details.email,
        salesAddress: newSalesMember.details.address,
        salesNumber: newSalesMember.details.number,
        salesRole: newSearch.salesRole,
      }
      cy.addSalesTeamMember('add', newSearch, newSalesMember.globalUserId, newSalesTeamMember)
    })

    it('should edit the sales team user role - team', () => {
      const newSalesMember = users['salesManager']
      const newSalesRoleSelector = {
        salesRole: {
          id: 'AddSalesTeamMember_ddlSalesTeamRole',
          type: 'select',
          option: { force: true },
        },
      }

      const addSalesTeamUser = {
        companyId: 0,
        contactId: salesTeamContactId,
        dealId: 0,
        globalUserId: newSalesMember.globalUserId,
        userId: newSalesMember.userId,
        salesTeamRole: 'Sales Manager',
        subscriberId: subscriberId
      }
      let newSalesRole = {
        salesRole: 'Country Leader',
      }

      cy.addSalesTeamMemberAPI('contact', addSalesTeamUser)
      navigateToSalesTeamTabFromContact()
      cy.salesTeamChecker(newSalesMember.details.name, addSalesTeamUser.salesTeamRole, addSalesTeamUser.globalUserId)
      cy.editSalesTeam(addSalesTeamUser.globalUserId, newSalesRoleSelector, newSalesRole)
      cy.salesTeamChecker(newSalesMember.details.name, newSalesRole.salesRole, addSalesTeamUser.globalUserId)
    })

    it('Remove Sales Team User', () => {
      const newSalesMember = users['districtManager']
      const addSalesTeamUser = {
        companyId: 0,
        contactId: salesTeamContactId,
        dealId: 0,
        globalUserId: newSalesMember.globalUserId,
        userId: newSalesMember.userId,
        salesTeamRole: 'Sales Manager',
        subscriberId: subscriberId
      }

      cy.addSalesTeamMemberAPI('contact', addSalesTeamUser)
      navigateToSalesTeamTabFromContact()
      cy.salesTeamChecker(newSalesMember.details.name, addSalesTeamUser.salesTeamRole, addSalesTeamUser.globalUserId)
      cy.removeSalesTeamMember(addSalesTeamUser.globalUserId, newSalesMember.details.name)
    })
  })
})
