import moment from 'moment'
import { REPORT_ACTIVITIES_BY_DATE_RANGE, COMPANY_DETAIL_URL } from '../../urls'
import { activitiesByDateRangeForm } from '../../forms'
import 'moment-timezone'
import { stringGen } from '../../support/helpers'
const subscriberId = Cypress.env('subscriberId')

context('reports.activitiesByDateRange', () => {
  // let globalCompanyID
  // let companyID
  // const companyName = `report company ${stringGen(4)}`

  before(() => {
    cy.APILogin('salesRep')
    //   const companyData = {
    //     companyName,
    //     subscriberId,
    //     userId: salesRepUserId,
    //     globalUserId: salesRepGlobalUserId
    //   }
    //   cy.addCompanyAPI(companyData).then((response) => {
    //     companyID = response.body
    //     cy.navigateAndCheckURL(COMPANY_DETAIL_URL(companyID))
    //     cy.get('#main').find('#lblGlobalCompanyId').invoke('text').then((companyId) => {
    //       globalCompanyID = companyId
    //     })
    //   })
  })

  // after(() => {
  //   cy.deleteCompanyAPI(companyID, salesRepGlobalUserId, subscriberId)
  // })

  describe('validation', () => {
    const noResultsMessage = 'No Activities Found'

    beforeEach(() => {
      cy.intercept('/api/Report/GetActivitiesByDateRangeReport').as('getActivitiesByDateRangeReport')
      cy.navigateAndCheckURL(REPORT_ACTIVITIES_BY_DATE_RANGE)
      cy.wait('@getActivitiesByDateRangeReport')
    })

    it('no returned data should display no activities page', () => {
      cy.intercept('/api/Report/GetActivitiesByDateRangeReport', {
        'Activities': [],
        'EventCategories': [],
        'RecordCount': 0,
        'CurrentPage': 0,
        'TotalPages': 0,
        'ExcelUri': 'https://crm6.blob.core.windows.net/temp/activityBydateRange_202030260430.xlsx',
      })
      cy.reload()
      cy.noReportsReturned('No Activities Found')
    })

    it('toggling activity filters to off will display an error message', () => {
      const reportInputs = {
        notesToggle: true,
        eventToggle: true,
        tasksToggle: true,
      }

      cy.collapseReportFilterOptions()
      cy.fillForm(activitiesByDateRangeForm, reportInputs)
      cy.runReport()
      cy.checkErrorWarning('Select at least one activity type.')
    })

    describe('date picker', () => {
      const monthHeaderFormat = 'MMMM YYYY';

      beforeEach(() => {
        // open date picker
        cy.collapseDateRangeDatePicker()
      })

      it('toggle to today and see date change', () => {
        cy.validateActivitiesByDateRangeDatePicker('today')
      })

      it('toggle to yesterday and see date change', () => {
        cy.validateActivitiesByDateRangeDatePicker('yesterday')
      })

      it('toggle to this week and see date change', () => {
        cy.validateActivitiesByDateRangeDatePicker('thisWeek')
      })

      it('toggle to last week and see date change', () => {
        cy.validateActivitiesByDateRangeDatePicker('lastWeek')
      })

      it('toggle to this month and see date change', () => {
        cy.validateActivitiesByDateRangeDatePicker('thisMonth')
      })

      it('toggle to last month and see date change', () => {
        cy.validateActivitiesByDateRangeDatePicker('lastMonth')
      })

      it('toggle to custom date and see date change', () => {
        cy.validateActivitiesByDateRangeDatePicker('custom')
      })

      it('toggle next month and see header change', () => {
        cy.actitiviteByDateRange_ToggleDatePicker('next', moment().add(1, 'months').format(monthHeaderFormat), moment().add(2, 'months').format(monthHeaderFormat))
      })

      it('toggle previous month and see header change', () => {
        cy.actitiviteByDateRange_ToggleDatePicker('prev', moment().subtract(1, 'months').format(monthHeaderFormat), moment().format(monthHeaderFormat))
      })

      it('cancel out of date picker', () => {
        cy.get('.cancelBtn').click()
        cy.get('.daterangepicker').should('not.be.visible')
      })
    })
  })

  describe.skip('functionality', () => {
    const taskName = `task ${stringGen(5)}`
    const taskDescription = stringGen(8)
    const eventName = `report ${stringGen(5)}`
    const noteContent = stringGen(15)

    let taskId
    let eventId
    let noteId

    before(() => {
      // add task
      const newTaskData = {
        subscriberId: 283,
        globalUserId: 13752,
        taskName,
        taskDescription,
        dueDate: moment().subtract(1, 'days').format('DD-MMM-YY'),
        globalCompanyID,
      }

      cy.addTaskAPIUsers(newTaskData).then((response) => {
        taskId = response.body
      })

      //new event
      const newEventData = {
        subscriberId: 283,
        name: eventName,
        id: 16036,
        globalUserId: 13752,
        userName: 'Brendon Hartley',
        globalCompanyId: globalCompanyID,
        startTime: `${moment().subtract(1, 'days').format('YYYY-MM-DD')} 13:00`,
        endTime: `${moment().subtract(1, 'days').format('YYYY-MM-DD')} 13:30`,
      }

      cy.addNewEventAPI(false, newEventData).then((response) => {
        eventId = response.body
      })

      const noteDetails = {
        globalCompanyID,
        noteContent,
        userId: 16036,
        globalUserId: 13752,
        subscriberId: subscriberId
      }

      cy.addNoteAPIUsers(noteDetails).then((response) => {
        noteId = response.body
      })
    })

    after(() => {
      cy.deleteTaskAPI(taskId, salesRepGlobalUserId, 283)
      cy.removeEventAPI(eventId, false, userId)
      cy.deleteNoteAPI(noteId, salesRepGlobalUserId)
    })

    describe('filtering', () => {
      const createdUpdatedString = `${moment().tz('America/Los_Angeles').format('DD-MMM-YY')} @`
      const userName = 'Brendon Hartley'
      const eventRow = {
        rowUserName: userName,
        rowDate: `${moment().subtract(1, 'days').format('DD-MMM-YY')} 13:00`,
        rowEventType: 'EVENT',
        rowSubject: eventName,
        rowDescription: '',
        rowDeal: '',
        // rowCompany: companyName,
        rowContact: '',
        rowCampaign: '',
        rowDealType: '',
        rowCompetitors: '',
        rowCreated: createdUpdatedString,
        rowUpdated: createdUpdatedString,
      }

      const taskRow = {
        rowUserName: userName,
        rowDate: moment().subtract(1, 'days').format('DD-MMM-YY'),
        rowEventType: 'TASK',
        rowSubject: taskName,
        rowDescription: taskDescription,
        rowDeal: '',
        // rowCompany: companyName,
        rowContact: '',
        rowCampaign: '',
        rowDealType: '',
        rowCompetitors: '',
        rowCreated: createdUpdatedString,
        rowUpdated: createdUpdatedString,
      }

      const noteRow = {
        rowUserName: userName,
        rowDate: moment().format('DD-MMM-YY'),
        rowEventType: 'NOTE',
        rowSubject: '',
        rowDescription: noteContent,
        rowDeal: '',
        // rowCompany: companyName,
        rowContact: '',
        rowCampaign: '',
        rowDealType: '',
        rowCompetitors: '',
        rowCreated: createdUpdatedString,
        rowUpdated: createdUpdatedString,
      }

      before(() => {
        cy.log(companyID)
        cy.log(taskId)
        cy.log(noteId)
        cy.log(eventId)
        cy.log(globalCompanyID)

        cy.navigateAndCheckURL(REPORT_URL)
        cy.navigateToSection('activitiesByDateRange')
        const reportInputs = {
          fromDate: moment().subtract(2, 'days').format('DD MMMM, YYYY'),
          toDate: moment().add(1, 'days').format('DD MMMM, YYYY'),
        }

        cy.fillForm(activitiesByDateRangeForm, reportInputs)
      })

      it.skip('Run report and return all activities', () => {
        cy.server()
        cy.route({
          url: '/api/Report/GetActivitiesByDateRangeReport',
          method: 'POST',
        }).as('activitiesByDateRange')
        cy.runReport()
        cy.wait('@activitiesByDateRange')
        cy.validateDataRow(eventId, eventRow)
        cy.validateDataRow(taskId, taskRow)
        cy.validateDataRow(noteId, noteRow)
      })

      it.skip('Filter tasks and run report', () => {
        cy.server()
        cy.route({
          url: '/api/Report/GetActivitiesByDateRangeReport',
          method: 'POST',
        }).as('activitiesByDateRange')
        const reportInputs = {
          notesToggle: true,
          eventToggle: true,
        }

        cy.fillForm(activitiesByDateRangeForm, reportInputs)
        cy.runReport()
        cy.wait('@activitiesByDateRange')
        cy.validateDataRow(taskId, taskRow)
        cy.rowNotDisplayed(noteId)
        cy.rowNotDisplayed(eventId)
      })

      it('Filter events and run report', () => {
        cy.server()
        cy.route({
          url: '/api/Report/GetActivitiesByDateRangeReport',
          method: 'POST',
        }).as('activitiesByDateRange')
        const reportInputs = {
          notesToggle: true,
          tasksToggle: true,
        }

        cy.fillForm(activitiesByDateRangeForm, reportInputs)
        cy.runReport()
        cy.wait('@activitiesByDateRange')
        cy.validateDataRow(eventId, eventRow)
        cy.rowNotDisplayed(noteId)
        cy.rowNotDisplayed(taskId)
      })

      it.skip('Filter notes and run report', () => {
        cy.server()
        cy.route({
          url: '/api/Report/GetActivitiesByDateRangeReport',
          method: 'POST',
        }).as('activitiesByDateRange')
        const reportInputs = {
          notesToggle: true,
          eventToggle: true,
        }

        cy.fillForm(activitiesByDateRangeForm, reportInputs)
        cy.runReport()
        cy.wait('@activitiesByDateRange')
        cy.validateDataRow(noteId, noteRow)
        cy.rowNotDisplayed(eventId)
        cy.rowNotDisplayed(taskId)
      })

      it.skip('Filter tasks and notes and run report', () => {
        cy.server()
        cy.route({
          url: '/api/Report/GetActivitiesByDateRangeReport',
          method: 'POST',
        }).as('activitiesByDateRange')
        const reportInputs = {
          tasksToggle: true,
        }

        cy.fillForm(activitiesByDateRangeForm, reportInputs)
        cy.runReport()
        cy.wait('@activitiesByDateRange')
        cy.validateDataRow(taskId, taskRow)
        cy.validateDataRow(noteId, noteRow)
        cy.rowNotDisplayed(eventId)
      })

      it.skip('Filter tasks and events and run report', () => {
        cy.server()
        cy.route({
          url: '/api/Report/GetActivitiesByDateRangeReport',
          method: 'POST',
        }).as('activitiesByDateRange')
        const reportInputs = {
          notesToggle: true,
          eventToggle: true,
        }

        cy.fillForm(activitiesByDateRangeForm, reportInputs)
        cy.runReport()
        cy.wait('@activitiesByDateRange')
        cy.validateDataRow(taskId, taskRow)
        cy.validateDataRow(eventId, eventRow)
        cy.rowNotDisplayed(noteId)
      })

      it.skip('Filter events and notes and run report', () => {
        cy.server()
        cy.route({
          url: '/api/Report/GetActivitiesByDateRangeReport',
          method: 'POST',
        }).as('activitiesByDateRange')
        const reportInputs = {
          notesToggle: true,
          tasksToggle: true,
        }

        cy.fillForm(activitiesByDateRangeForm, reportInputs)
        cy.runReport()
        cy.wait('@activitiesByDateRange')
        cy.validateDataRow(eventId, eventRow)
        cy.validateDataRow(noteId, noteRow)
        cy.rowNotDisplayed(taskId)
      })

      it('Navigate to company', () => {
        cy.selectCompanyFromReport(eventId, companyName)
      })
    })
  })

  describe.skip('user role tests', () => {
    let noteSRId
    let noteSMId
    let noteLMId
    let noteDMId
    let noteCMId
    let noteRMId
    let noteCRMAdminId
    let noteIdArray = []

    let eventSRId
    let eventSMId
    let eventLMId
    let eventDMId
    let eventCMId
    let eventRMId
    let eventCRMAdminId
    let eventIdArray = []

    let taskSRId
    let taskSMId
    let taskLMId
    let taskDMId
    let taskCMId
    let taskRMId
    let taskCRMAdminId
    let taskIdArray = []
    let taskUIdArray = []
    let taskSubIdArray = []

    const noteBody = stringGen(10)
    const eventName = stringGen(8)
    const taskName = stringGen(7)
    const taskDescription = stringGen(11)

    const addNoteForUser = (uId, globalUId) => cy.addNoteAPIUsers({
      globalCompanyID,
      noteContent: noteBody,
      userId: uId,
      globalUserId: globalUId,
    })

    const addEventForUser = (subId, uId, globalUId, userName) => cy.addNewEventAPI(false, {
      subscriberId: subId,
      name: eventName,
      id: uId,
      globalUserId: globalUId,
      userName,
      globalCompanyId: globalCompanyID,
      startTime: `${moment().subtract(1, 'days').format('YYYY-MM-DD')} 13:00`,
      endTime: `${moment().subtract(1, 'days').format('YYYY-MM-DD')} 13:30`,
    })

    const addTaskForUser = (subId, globalUId) => cy.addTaskAPIUsers({
      subscriberId: subId,
      globalUserId: globalUId,
      taskName,
      taskDescription,
      dueDate: moment().subtract(1, 'days').format('DD-MMM-YY'),
      globalCompanyID,
      startTime: `${moment().subtract(1, 'days').format('YYYY-MM-DD')} 13:00`,
      endTime: `${moment().subtract(1, 'days').format('YYYY-MM-DD')} 13:30`,
    })


    before(() => {
      //add all Activities here via API. 3 for each user

      //NOTES
      // addNoteForUser(16036, 13752).then((response) => {
      //     noteSRId = response.body
      //     noteIdArray.push(noteSRId)
      // })

      // addNoteForUser(16036, 13752).then((response) => {
      //     noteSMId = response.body
      //     noteIdArray.push(noteSMId);
      // })

      // addNoteForUser(16036, 13752).then((response) => {
      //     noteLMId = response.body
      //     noteIdArray.push(noteLMId);
      // })

      // addNoteForUser(16036, 13752).then((response) => {
      //     noteDMId = response.body
      //     noteIdArray.push(noteDMId);
      // })

      // addNoteForUser(16036, 13752).then((response) => {
      //     noteCMId = response.body
      //     noteIdArray.push(noteCMId);
      // })

      // addNoteForUser(16036, 13752).then((response) => {
      //     noteRMId = response.body
      //     noteIdArray.push(noteRMId);
      // })

      // addNoteForUser(16036, 13752).then((response) => {
      //     noteCRMAdminId = response.body
      //     noteIdArray.push(noteCRMAdminId);
      // })

      //EVENTS
      addEventForUser(283, 16036, 13752, 'Brendon Hartley').then((response) => {
        eventSRId = response.body
        eventIdArray.push(eventSRId)
      })

      addEventForUser(283, 9430, 11809, 'Kylie Minogue').then((response) => {
        eventSMId = response.body
        eventIdArray.push(eventSMId)
      })

      addEventForUser(283, 9384, 11776, 'Carmen Miranda').then((response) => {
        eventLMId = response.body
        eventIdArray.push(eventLMId)
      })

      addEventForUser(283, 9411, 11795, 'Gwen Stefani').then((response) => {
        eventDMId = response.body
        eventIdArray.push(eventDMId)
      })

      addEventForUser(283, 9380, 11774, 'Charles Bronson').then((response) => {
        eventCMId = response.body
        eventIdArray.push(eventCMId)
      })

      addEventForUser(283, 9375, 11770, 'Bruce Lee').then((response) => {
        eventRMId = response.body
        eventIdArray.push(eventRMId)
      })

      addEventForUser(283, 9432, 11811, 'Dev CRM Admin').then((response) => {
        eventCRMAdminId = response.body
        eventIdArray.push(eventCRMAdminId)
      })

      //TASKS
      // sales rep
      addTaskForUser(283, 13752).then((response) => {
        taskSRId = response.body
        taskIdArray.push(taskSRId)
        taskUIdArray.push(16036)
        taskSubIdArray.push(283)
      })

      // sales manager
      addTaskForUser(283, 11809).then((response) => {
        taskSMId = response.body
        taskIdArray.push(taskSMId)
        taskUIdArray.push(9430)
        taskSubIdArray.push(283)
      })

      // location manager
      addTaskForUser(283, 11776).then((response) => {
        taskLMId = response.body
        taskIdArray.push(taskLMId)
        taskUIdArray.push(9384)
        taskSubIdArray.push(283)
      })

      // district manager
      addTaskForUser(283, 11795).then((response) => {
        taskDMId = response.body
        taskIdArray.push(taskDMId)
        taskUIdArray.push(9411)
        taskSubIdArray.push(283)
      })

      // country manager
      addTaskForUser(283, 11774).then((response) => {
        taskCMId = response.body
        taskIdArray.push(taskCMId)
        taskUIdArray.push(9380)
        taskSubIdArray.push(283)
      })

      // region manager
      addTaskForUser(283, 11770).then((response) => {
        taskRMId = response.body
        taskIdArray.push(taskRMId)
        taskUIdArray.push(9375)
        taskSubIdArray.push(283)
      })

      // CRM admin
      addTaskForUser(283, 11811).then((response) => {
        taskCRMAdminId = response.body
        taskIdArray.push(taskCRMAdminId)
        taskUIdArray.push(9432)
        taskSubIdArray.push(283)
      })

    })
    const loginWithAPI = (user) => cy.APILogin(user)

    after(() => {
      //delete notes
      // for (let i = 0; i < noteIdArray.length; i++) {
      //     cy.deleteNoteAPI(noteIdArray[i])
      // }

      //delete events
      for (let i = 0; i < eventIdArray.length; i++) {
        cy.removeEventAPI(eventIdArray[i], false, userId)
      }

      //delete tasks
      for (let i = 0; i < taskIdArray.length; i++) {
        cy.deleteTaskAPI(taskIdArray[i], taskUIdArray[i], taskSubIdArray[i])
      }
    })

    context('sales rep - Brendon Hartley', () => {
      before(() => {
        loginWithAPI('deanMartin')
        cy.navigateAndCheckURL(REPORT_URL)
        cy.navigateToSection('activitiesByDateRange')

        const reportInputs = {
          fromDate: moment().subtract(2, 'days').format('DD MMMM, YYYY'),
          toDate: moment().add(1, 'days').format('DD MMMM, YYYY'),
        }

        cy.fillForm(activitiesByDateRangeForm, reportInputs)
      })

      after(() => {
        cy.logOutProgramatically()
      })

      it('Return Sales Rep Data', () => {
        cy.server()
        cy.route({
          url: '/api/Report/GetActivitiesByDateRangeReport',
          method: 'POST',
        }).as('activities')
        const existArray = [taskSRId, eventSRId]
        const doesNotExistArray = [taskSMId, taskLMId, taskDMId, taskCMId, taskRMId, taskCRMAdminId, eventSMId, eventLMId, eventDMId, eventCMId, eventRMId, eventCRMAdminId]
        const usernamesExistArray = ['Brendon Hartley']
        const userNamesNotExistArray = ['Kylie Minogue', 'Carmen Miranda', 'Gwen Stefani', 'Charles Bronson', 'Bruce Lee', 'Dev CRM Admin']

        cy.runReport()
        const responseUsersArray = []

        cy.wait('@activities').then((xhr) => {
          const activitiesResponsePath = (i) => xhr.response.body.Activities[i].User

          for (let i = 0; i < xhr.response.body.Activities.length; i++) {
            let userName = activitiesResponsePath(i)

            responseUsersArray.push(userName)
          }
        })
        cy.log(existArray)
        cy.log(doesNotExistArray)
        cy.log(usernamesExistArray)
        cy.log(userNamesNotExistArray)
        cy.log(responseUsersArray)
        cy.userRoleValidationABDR(existArray, doesNotExistArray, usernamesExistArray, userNamesNotExistArray, responseUsersArray)
      })
    })

    context('sales manager - kylie minogue', () => {
      before(() => {
        loginWithAPI('kylieMinogue')
        cy.navigateAndCheckURL(REPORT_URL)
        cy.navigateToSection('activitiesByDateRange')

        const reportInputs = {
          fromDate: moment().subtract(2, 'days').format('DD MMMM, YYYY'),
          toDate: moment().add(1, 'days').format('DD MMMM, YYYY'),
        }

        cy.fillForm(activitiesByDateRangeForm, reportInputs)
        cy.runReport()
      })

      after(() => {
        cy.logOutProgramatically()
      })

      it('Return Sales Manager Data', () => {
        cy.server()
        cy.route({
          url: '/api/Report/GetActivitiesByDateRangeReport',
          method: 'POST',
        }).as('activities')
        const existArray = [taskSRId, taskSMId, eventSRId, eventSMId]
        const doesNotExistArray = [taskLMId, taskDMId, taskCMId, taskRMId, taskCRMAdminId, eventLMId, eventDMId, eventCMId, eventRMId, eventCRMAdminId]
        const usernamesExistArray = ['Brendon Hartley', 'Kylie Minogue']
        const userNamesNotExistArray = ['Carmen Miranda', 'Gwen Stefani', 'Charles Bronson', 'Bruce Lee', 'Dev CRM Admin']

        cy.runReport()
        const responseUsersArray = []

        cy.wait('@activities').then((xhr) => {
          const activitiesResponsePath = (i) => xhr.response.body.Activities[i].User

          for (let i = 0; i < xhr.response.body.Activities.length; i++) {
            let userName = activitiesResponsePath(i)

            responseUsersArray.push(userName)
          }
        })
        cy.userRoleValidationABDR(existArray, doesNotExistArray, usernamesExistArray, userNamesNotExistArray, responseUsersArray)
      })
    })

    context('location manager - Carmen Miranda', () => {
      before(() => {
        loginWithAPI('carmenMiranda')
        cy.navigateAndCheckURL(REPORT_URL)
        cy.navigateToSection('activitiesByDateRange')

        const reportInputs = {
          fromDate: moment().subtract(2, 'days').format('DD MMMM, YYYY'),
          toDate: moment().add(1, 'days').format('DD MMMM, YYYY'),
        }

        cy.fillForm(activitiesByDateRangeForm, reportInputs)
        cy.runReport()
      })

      after(() => {
        cy.logOutProgramatically()
      })

      it('Return Location Manager Data', () => {
        cy.server()
        cy.route({
          url: '/api/Report/GetActivitiesByDateRangeReport',
          method: 'POST',
        }).as('activities')
        const existArray = [taskSRId, taskSMId, eventSRId, eventSMId, taskLMId, eventLMId]
        const doesNotExistArray = [taskDMId, taskCMId, taskRMId, taskCRMAdminId, eventDMId, eventCMId, eventRMId, eventCRMAdminId]
        const usernamesExistArray = ['Brendon Hartley', 'Kylie Minogue', 'Carmen Miranda']
        const userNamesNotExistArray = ['Gwen Stefani', 'Charles Bronson', 'Bruce Lee', 'Dev CRM Admin']

        cy.runReport()
        const responseUsersArray = []

        cy.wait('@activities').then((xhr) => {
          const activitiesResponsePath = (i) => xhr.response.body.Activities[i].User

          for (let i = 0; i < xhr.response.body.Activities.length; i++) {
            let userName = activitiesResponsePath(i)

            responseUsersArray.push(userName)
          }
        })
        cy.userRoleValidationABDR(existArray, doesNotExistArray, usernamesExistArray, userNamesNotExistArray, responseUsersArray)
      })
    })

    context('district manager - Gwen Stefani', () => {
      before(() => {
        loginWithAPI('gwenStefani')
        cy.navigateAndCheckURL(REPORT_URL)
        cy.navigateToSection('activitiesByDateRange')

        const reportInputs = {
          fromDate: moment().subtract(2, 'days').format('DD MMMM, YYYY'),
          toDate: moment().add(1, 'days').format('DD MMMM, YYYY'),
        }

        cy.fillForm(activitiesByDateRangeForm, reportInputs)
        cy.runReport()
      })

      after(() => {
        cy.logOutProgramatically()
      })

      it('Return Sales Rep Data', () => {
        cy.server()
        cy.route({
          url: '/api/Report/GetActivitiesByDateRangeReport',
          method: 'POST',
        }).as('activities')
        const existArray = [taskSRId, taskSMId, taskLMId, taskDMId, eventSRId, eventSMId, eventLMId, eventDMId]
        const doesNotExistArray = [taskCMId, taskRMId, taskCRMAdminId, eventCMId, eventRMId, eventCRMAdminId]
        const usernamesExistArray = ['Brendon Hartley', 'Kylie Minogue', 'Carmen Miranda', 'Gwen Stefani']
        const userNamesNotExistArray = ['Charles Bronson', 'Bruce Lee', 'Dev CRM Admin']

        cy.runReport()
        const responseUsersArray = []

        cy.wait('@activities').then((xhr) => {
          const activitiesResponsePath = (i) => xhr.response.body.Activities[i].User

          for (let i = 0; i < xhr.response.body.Activities.length; i++) {
            let userName = activitiesResponsePath(i)

            responseUsersArray.push(userName)
          }
        })
        cy.userRoleValidationABDR(existArray, doesNotExistArray, usernamesExistArray, userNamesNotExistArray, responseUsersArray)
      })
    })

    context('country manager - Charles Bronson', () => {
      before(() => {
        loginWithAPI('charlesBronson')
        cy.navigateAndCheckURL(REPORT_URL)
        cy.navigateToSection('activitiesByDateRange')

        const reportInputs = {
          fromDate: moment().subtract(2, 'days').format('DD MMMM, YYYY'),
          toDate: moment().add(1, 'days').format('DD MMMM, YYYY'),
        }

        cy.fillForm(activitiesByDateRangeForm, reportInputs)
        cy.runReport()
      })

      after(() => {
        cy.logOutProgramatically()
      })

      it('Return Sales Rep Data', () => {
        cy.server()
        cy.route({
          url: '/api/Report/GetActivitiesByDateRangeReport',
          method: 'POST',
        }).as('activities')
        const existArray = [taskSRId, taskSMId, taskLMId, taskDMId, taskCMId, eventSRId, eventSMId, eventLMId, eventDMId, eventCMId]
        const doesNotExistArray = [taskRMId, taskCRMAdminId, eventRMId, eventCRMAdminId]
        const usernamesExistArray = ['Brendon Hartley', 'Kylie Minogue', 'Carmen Miranda', 'Gwen Stefani', 'Charles Bronson']
        const userNamesNotExistArray = ['Bruce Lee', 'Dev CRM Admin']

        cy.runReport()
        const responseUsersArray = []

        cy.wait('@activities').then((xhr) => {
          const activitiesResponsePath = (i) => xhr.response.body.Activities[i].User

          for (let i = 0; i < xhr.response.body.Activities.length; i++) {
            let userName = activitiesResponsePath(i)

            responseUsersArray.push(userName)
          }
        })
        cy.userRoleValidationABDR(existArray, doesNotExistArray, usernamesExistArray, userNamesNotExistArray, responseUsersArray)
      })
    })

    context('region manager - Bruce Lee', () => {
      before(() => {
        loginWithAPI('bruceLee')
        cy.navigateAndCheckURL(REPORT_URL)
        cy.navigateToSection('activitiesByDateRange')

        const reportInputs = {
          fromDate: moment().subtract(2, 'days').format('DD MMMM, YYYY'),
          toDate: moment().add(1, 'days').format('DD MMMM, YYYY'),
        }

        cy.fillForm(activitiesByDateRangeForm, reportInputs)
        cy.runReport()
      })

      after(() => {
        cy.logOutProgramatically()
      })

      it('Return Sales Rep Data', () => {
        cy.server()
        cy.route({
          url: '/api/Report/GetActivitiesByDateRangeReport',
          method: 'POST',
        }).as('activities')
        const existArray = [taskSRId, taskSMId, taskLMId, taskDMId, taskCMId, taskRMId, eventSRId, eventSMId, eventLMId, eventDMId, eventCMId, eventRMId]
        const doesNotExistArray = [taskCRMAdminId, eventCRMAdminId]
        const usernamesExistArray = ['Brendon Hartley', 'Kylie Minogue', 'Carmen Miranda', 'Gwen Stefani', 'Charles Bronson', 'Bruce Lee']
        const userNamesNotExistArray = ['Dev CRM Admin']

        cy.runReport()
        const responseUsersArray = []

        cy.wait('@activities').then((xhr) => {
          const activitiesResponsePath = (i) => xhr.response.body.Activities[i].User

          for (let i = 0; i < xhr.response.body.Activities.length; i++) {
            let userName = activitiesResponsePath(i)

            responseUsersArray.push(userName)
          }
        })
        cy.userRoleValidationABDR(existArray, doesNotExistArray, usernamesExistArray, userNamesNotExistArray, responseUsersArray)
      })
    })

    context('CRM admin - CRM Admin', () => {
      before(() => {
        loginWithAPI('crmAdmin')
        cy.navigateAndCheckURL(REPORT_URL)
        cy.navigateToSection('activitiesByDateRange')

        const reportInputs = {
          fromDate: moment().subtract(2, 'days').format('DD MMMM, YYYY'),
          toDate: moment().add(1, 'days').format('DD MMMM, YYYY'),
        }

        cy.fillForm(activitiesByDateRangeForm, reportInputs)
        cy.runReport()
      })

      after(() => {
        cy.logOutProgramatically()
      })

      it('Return Sales Rep Data', () => {
        cy.server()
        cy.route({
          url: '/api/Report/GetActivitiesByDateRangeReport',
          method: 'POST',
        }).as('activities')
        const existArray = [taskSRId, taskSMId, taskLMId, taskDMId, taskCMId, taskRMId, taskCRMAdminId, eventSRId, eventSMId, eventLMId, eventDMId, eventCMId, eventRMId, eventCRMAdminId]
        const doesNotExistArray = []
        const usernamesExistArray = ['Brendon Hartley', 'Kylie Minogue', 'Carmen Miranda', 'Gwen Stefani', 'Charles Bronson', 'Bruce Lee', 'Dev CRM Admin']
        const userNamesNotExistArray = ['all']

        cy.runReport()
        const responseUsersArray = []

        cy.wait('@activities').then((xhr) => {
          const activitiesResponsePath = (i) => xhr.response.body.Activities[i].User

          for (let i = 0; i < xhr.response.body.Activities.length; i++) {
            let userName = activitiesResponsePath(i)

            responseUsersArray.push(userName)
          }
        })
        cy.userRoleValidationABDR(existArray, doesNotExistArray, usernamesExistArray, userNamesNotExistArray, responseUsersArray)
      })
    })
  })
})
