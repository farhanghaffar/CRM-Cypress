/// <reference types="Cypress" />

// import users from '../../constants'

import { eventForm, taskFormCal } from '../../forms'
import { ACTIVITY_URL, COMPANY_DETAIL_URL } from '../../urls'
import moment from 'moment'
import 'moment-timezone'
import { stringGen, numGen, convertFirstCharOfStringToUpperCase } from '../../support/helpers'
const users = Cypress.env('users')
const subscriberId = Cypress.env('subscriberId')

context('activity', () => {
    const salesRepGlobalUserId = users['salesRep'].globalUserId
    const salesRepUserId = users['salesRep'].userId
    const salesRepName = users['salesRep'].details.name
    const userData = {
        subscriberId: subscriberId,
        userId: salesRepUserId,
        globalUserId: salesRepGlobalUserId
    }

    let globalCompanyID
    let eventID
    let companyID
    let contactID
    let dealID
    const companyName = `New Company ${stringGen(5)}`
    const newContactName = `New Contact ${stringGen(5)}`
    const newDealName = `New Deal ${stringGen(6)}`

    before(() => {
        cy.APILogin('salesRep')
        const companyData = {
            companyName,
            subscriberId,
            userId: salesRepUserId,
            globalUserId: salesRepGlobalUserId
        }

        console.log(companyData)

        cy.addCompanyAPI(companyData).then((response) => {
            companyID = response.body.CompanyId
            globalCompanyID = response.body.GlobalCompanyId
            console.log(response)
            cy.navigateAndCheckURL(COMPANY_DETAIL_URL(companyID))

            cy.addContactWithCompanyIDAPI(globalCompanyID, newContactName, userData).then((response) => {
                contactID = response.body.Contact.GlobalContactId
            })

            cy.addDeal(globalCompanyID, companyName, contactID, newContactName, newDealName, 'Qualifying', userData).then((response) => {
                dealID = response.body
            })
        })
    })

    after(() => {
        cy.deleteDealAPI(dealID, userData)
        cy.removeContactAPI(contactID, userData)
        cy.deleteCompanyAPI(companyID, salesRepGlobalUserId, subscriberId)
    })

    describe('events', () => {
        const eventTitle = `event - ${stringGen(7)}`
        const editedTitle = `event - ${numGen(7)}`

        beforeEach(() => {
            cy.intercept({
                method: "post",
                url: "/api/Task/GetTasks"
            }).as('getTasks')
            cy.intercept({
                method: "post",
                url: "/api/Activity/GetActivitiesForCalendar"
            }).as('getEvents')
            cy.visit(ACTIVITY_URL)
            cy.wait('@getTasks', { timeout: 180000 })
            cy.wait('@getEvents', { timeout: 180000 })
        })
        it('add new event on activity page and displays correctly', () => {
            const newEvent = {
                eventTitle,
                eventType: 'Meeting External',
                eventLocation: 'Los Angeles',
                // eventStartDate: moment().format('DD-MMM-YY'),
                // eventEndDate: moment().format('DD-MMM-YY'),
                eventStartTime: '11:00pm',
                eventEndTime: '11:30pm',
                eventReminder: '5 Minutes',
            }

            cy.intercept({
                method: 'POST',
                url: '/api/CalendarEvent/SaveCalendarEvent',
            }).as('newCalID')
            cy.intercept({
                method: 'POST',
                url: `/api/DropDown/GetCampaigns`
            }).as('getCampains')
            cy.intercept({
                method: "post",
                url: "/api/Activity/GetActivitiesForCalendar"
            }).as('getEvents')

            cy.get('#btnAddEvent[data-action="add-event"]')
                .click({ force: true })
            cy.wait('@getCampains')
            cy.fillForm(eventForm, newEvent)
            cy.addNewCompanyToEvent(companyName)
            cy.addNewDealToEvent(newDealName)
            cy.saveEvent()
            cy.wait('@newCalID', { timeout: 120000 }).then((xhr) => {
                eventID = xhr.response.body
                const event = {
                    eventId: xhr.response.body,
                    eventTitle: convertFirstCharOfStringToUpperCase(newEvent.eventTitle),
                    // eventDate: moment().format('ddd, DD-MMM-YY'),
                    eventTime: '11:00 pm',
                    eventLocation: newEvent.eventLocation,
                    eventCompany: companyName,
                    eventCat: newEvent.eventType,
                    eventDeals: newDealName,
                }
                cy.wait('@getEvents', { timeout: 180000 })
                cy.checkEventOverview(event)
            })
        })

        it('Select and edit event', () => {
            const changeEvent = {
                eventTitle: editedTitle,
                eventType: 'Private / Holiday',
                eventLocation: 'Manchester',
                // eventStartDate: moment().format('DD-MMM-YY'),
                // eventEndDate: moment().format('DD-MMM-YY'),
                eventStartTime: '9:00am',
                eventEndTime: '11:00am',
            }

            const modalData = {
                eventName: convertFirstCharOfStringToUpperCase(eventTitle),
                type: 'edit',
            }

            cy.intercept({
                url: `/api/CalendarEvent/GetCalendarEvent?calendarEventId=${eventID}&userId=${salesRepUserId}&subscriberId=${subscriberId}`,
                method: 'GET',
            }).as('getEvent')
            cy.intercept({
                method: 'POST',
                url: '/api/CalendarEvent/SaveCalendarEvent',
            }).as('newCalID')
            cy.intercept({
                method: 'POST',
                url: '/api/calendarevent/GetCompanyCalendarEvents',
            }).as('companyEvents')
            cy.intercept({
                method: "post",
                url: "/api/Task/GetTasks"
            }).as('getTasks')
            cy.intercept({
                method: "post",
                url: "/api/Activity/GetActivitiesForCalendar"
            }).as('getEvents')

            cy.selectEventFromActivity(convertFirstCharOfStringToUpperCase(eventTitle))
            cy.wait('@getEvent')
            cy.viewEventModalOverviewEditClose(modalData)
            // cy.selectEventNameBasedOnType(true, eventID)
            cy.wait('@getEvent')
            cy.fillForm(eventForm, changeEvent)
            cy.saveEvent()
            cy.wait('@newCalID', { timeout: 120000 }).then((xhr) => {
                cy.wait('@getEvents', { timeout: 180000 })
                eventID = xhr.response.body
            })
            const event = {
                eventId: eventID,
                eventTitle: convertFirstCharOfStringToUpperCase(changeEvent.eventTitle),
                // eventDate: moment().format('ddd, DD-MMM-YY'),
                eventTime: '9:00 am',
                eventLocation: changeEvent.eventLocation,
                eventCompany: companyName,
                eventCat: changeEvent.eventType,
                eventUser: salesRepName,
                eventDeals: newDealName,
            }
            cy.checkEventOverview(event)
        })

        it('delete event', () => {
            const modalData = {
                eventName: convertFirstCharOfStringToUpperCase(editedTitle),
                type: 'edit',
            }

            cy.intercept({
                url: `/api/CalendarEvent/GetCalendarEvent?calendarEventId=${eventID}&userId=${salesRepUserId}&subscriberId=${subscriberId}`,
                method: 'GET',
            }).as('getEvent')
            cy.intercept({
                url: `/api/CalendarEvent/DeleteCalendarEvent/?calendarEventId=${eventID}&deleteRecurring=false&userId=${salesRepUserId}&subscriberId=${subscriberId}&cancellationEmails=false`,
                method: 'GET',
            }).as('deleteEvent')
            cy.intercept({
                method: 'POST',
                url: '/api/calendarevent/GetCompanyCalendarEvents',
            }).as('companyEvents')
            cy.selectEventFromActivity(modalData.eventName)
            cy.wait('@getEvent')
            cy.viewEventModalOverviewEditClose(modalData)
            // cy.selectEventNameBasedOnType(true, eventID)
            cy.wait('@getEvent')
            cy.wait(3000)
            cy.get('.text-danger.delete-btn.secondary-btn[data-action="delete-event"]')
                .click()

            cy.deleteModal('Delete Event!', 'Are you sure you want to delete this event?', 'delete')
            cy.wait('@deleteEvent')

            cy.get('#events-list-data-grid')
                .should('not.contain', modalData.editedTitle)
        })

        it('no events show correct messages', () => {
            const noEventsSelector = '#overlay_events > .no-items'

            cy.intercept('/api/Activity/GetActivitiesForCalendar', '[]')
            cy.reload()
            cy.get(noEventsSelector)
                .should('be.visible')
            cy.get(`${noEventsSelector} .no-items-icon.icon-calendar`)
                .should('be.visible')
            cy.get(`${noEventsSelector} .no-items-text`)
                .should('be.visible')
                .and('have.text', 'no events')
        })
    })

    describe('tasks', () => {
        beforeEach(() => {
            cy.intercept({
                method: "post",
                url: "/api/Task/GetTasks"
            }).as('getTasks')
            cy.intercept({
                method: "post",
                url: "/api/Activity/GetActivitiesForCalendar"
            }).as('getEvents')
            cy.visit(ACTIVITY_URL)
            cy.wait('@getTasks', { timeout: 180000 })
            cy.wait('@getEvents', { timeout: 180000 })
        })
        let taskId
        const newTaskTitle = `task - ${stringGen(8)}`

        it('Add a task with all data and see on activity page', () => {
            let newTask = {
                taskTitle: newTaskTitle,
                taskDescription: 'Test Task Description',
                taskDueDate: moment().add(1, 'days').format('MM/DD/YYYY'),
                taskCompany: companyName,
                taskCompanySearch: companyName,
                taskDeal: newDealName,
                taskDealSearch: newDealName,
                taskContact: newContactName,
                taskContactSearch: `AAA ${newContactName}`,
            }

            cy.intercept({
                url: '/api/task/SaveTask',
                method: 'POST',
            }).as('saveTask')
            cy.intercept({
                method: 'POST',
                url: '/api/Task/GetTasks',
            }).as('getTasks')

            cy.log(newDealName)

            cy.get('.add[data-action="add-task"]')
                .click()
            cy.fillForm(taskFormCal, newTask)
            cy.wait(2000)
            cy.get('#TaskAddEdit_btnTaskAdd')
                .click()
            cy.wait('@saveTask').then((xhr) => {
                taskId = xhr.response.body
                cy.wait('@getTasks')
                const taskData = {
                    taskId: xhr.response.body,
                    title: convertFirstCharOfStringToUpperCase(newTask.taskTitle),
                    dueDate: moment().add(1, 'days').format('ddd, DD-MMM-YY'),
                    company: companyName,
                    contact: newContactName,
                    deal: newDealName,
                }
                cy.checkTaskOverview(taskData)
            })
        })

        it('Select task and edit', () => {
            const changeTask = {
                taskTitle: `Task - ${numGen(7)}`,
                taskDescription: 'Test Task Description',
                taskDueDate: moment().add(3, 'days').format('MM/DD/YYYY'),
            }

            cy.intercept({
                url: `/api/Task/GetTask?taskId=${taskId}&subscriberId=${subscriberId}`,
                method: 'GET',
            }).as('getTask')
            cy.intercept({
                url: '/api/task/SaveTask',
                method: 'POST',
            }).as('saveTask')
            cy.intercept({
                method: 'POST',
                url: '/api/Task/GetTasks',
            }).as('getTasks')

            cy.selectTaskFromActivity(convertFirstCharOfStringToUpperCase(newTaskTitle))
            cy.wait('@getTask')

            cy.fillForm(taskFormCal, changeTask)
            cy.get('#TaskAddEdit_btnTaskAdd')
                .click()

            cy.wait('@saveTask').then((xhr) => {

            })
            cy.wait('@getTasks')

            const taskData = {
                taskId,
                title: changeTask.taskTitle,
                dueDate: moment().add(3, 'days').format('ddd, DD-MMM-YY'),
                company: companyName,
                contact: newContactName,
                deal: newDealName,
            }

            cy.checkTaskOverview(taskData)
        })

        it('Mark Task as complete', () => {
            // SKIPPED AS I NEED UNIQUE IDENTIFIER FOR EACH TASK [data-id="${taskId}"]
            cy.intercept({
                url: `/api/task/ToggleTaskCompleted/?&taskId=${taskId}&state=true&userId=${salesRepUserId}&subscriberId=${subscriberId}`,
                method: 'GET',
            }).as('taskComplete')
            cy.intercept({
                method: 'POST',
                url: '/api/Task/GetTasks',
            }).as('getTasks')
            cy.intercept('/api/Toast/GetOverdueToasts/').as('getOverdueToasts')

            cy.activityMarkTaskComplete(taskId)
            cy.wait('@taskComplete')
            // cy.successModal('Task Status: Completed')

            cy.wait('@getOverdueToasts')
            cy.get(`.row-wrapper[data-activity-id="${taskId}"]`)
                .should('not.exist')
            cy.deleteTaskAPI(taskId, salesRepGlobalUserId, subscriberId)
        })

        it('no tasks shows correct message', () => {
            const noEventsSelector = '#overlay_tasks > .no-items'

            cy.intercept('/api/Task/GetTasks', '[]')
            cy.reload()
            cy.get(noEventsSelector)
                .should('be.visible')
            cy.get(`${noEventsSelector} .no-items-icon.icon-task`)
                .should('be.visible')
            cy.get(`${noEventsSelector} .no-items-text`)
                .should('be.visible')
                .and('have.text', 'no tasks')
        })
    })
})