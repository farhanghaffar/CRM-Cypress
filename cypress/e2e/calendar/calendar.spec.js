/// <reference types="Cypress" />

import { eventForm } from '../../forms'
import { ACTIVITY_URL, COMPANY_DETAIL_URL, DEAL_DETAIL_URL, EVENT_LIST_URL } from '../../urls'
import moment from 'moment'
import { stringGen, numGen } from '../../support/helpers'
const users = Cypress.env('users')
const subscriberId = Cypress.env('subscriberId')

context('calendar', () => {
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
        cy.visit(EVENT_LIST_URL)
    })

    describe('event overview modal', () => {
        const companyName = `New Company Name ${stringGen(4)}${numGen(4)}`
        const contactName = 'John Doe'
        const dealName = stringGen(8)

        let calId
        let companyID
        let globalCompanyID
        let contactID
        let dealId

        beforeEach(() => {
            cy.visit(EVENT_LIST_URL)
        })

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
                cy.navigateAndCheckURL(COMPANY_DETAIL_URL(companyID))

                cy.addContactWithCompanyIDAPI(globalCompanyID, contactName, userData).then((response) => {
                    contactID = response.body.Contact.ContactId
                })

                cy.addDeal(globalCompanyID, companyName, contactID, contactName, dealName, 'Qualifying', userData).then((response) => {
                    dealId = response.body
                })
            })
        })

        after(() => {
            cy.deleteDealAPI(dealId, userData)
            cy.deleteCompanyAPI(companyID, salesRepGlobalUserId, subscriberId)
        })

        it('close event modal', () => {
            cy.intercept({
                method: 'POST',
                url: '/api/activity/GetActivitiesForCalendar/',
            }).as('getActivities')
            const newEventData = {
                subscriberId: subscriberId,
                name: `Event Title ${stringGen(6)}`,
                id: salesRepUserId,
                globalUserId: salesRepGlobalUserId,
                userName: salesRepName,
                globalCompanyId: '',
                startTime: `${moment().format('YYYY-MM-DD')} 23:00`,
                endTime: `${moment().format('YYYY-MM-DD')} 23:30`,
            }

            cy.addNewEventAPI(false, newEventData).then((response) => {
                calId = response.body

                const modalData = {
                    eventName: newEventData.name,
                    type: 'close',
                }

                cy.reload()
                cy.wait('@getActivities')
                cy.get('.fc-month-view')
                    .contains(newEventData.name)
                    .click()
                cy.viewEventModalOverviewEditClose(modalData)
                console.log(calId)
                cy.removeEventAPI(calId, false, userData)
            })
        })

        it('populate entire event and see details on event overview - all day event', () => {
            const eventDescription = 'This is a description'
            const newEventData = {
                subscriberId: subscriberId,
                globalUserId: salesRepGlobalUserId,
                id: salesRepUserId,
                userName: salesRepName,
                name: `Event Title ${stringGen(6)}`,
                description: `<p>${eventDescription}</p>`,
                isAllDay: true,
                location: 'Manchester',
                isRecurring: false,
                startTime: `${moment().format('YYYY-MM-DD')} 00:00`,
                endTime: '',
                dealId,
            }

            const eventValidationObject = {
                eventHeader: newEventData.name,
                visibility: 'private',
                publicPrivateIconClass: 'fa-eye-slash',
                appearAs: 'free',
                busyFreeIconClass: 'fa-user',
                isAllDay: true,
                allDayDate: moment().format('DD-MMM-YY'),
                startDateTime: '',
                endDateTime: '',
                eventOwnerUsername: salesRepName,
                categoryName: 'meeting external',
                categoryColour: 'rgb(242, 199, 72)',
                companyNameDetails: companyName,
                location: newEventData.location,
                dealNameDetails: dealName,
                reminderTime: '15 minutes',
                attachmentName: '158023.png',
                descriptionBody: eventDescription,
            }

            cy.addEventWithAllData(globalCompanyID, newEventData).then((response) => {
                cy.intercept('/api/activity/GetActivitiesForCalendar/').as('getActivities')
                cy.reload()
                cy.wait('@getActivities')
                cy.get('.fc-month-view')
                    .contains(newEventData.name)
                    .click()
                cy.validateEventOverviewModal(true, eventValidationObject)
                cy.removeEventAPI(response.body, false, userData)
            })
        })

        it('minimum amount of data added', () => {
            const newEventData = {
                subscriberId: subscriberId,
                name: `Event Title ${stringGen(6)}`,
                id: salesRepUserId,
                globalUserId: salesRepGlobalUserId,
                userName: salesRepName,
                globalCompanyId: '',
                startTime: `${moment().format('YYYY-MM-DD')} 22:00`,
                endTime: `${moment().format('YYYY-MM-DD')} 22:30`,
            }

            cy.addNewEventAPI(true, newEventData).then((response) => {
                calId = response.body

                const eventValidationObject = {
                    eventHeader: newEventData.name,
                    visibility: 'public',
                    publicPrivateIconClass: 'fa-eye',
                    appearAs: 'busy',
                    busyFreeIconClass: 'fa-user-times',
                    isAllDay: false,
                    startDateTime: `${moment().format('DD-MMM-YY')} - 11:00 PM`,
                    endDateTime: `${moment().format('DD-MMM-YY')} - 11:30 PM`,
                    eventOwnerUsername: salesRepName,
                }

                cy.reload()
                cy.get('.fc-month-view')
                    .contains(newEventData.name)
                    .click()
                cy.validateEventOverviewModal(false, eventValidationObject)
                cy.removeEventAPI(calId, false, userData)
            })
        })

        it('read only when logged in user did not create the event', () => {
            const newEventData = {
                subscriberId: subscriberId,
                name: `Event Title ${stringGen(6)}`,
                id: '15869',
                globalUserId: salesRepGlobalUserId,
                userName: 'Jay Jay Okocha',
                globalCompanyId: '',
                startTime: `${moment().format('YYYY-MM-DD')} 23:00`,
                endTime: `${moment().format('YYYY-MM-DD')} 23:30`,
                inviteeGlobalUserId: salesRepGlobalUserId,
                inviteeUserName: salesRepName,
            }

            cy.addNewEventAPI(true, newEventData).then((response) => {
                calId = response.body

                const modalData = {
                    eventName: newEventData.name,
                    type: 'readOnly',
                }

                cy.reload()
                cy.wait(4000)
                cy.get('.fc-month-view')
                    .contains(newEventData.name)
                    .click()
                cy.viewEventModalOverviewEditClose(modalData)
                console.log(calId)
                cy.removeEventAPI(calId, false, userData)
            })
        })
    })

    describe('functionality', () => {
        let newCatName = `cat name ${stringGen(3)}`
        let colour = '#ff00ff'
        let calId
        let eventCatId
        const randomId = `${stringGen(4)}${numGen(3)}`
        const newEventCat = {
            eventTitle: `Event - ${randomId}`,
            eventType: newCatName,
            eventLocation: 'Los Angeles',
            eventStartDate: moment().format('DD-MMM-YY'),
            eventEndDate: moment().format('DD-MMM-YY'),
            eventStartTime: '4:00am',
            eventEndTime: '4:30am',
            eventReminder: '5 Minutes',
        }

        before(() => {
            cy.request({
                url: '/api/CalendarEvent/SaveEventCategory',
                method: 'POST',
                body: {
                    'SubscriberId': subscriberId,
                    'UpdateUserId': salesRepUserId,
                    'eventCategoryId': 0,
                    'CategoryColor': colour,
                    'CategoryName': newCatName,
                },
            }).then((response) => {
                eventCatId = response.body
                cy.log(response.body)
            })
        })

        after(() => {
            cy.request({
                url: `/api/CalendarEvent/DeleteEventCategory/?id=${eventCatId}&userId=${salesRepUserId}&subscriberId=${subscriberId}`,
                method: 'GET',
            })
        })

        it('should create an event - with category and event displays relevent colour on cal', () => {
            cy.intercept({
                method: 'POST',
                url: '/api/CalendarEvent/SaveCalendarEvent',
            }).as('newCalID')
            cy.intercept('/api/activity/GetActivitiesForCalendar/').as('getActivities')
            cy.addEventOnCal(newEventCat, false)

            // check event is displayed on calendar month view
            cy.wait('@newCalID').then((xhr) => {
                const calendarID = xhr.response.body
                cy.wait('@getActivities')
                cy.reload()
                cy.get('.fc-month-view').contains(newEventCat.eventTitle)
                cy.get(`.fc-day-grid-event.fc-h-event.fc-event.fc-start.fc-end.fc-draggable[style="background-color:${colour};border-color:${colour}"]`)
                    .contains(newEventCat.eventTitle)
                cy.removeEventAPI(calendarID, false, userData)
            })
        })

        it('should edit event', () => {
            cy.intercept({
                method: 'POST',
                url: '/api/CalendarEvent/SaveCalendarEvent',
            }).as('newCalID')
            const newEventData = {
                subscriberId: subscriberId,
                name: `Event Title ${stringGen(6)}`,
                id: salesRepUserId,
                globalUserId: salesRepGlobalUserId,
                userName: salesRepName,
                globalCompanyId: '',
                startTime: `${moment().format('YYYY-MM-DD')} 23:00`,
                endTime: `${moment().format('YYYY-MM-DD')} 23:30`,
            }

            cy.addNewEventAPI(false, newEventData).then((response) => {
                calId = response.body
                cy.log(calId)
                cy.location(response.body)
            })

            const modalData = {
                eventName: newEventData.name,
                type: 'edit',
            }

            cy.reload()
            cy.wait(3000)
            cy.get('.fc-month-view').contains(newEventData.name).click()
            cy.viewEventModalOverviewEditClose(modalData)
            let newChangeEvent = {
                eventTitle: `Edited Event Title ${stringGen(4)}`,
            }

            cy.wait(4000)
            cy.get('#txtEventTitle').should('be.visible')
            // Change Title
            cy.get('#txtEventTitle').clear()
            cy.get('#txtEventTitle').type(newChangeEvent.eventTitle)

            // Save
            cy.saveEvent()
            cy.wait('@newCalID').then((xhr) => {
                const calendarID = xhr.response.body

                cy.get('.fc-month-view').contains(newChangeEvent.eventTitle)
                cy.removeEventAPI(calendarID, false, userData)
            })
        })

        it('delete event', () => {
            cy.intercept({
                method: 'POST',
                url: '/api/activity/GetActivitiesForCalendar/',
            }).as('getActivities')
            const newEventData = {
                subscriberId: subscriberId,
                name: `Event Title ${stringGen(6)}`,
                id: salesRepUserId,
                globalUserId: salesRepGlobalUserId,
                userName: salesRepName,
                globalCompanyId: '',
                startTime: `${moment().format('YYYY-MM-DD')} 23:00`,
                endTime: `${moment().format('YYYY-MM-DD')} 23:30`,
            }

            cy.addNewEventAPI(false, newEventData).then((response) => {
                calId = response.body
            })

            const modalData = {
                eventName: newEventData.name,
                type: 'edit',
            }

            cy.reload(true)
            cy.wait('@getActivities')
            cy.get('.fc-month-view').contains(newEventData.name)
                .click()
            cy.viewEventModalOverviewEditClose(modalData)

            cy.deleteEventOnCal('', '', newEventData.name)
        })

        it('add all day event', () => {
            cy.intercept({
                method: 'POST',
                url: '/api/activity/GetActivitiesForCalendar/',
            }).as('getActivities')

            cy.intercept({
                method: 'POST',
                url: '/api/CalendarEvent/SaveCalendarEvent',
            }).as('newCalID')
            const eventTitle = `All Day ${numGen(4)}`
            const newEventAllDay = {
                eventTitle,
            }

            const modalData = {
                eventName: eventTitle,
                type: 'edit',
            }

            cy.reload(true)
            cy.wait('@getActivities')
            cy.openEventForm()
            cy.fillForm(eventForm, newEventAllDay)
            cy.checkAllDay()
            cy.get('.col-md-3.col-mid-box.timeBox')
                .should('not.be.visible')
                .should('have.css', 'display')
                .and('eq', 'none')
            cy.saveEvent()
            cy.wait('@newCalID').then((xhr) => {
                const calendarID = xhr.response.body

                cy.wait('@getActivities')
                cy.get('.fc-month-view').contains(eventTitle)
                    .click({ force: true })
                cy.viewEventModalOverviewEditClose(modalData)
                cy.get('#chkAllDay').should('be.checked')
                cy.removeEventAPI(calendarID, false, userData)
                cy.reload()
            })
        })

        it('add event with attachment', () => {
            cy.intercept({
                method: 'POST',
                url: '/api/activity/GetActivitiesForCalendar/',
            }).as('getActivities')
            cy.intercept({
                method: 'POST',
                url: '/api/CalendarEvent/SaveCalendarEvent',
            }).as('newCalID')
            const eventTitle = `All Day ${numGen(4)}`
            const newEventAllDay = {
                eventTitle,
            }
            const modalData = {
                eventName: eventTitle,
                type: 'edit',
            }
            cy.reload().wait('@getActivities')
            cy.openEventForm()
            cy.fillForm(eventForm, newEventAllDay)

            cy.addAttachment()
            cy.saveEvent()
            cy.wait('@newCalID').then((xhr) => {
                const calendarID = xhr.response.body

                cy.wait('@getActivities')
                cy.get('.fc-month-view').contains(eventTitle)
                    .click()
                cy.viewEventModalOverviewEditClose(modalData)
                cy.get('.attachment:nth-of-type(2) .col-file-name')
                    .should('have.text', 'sloth.jpg')
                cy.removeEventAPI(calendarID, false, userData)
                cy.reload()
            })
        })

        it('add guests to event normal and add', () => {
            cy.intercept({ method: 'POST', url: '/api/activity/GetActivitiesForCalendar/' }).as('getActivities')
            cy.intercept({ method: 'POST', url: '/api/CalendarEvent/SaveCalendarEvent' }).as('newCalID')

            const userInput = users['salesManager'].details.name
            const eventTitle = `All Day ${numGen(4)}`
            const newEventAllDay = {
                eventTitle,
            }
            const modalData = {
                eventName: eventTitle,
                type: 'edit',
            }

            cy.reload()
            cy.wait('@getActivities')
            cy.openEventForm()
            cy.fillForm(eventForm, newEventAllDay)
            cy.addGuestToEvent(userInput)
            cy.get('ul#select2-ddlInvites-results .select2-results__option.select2-results__option--highlighted .col > p').should(($invitee) => {
                expect($invitee, '3 items').to.have.length(3)
                expect($invitee.eq(0), 'first item').to.contain(userInput)
                expect($invitee.eq(1), 'second item').to.contain(users['salesManager'].details.email)
                expect($invitee.eq(2), 'second item').to.contain(users['salesManager'].details.country)
            })
            cy.get('.select2-search.select2-search--dropdown .select2-search__field')
                .type('{enter}')
            cy.checkInviteeList(userInput)
            cy.saveEvent()
            cy.get('.swal2-cancel.left-cancel.swal2-styled')
                .click()
            cy.wait('@newCalID').then((xhr) => {
                cy.wait('@getActivities')
                const calendarID = xhr.response.body
                cy.get('.fc-month-view').contains(eventTitle)
                    .click()
                cy.viewEventModalOverviewEditClose(modalData)
                cy.checkInviteeList(userInput)
                cy.removeEventAPI(calendarID, false, userData)
                cy.reload()
            })
        })


        context('company and deals on event', () => {
            let calendarID
            let newCompanyId
            let dealID
            let contactID
            const companyName = `Events Company ${stringGen(5)}`
            const newContactName = `New Contact ${numGen(4)}`
            const newDealName = `Events deal ${stringGen(6)}`
            const eventName = `Com Event ${stringGen(5)}`

            before(() => {
                const companyData = {
                    companyName,
                    subscriberId,
                    userId: salesRepUserId,
                    globalUserId: salesRepGlobalUserId
                }
                cy.addCompanyAPI(companyData).then((response) => {
                    newCompanyId = response.body.CompanyId
                    let globalCompanyID = response.body.GlobalCompanyId
                    cy.navigateAndCheckURL(COMPANY_DETAIL_URL(response.body.CompanyId))


                    cy.addContactWithCompanyIDAPI(globalCompanyID, newContactName, userData).then((response) => {
                        contactID = response.body.Contact.GlobalContactId


                        cy.addDeal(globalCompanyID, companyName, contactID, newContactName, newDealName, 'Qualifying', userData).then((response) => {
                            dealID = response.body
                        })
                    })
                })

                cy.visit(EVENT_LIST_URL)

            })

            after(() => {
                cy.deleteCompanyAPI(newCompanyId, salesRepGlobalUserId, subscriberId)
                cy.deleteDealAPI(dealID, userData)
                cy.removeContactAPI(contactID, userData)
            })

            it('Add event and assign to company. See event on company page', () => {
                cy.intercept({
                    method: 'POST',
                    url: '/api/CalendarEvent/SaveCalendarEvent',
                }).as('newCalID')
                const newEventComDeal = {
                    eventTitle: eventName,
                }

                cy.openEventForm()
                cy.fillForm(eventForm, newEventComDeal)
                cy.addNewCompanyToEvent(companyName)
                cy.addNewDealToEvent(newDealName)
                cy.saveEvent()
                cy.wait('@newCalID').then((xhr) => {
                    calendarID = xhr.response.body
                    cy.get('.fc-month-view').contains(eventName)
                })

                cy.navigateAndCheckURL(COMPANY_DETAIL_URL(newCompanyId))
                cy.navigateToTab('events')

                const eventArray = [eventName]

                cy.eventsTabList(eventArray)
            })

            it('Add event and assign to deal. See event on deal page', () => {
                cy.navigateAndCheckURL(DEAL_DETAIL_URL(dealID))
                cy.navigateToDealTab('events')

                const eventArray = [eventName]

                cy.eventsTabList(eventArray)
                cy.removeEventAPI(calendarID, false, userData)
            })
        })

        context('recurring events', () => {
            const recurringSelector = (eventName) => `.fc-content:contains("${eventName}")`
            before(() => {
                cy.intercept({
                    method: 'POST',
                    url: '/api/CalendarEvent/SaveCalendarEvent',
                }).as('newCalID')
                cy.intercept({
                    method: 'POST',
                    url: '/api/activity/GetActivitiesForCalendar/',
                }).as('getActivities')
                cy.visit(EVENT_LIST_URL)
            })

            context('daily recurring events', () => {
                const eventName = `Daily - ${stringGen(4)}`
                const dailyEvent = {
                    eventTitle: eventName,
                }

                before(() => {
                    cy.openEventForm()
                })

                it('add daily recurring event', () => {
                    cy.fillForm(eventForm, dailyEvent)
                    cy.recurringEventOption('Daily')
                    cy.saveEvent()
                    cy.wait('@newCalID', { timeout: 120000 }).then((xhr) => {
                        cy.wait('@getActivities')
                        cy.checkRecurringEvents(eventName, 4)
                        cy.prevNextToggle('next')
                        cy.checkRecurringEvents(eventName, 2)
                        cy.removeEventAPI(xhr.response.body, true, userData)
                    })

                })

                it('delete one daily recurring event', () => {
                    const eventName = `DAILY RECURRING_${stringGen(6)}`
                    const eventData = {
                        subscriberId: subscriberId,
                        globalUserId: salesRepGlobalUserId,
                        id: salesRepUserId,
                        userName: salesRepName,
                        name: eventName,
                        isAllDay: false,
                        isRecurring: true,
                        recurringOccurence: 'Daily',
                        startTime: `${moment().format('YYYY-MM-DD')} 09:00`,
                        endTime: `${moment().format('YYYY-MM-DD')} 10:00`
                    }
                    cy.addRecurringEvent(eventData).then((response) => {
                        const eventId = response.body
                        cy.intercept(`/api/CalendarEvent/DeleteCalendarEvent/?calendarEventId=**`).as('waitForDelete')
                        cy.intercept('/api/activity/GetActivitiesForCalendar/').as('getActivities')
                        cy.reload()
                        cy.wait('@getActivities')
                        cy.get(`.fc-content:contains("${eventName}")`)
                            .its('length')
                            .then((length) => {
                                cy.selectFirstRecurring(eventName)
                                cy.viewEventModalOverviewEditClose({ eventName: eventName, type: 'edit' })
                                cy.deleteEventOnCal('recurring', 'individual', eventName)
                                cy.wait('@waitForDelete')
                                cy.wait('@getActivities')
                                cy.reload()
                                cy.wait('@getActivities')
                                cy.get(recurringSelector(eventName))
                                    .should('have.length', length - 1)
                                cy.removeEventAPI(eventId, true, userData)
                            })
                    })
                })

                it('delete all daily recurring events', () => {
                    const eventName = `DAILY RECURRING_${stringGen(6)}`
                    const eventData = {
                        subscriberId: subscriberId,
                        globalUserId: salesRepGlobalUserId,
                        id: salesRepUserId,
                        userName: salesRepName,
                        name: eventName,
                        isAllDay: false,
                        isRecurring: true,
                        recurringOccurence: 'Daily',
                        startTime: `${moment().format('YYYY-MM-DD')} 09:00`,
                        endTime: `${moment().format('YYYY-MM-DD')} 10:00`
                    }
                    cy.addRecurringEvent(eventData).then((response) => {
                        const eventId = response.body
                        cy.intercept(`/api/CalendarEvent/DeleteCalendarEvent/?calendarEventId=**`).as('waitForDelete')
                        cy.intercept('/api/activity/GetActivitiesForCalendar/').as('getActivities')
                        cy.reload()
                        cy.wait('@getActivities')
                        cy.selectFirstRecurring(eventName)
                        cy.viewEventModalOverviewEditClose({ eventName: eventName, type: 'edit' })
                        cy.deleteEventOnCal('recurring', 'all', eventName)
                        cy.wait('@waitForDelete')
                        cy.wait('@getActivities')
                        cy.reload()
                        cy.wait('@getActivities')
                        cy.get(recurringSelector(eventName))
                            .should('not.exist')
                        cy.prevNextToggle('next')
                        cy.get(recurringSelector(eventName))
                            .should('not.exist')
                    })
                })
            })

            context('weekly recurring events', () => {
                const eventName = `Weekly - ${stringGen(4)}`
                const weeklyEvent = {
                    eventTitle: eventName,
                }

                before(() => {
                    cy.intercept({
                        method: 'POST',
                        url: '/api/CalendarEvent/SaveCalendarEvent',
                    }).as('newCalID')
                    cy.intercept({
                        method: 'POST',
                        url: '/api/activity/GetActivitiesForCalendar/',
                    }).as('getActivities')
                    cy.reload()
                    cy.openEventForm()
                })

                it('add weekly recurring event', () => {
                    cy.fillForm(eventForm, weeklyEvent)
                    cy.recurringEventOption('Weekly')
                    cy.saveEvent()
                    cy.wait('@newCalID').then((xhr) => {
                        cy.wait('@getActivities')
                        cy.checkRecurringEvents(eventName, 0)
                        cy.prevNextToggle('next')
                        cy.checkRecurringEvents(eventName, 3)
                        cy.removeEventAPI(xhr.response.body, true, userData)
                    })
                })

                it('delete one weekly recurring event', () => {
                    const eventName = `WEEKLY RECURRING_${stringGen(6)}`
                    const eventData = {
                        subscriberId: subscriberId,
                        globalUserId: salesRepGlobalUserId,
                        id: salesRepUserId,
                        userName: salesRepName,
                        name: eventName,
                        isAllDay: false,
                        isRecurring: true,
                        recurringOccurence: 'Weekly',
                        startTime: `${moment().format('YYYY-MM-DD')} 09:00`,
                        endTime: `${moment().format('YYYY-MM-DD')} 10:00`
                    }
                    cy.addRecurringEvent(eventData).then((response) => {
                        const eventId = response.body

                        cy.intercept({
                            method: 'GET',
                            url: `/api/CalendarEvent/GetCalendarEvent?calendarEventId=${eventId}&userId=${salesRepUserId}&subscriberId=${subscriberId}`
                        }).as('selectEvent')
                        cy.intercept(`/api/CalendarEvent/DeleteCalendarEvent/?calendarEventId=${eventId}&deleteRecurring=${false}&userId=${salesRepUserId}&subscriberId=${subscriberId}&cancellationEmails=false`).as('waitForDelete')
                        cy.intercept('/api/activity/GetActivitiesForCalendar/').as('getActivities')
                        cy.reload()
                        cy.wait('@getActivities')
                        cy.get(`.fc-content:contains("${eventName}")`)
                            .its('length')
                            .then((length) => {
                                console.log(length)

                                cy.selectFirstRecurring(eventName)
                                cy.viewEventModalOverviewEditClose({ eventName: eventName, type: 'edit' })
                                cy.wait('@selectEvent')
                                cy.deleteEventOnCal('recurring', 'individual', eventName)
                                cy.wait('@waitForDelete')
                                cy.wait('@getActivities')
                                cy.reload()
                                cy.wait('@getActivities')
                                cy.get(recurringSelector(eventName))
                                    .should('have.length', length - 1)
                                cy.removeEventAPI(eventId, true, userData)
                            })
                    })
                })

                it('delete all weekly recurring events', () => {
                    const eventName = `WEEKLY RECURRING_${stringGen(6)}`
                    const eventData = {
                        subscriberId: subscriberId,
                        globalUserId: salesRepGlobalUserId,
                        id: salesRepUserId,
                        userName: salesRepName,
                        name: eventName,
                        isAllDay: false,
                        isRecurring: true,
                        recurringOccurence: 'Weekly',
                        startTime: `${moment().format('YYYY-MM-DD')} 09:00`,
                        endTime: `${moment().format('YYYY-MM-DD')} 10:00`
                    }
                    cy.addRecurringEvent(eventData).then((response) => {
                        const eventId = response.body
                        cy.intercept(`/api/CalendarEvent/DeleteCalendarEvent/?calendarEventId=${eventId}&deleteRecurring=${true}&userId=${salesRepUserId}&subscriberId=${subscriberId}&cancellationEmails=false`).as('waitForDelete')
                        cy.intercept('/api/activity/GetActivitiesForCalendar/').as('getActivities')
                        cy.intercept({
                            method: 'GET',
                            url: `/api/CalendarEvent/GetCalendarEvent?calendarEventId=${eventId}&userId=${salesRepUserId}&subscriberId=${subscriberId}`
                        }).as('selectEvent')

                        cy.reload()
                        cy.wait('@getActivities')
                        cy.selectFirstRecurring(eventName)
                        cy.viewEventModalOverviewEditClose({ eventName: eventName, type: 'edit' })
                        cy.wait('@selectEvent')
                        cy.deleteEventOnCal('recurring', 'all', eventName)
                        cy.wait('@waitForDelete')
                        cy.wait('@getActivities')
                        cy.reload()
                        cy.wait('@getActivities')
                        cy.get(recurringSelector(eventName))
                            .should('not.exist')
                        cy.prevNextToggle('next')
                        cy.get(recurringSelector(eventName))
                            .should('not.exist')
                    })
                })
            })

            context('monthly recurring events', () => {
                const eventName = `Monthly - ${stringGen(4)}`
                const monthlyEvent = {
                    eventTitle: eventName,
                }

                before(() => {
                    cy.intercept({
                        method: 'POST',
                        url: '/api/CalendarEvent/SaveCalendarEvent',
                    }).as('newCalID')
                    cy.intercept({
                        method: 'POST',
                        url: '/api/activity/GetActivitiesForCalendar/',
                    }).as('getActivities')
                    cy.reload()
                    cy.openEventForm()
                })

                it('add monthly recurring event', () => {
                    cy.fillForm(eventForm, monthlyEvent)
                    cy.recurringEventOption('Monthly')
                    cy.saveEvent()
                    cy.wait('@newCalID').then((xhr) => {
                        cy.wait('@getActivities')
                        cy.get(recurringSelector(eventName))
                            .should('have.length.at.least', 1)
                        cy.prevNextToggle('next')
                        cy.get('.fc-center > h2').should('have.text', moment().add(1, 'months').format('MMMM YYYY'))
                        cy.get(recurringSelector(eventName))
                            .should('have.length.at.least', 1)
                        cy.prevNextToggle('next')
                        cy.get('.fc-center > h2').should('have.text', moment().add(2, 'months').format('MMMM YYYY'))
                        cy.get(recurringSelector(eventName))
                            .should('have.length.at.least', 1)

                        cy.removeEventAPI(xhr.response.body, true, userData)
                    })
                })

                it('delete one monthly recurring event', () => {
                    const eventName = `MONTHLY ${stringGen(6)}`
                    const eventData = {
                        subscriberId: subscriberId,
                        globalUserId: salesRepGlobalUserId,
                        id: salesRepUserId,
                        userName: salesRepName,
                        name: eventName,
                        isAllDay: false,
                        isRecurring: true,
                        recurringOccurence: 'Monthly',
                        startTime: `${moment().format('YYYY-MM-DD')} 09:00`,
                        endTime: `${moment().format('YYYY-MM-DD')} 10:00`
                    }
                    cy.addRecurringEvent(eventData).then((response) => {
                        cy.wait(2000)
                        const eventId = response.body
                        cy.intercept({
                            method: 'GET',
                            url: `/api/CalendarEvent/GetCalendarEvent?calendarEventId=${eventId}&userId=${salesRepUserId}&subscriberId=${subscriberId}`
                        }).as('selectEvent')
                        cy.intercept(`/api/CalendarEvent/DeleteCalendarEvent/?calendarEventId=${eventId}&deleteRecurring=${false}&userId=${salesRepUserId}&subscriberId=${subscriberId}&cancellationEmails=false`).as('waitForDelete')
                        cy.intercept('/api/activity/GetActivitiesForCalendar/').as('getActivities')
                        cy.reload()
                        cy.wait('@getActivities')
                        cy.selectFirstRecurring(eventName)
                        cy.viewEventModalOverviewEditClose({ eventName: eventName, type: 'edit' })
                        cy.wait('@selectEvent')
                        cy.deleteEventOnCal('recurring', 'individual', eventName)
                        cy.wait('@waitForDelete')
                        cy.wait('@getActivities')
                        cy.reload()
                        cy.wait('@getActivities')
                        cy.get(recurringSelector(eventName))
                            .should('have.length.lessThan', 2)
                        cy.prevNextToggle('next')
                        cy.get(recurringSelector(eventName))
                            .should('have.length.at.most', 2)
                            .should('have.length.at.least', 1)

                        cy.removeEventAPI(eventId, true, userData)
                    })
                })

                it('delete all monthly recurring events', () => {
                    const eventName = `MONTHLY ${stringGen(6)}`
                    const eventData = {
                        subscriberId: subscriberId,
                        globalUserId: salesRepGlobalUserId,
                        id: salesRepUserId,
                        userName: salesRepName,
                        name: eventName,
                        isAllDay: false,
                        isRecurring: true,
                        recurringOccurence: 'Monthly',
                        startTime: `${moment().format('YYYY-MM-DD')} 09:00`,
                        endTime: `${moment().format('YYYY-MM-DD')} 10:00`
                    }
                    cy.addRecurringEvent(eventData).then((response) => {
                        const eventId = response.body
                        cy.intercept({
                            method: 'GET',
                            url: `/api/CalendarEvent/GetCalendarEvent?calendarEventId=${eventId}&userId=${salesRepUserId}&subscriberId=${subscriberId}`
                        }).as('selectEvent')
                        cy.intercept(`/api/CalendarEvent/DeleteCalendarEvent/?calendarEventId=${eventId}&deleteRecurring=${true}&userId=${salesRepUserId}&subscriberId=${subscriberId}&cancellationEmails=false`).as('waitForDelete')
                        cy.intercept('/api/activity/GetActivitiesForCalendar/').as('getActivities')
                        cy.reload()
                        cy.wait('@getActivities')
                        cy.selectFirstRecurring(eventName)
                        cy.viewEventModalOverviewEditClose({ eventName: eventName, type: 'edit' })
                        cy.wait('@selectEvent')
                        cy.deleteEventOnCal('recurring', 'all', eventName)
                        cy.wait('@waitForDelete')
                        cy.wait('@getActivities')
                        cy.reload()
                        cy.wait('@getActivities')
                        cy.get(recurringSelector(eventName))
                            .should('not.exist')
                        cy.prevNextToggle('next')
                        cy.get(recurringSelector(eventName))
                            .should('not.exist')
                        cy.prevNextToggle('next')
                        cy.get(recurringSelector(eventName))
                            .should('not.exist')
                    })
                })
            })
        })

        context('tasks', () => {
            context('functionality', () => {
                before(() => {
                    cy.visit(EVENT_LIST_URL)
                    cy.openNewTaskForm()
                })

                it('add a task via calendar', () => {
                    cy.intercept({
                        url: '/api/task/SaveTask',
                        method: 'POST',
                    }).as('saveTask')
                    let newTask = {
                        taskTitle: `New Task ${stringGen(5)}`,
                        taskDescription: 'Test Task Description',
                        taskDueDate: moment().format('MM/DD/YYYY'),
                    }
                    cy.intercept({
                        url: '/api/activity/GetActivitiesForCalendar/',
                        method: 'POST',
                    }).as('getActivities')
                    cy.addTaskCalendar(newTask)
                    cy.wait('@saveTask').then((xhr) => {
                        cy.wait('@getActivities')
                        cy.get('.fc-month-view').contains(newTask.taskTitle)
                        cy.deleteTaskAPI(xhr.response.body, salesRepGlobalUserId, subscriberId)
                    })
                })

                it('remove task via calendar', () => {
                    cy.intercept('/api/activity/GetActivitiesForCalendar/').as('getActivities')
                    const taskData = {
                        subscriberId,
                        globalUserId: salesRepGlobalUserId,
                        taskName: `EVENT TASK ${stringGen(4)}`,
                        dueDate: moment().format('DD-MMM-YY')
                    }
                    cy.addTaskAPIUsers(taskData).then((response) => {
                        cy.intercept(`/api/Task/GetTask?taskId=${response.body}&subscriberId=${subscriberId}`).as('getTask')
                        cy.visit(EVENT_LIST_URL)
                        cy.toggleFilters('tasks')
                        cy.get('.fc-month-view')
                            .contains(taskData.taskName)
                            .click()
                        cy.get('[data-cypress-id="task-view-button-edit"]')
                            .click()
                        cy.wait('@getTask')
                        cy.get('#TaskAddEdit_btnTaskDelete')
                            .click()
                        cy.deleteModal('Delete Task!', 'Are you sure you want to delete this task?', 'delete')
                        cy.wait('@getActivities')
                        cy.get(`.fc-content:contains("${taskData.taskName}")`)
                            .should('not.exist')
                    })
                })
            })

            context('filtering', () => {
                const monthviewTester = (title) => cy.get('.fc-month-view').contains(title)
                const notVisible = (title) => cy.get('.fc-month-view').should('not.contain.text', title)
                let eventId
                let taskId
                const taskName = `task filter ${stringGen(5)}`
                const eventName = `event filter ${stringGen(5)}`
                const newEvent = {
                    subscriberId: subscriberId,
                    name: eventName,
                    id: salesRepUserId,
                    globalUserId: salesRepGlobalUserId,
                    userName: salesRepName,
                    globalCompanyId: '',
                    startTime: `${moment().format('YYYY-MM-DD')} 23:00`,
                    endTime: `${moment().format('YYYY-MM-DD')} 23:30`,
                }

                before(() => {
                    cy.request({
                        url: '/api/task/SaveTask',
                        method: 'POST',
                        body: {
                            'task': {
                                'SubscriberId': subscriberId,
                                'UserIdGlobal': salesRepGlobalUserId,
                                'OwnerUserIdGlobal': salesRepGlobalUserId,
                                'UpdateUserIdGlobal': salesRepGlobalUserId,
                                'TaskName': taskName,
                                'Description': 'test',
                                'DueDate': moment().format('DD-MMM-YY'),
                                'CompanyIdGlobal': null,
                                'DealIds': null,
                            },
                        },
                    }).then((response) => {
                        taskId = response.body
                    })
                    cy.addNewEventAPI(false, newEvent).then((response) => {
                        eventId = response.body
                    })
                    cy.wait(5000)
                    cy.visit(EVENT_LIST_URL)
                    cy.reload()
                })

                after(() => {
                    cy.deleteTaskAPI(taskId, salesRepGlobalUserId, subscriberId)
                    cy.removeEventAPI(eventId, false, userData)
                })

                it('filter tasks and events', () => {
                    cy.toggleFilters('tasks')
                    monthviewTester(taskName)
                    monthviewTester(eventName)
                })

                it('filter only tasks', () => {
                    cy.toggleFilters('events')
                    monthviewTester(taskName)
                    notVisible(eventName)
                })

                it('filter only events', () => {
                    cy.toggleFilters('tasks')
                    cy.toggleFilters('events')
                    monthviewTester(eventName)
                    notVisible(taskName)
                })

                it('turn both filters off', () => {
                    cy.toggleFilters('events')
                    notVisible(taskName)
                    notVisible(eventName)
                })
            })
        })
    })

    describe('event form', () => {
        before(() => {
            cy.visit(EVENT_LIST_URL)
            cy.openEventForm()
        })

        it('event name validation', () => {
            cy.saveEvent()
            cy.eventFormValidation('eventName')
        })

        it('event guests invalid email validation', () => {
            cy.eventFormValidation('guestEmail')
        })

        it('changing event category changes time block colour', () => {
            cy.eventTypeTimeBlockChange('colourChange')
        })

        it('changing event time moves time block', () => {
            cy.eventTypeTimeBlockChange('timeChange')
        })

        it('add new event category and displays in dropdown with corresponding colours', () => {
            const newCatName = `New Cat ${stringGen(4)}`
            const colour = '#ff00ff'

            cy.request({
                url: '/api/CalendarEvent/SaveEventCategory',
                method: 'POST',
                body: {
                    'SubscriberId': subscriberId,
                    'UpdateUserId': salesRepUserId,
                    'eventCategoryId': 0,
                    'CategoryColor': colour,
                    'CategoryName': newCatName,
                },
            }).then((response) => {
                const eventCatId = response.body

                cy.log(response.body)


                cy.reload()
                cy.openEventForm()
                cy.log(eventCatId)
                cy.dropAndVerifyCatDropdown('rgb(255, 0, 255)', newCatName)

                cy.request({
                    url: `/api/CalendarEvent/DeleteEventCategory/?id=${eventCatId}&userId=${salesRepUserId}&subscriberId=${subscriberId}`,
                    method: 'GET'
                })
            })
        })

        it('add attachment to event form', () => {
            cy.addAttachment()
        })

        it('delete attachement from event', () => {
            cy.get('.attachment .icon-Delete')
                .click()

            cy.deleteModal('Delete Attachment!', 'Are you sure you want to delete this attachment?', 'delete')

            cy.get('.attachment:nth-of-type(2) .col-file-name a')
                .should('not.exist')
        })

        it('close event form', () => {
            cy.closeEventForm()
            cy.wait(2000)
            cy.get('#divCalendarEventWrapper')
                .should('not.be.visible')
        })

        it.skip('select date on calendar month view and see that date in event form', () => {
            // skipped because of this bug - https://trello.com/c/fr6Nc7B2/1158-calendar-selecting-a-date-on-the-calendar-page-intermittently-doesnt-display-the-event-form
            const futureDateSelector = `.fc-day.fc-widget-content.fc-future[data-date="${moment().add(1, 'days').format('YYYY-MM-DD')}"]`

            cy.reload()
            cy.wait(500)
            cy.get(futureDateSelector)
                .click()

            const date = moment().add(1, 'days').format('ddd, DD MMMM, YYYY')

            cy.wait(500)
            cy.get('.fc-left > h2')
                .should('have.text', date)
        })
    })

    describe('calendar layout', () => {
        const headerSelector = (header) => cy.get('.fc-center > h2').should('have.text', header)

        describe('week view', () => {
            const randomId = `${stringGen(4)}${numGen(3)}`
            const eventTitle = `Event - ${randomId}`
            const newEvent = {
                eventTitle,
                eventLocation: 'Los Angeles',
                eventStartDate: moment().format('DD-MMM-YY'),
                eventEndDate: moment().format('DD-MMM-YY'),
                eventStartTime: '8:00am',
                eventEndTime: '8:30am',
                eventReminder: '5 Minutes',
            }
            // let dateFormat
            let todaysDateFormat
            const todaysDate = moment()
            const from_date = moment().startOf('week')
            const to_date = moment().endOf('week')


            if (moment().startOf('week').format('MMM') !== moment().endOf('week').format('MMM')) {
                todaysDateFormat = 'MMM D'
            } else {
                todaysDateFormat = 'D'
            }

            const todayWeekFormat = () => headerSelector(`${moment().startOf('week').format('MMM D')} – ${moment().endOf('week').format(`${todaysDateFormat}, YYYY`)}`)

            // const weekViewDateFormat =
            before(() => {
                cy.visit(EVENT_LIST_URL)
            })

            it('toggle to week view and container changes', () => {
                cy.toggleCalendarView('week')
            })

            it('toggle to past weeks', () => {
                let dateFormat

                todayWeekFormat()
                cy.prevNextToggle('prev')

                if (from_date.format('MMM') !== todaysDate.startOf('week').subtract(1, 'weeks').format('MMM')) {
                    dateFormat = 'MMM D'
                } else {
                    dateFormat = 'D'
                }

                headerSelector(`${from_date.subtract(1, 'weeks').format('MMM D')} – ${to_date.subtract(1, 'weeks').format(`${dateFormat}, YYYY`)}`)
            })

            it('toggle to future weeks', () => {
                let dateFormat

                // comment while above is skipped
                cy.prevNextToggle('next')
                todayWeekFormat()
                cy.prevNextToggle('next')

                if (moment().endOf('week').format('MMM') !== moment().endOf('week').add(1, 'weeks').format('MMM')) {
                    dateFormat = 'MMM D'
                } else {
                    dateFormat = 'D'
                }

                cy.log(dateFormat)
                headerSelector(`${moment().startOf('week').add(1, 'weeks').format('MMM D')} – ${moment().endOf('week').add(1, 'weeks').format(`${dateFormat}, YYYY`)}`)
            })

            it('select today button to return to current week', () => {
                cy.prevNextToggle('today')
                todayWeekFormat()
            })

            it('add event and view in week view', () => {
                cy.intercept({
                    method: 'POST',
                    url: '/api/CalendarEvent/SaveCalendarEvent',
                }).as('newCalID')
                const eventData = {
                    timeFrom: '8:00 AM',
                    timeTo: '8:30 AM',
                    eventTime: '8:00 - 8:30',
                    eventTitle,
                }

                cy.addEventOnCal(newEvent, false)
                cy.wait('@newCalID').then((xhr) => {
                    // calId = xhr.response.body;
                    cy.verifyEvent('week', eventData)
                    cy.removeEventAPI(xhr.response.body, false, userData)
                })
            })
        })

        describe('day view', () => {
            const randomId = `${stringGen(4)}${numGen(3)}`
            let dayDateFormat = 'MMMM D, YYYY'
            const eventTitle = `Event - ${randomId}`
            const newEvent = {
                eventTitle,
                eventLocation: 'Los Angeles',
                eventStartDate: moment().format('DD-MMM-YY'),
                eventEndDate: moment().format('DD-MMM-YY'),
                eventStartTime: '8:00am',
                eventEndTime: '8:30am',
                eventReminder: '5 Minutes',
            }
            const todayDayFormat = () => headerSelector(`${moment().format(dayDateFormat)}`)

            before(() => {
                cy.visit(EVENT_LIST_URL)
            })

            it('toggle to day view and container changes', () => {
                cy.toggleCalendarView('day')
            })

            it('toggle to past days', () => {
                todayDayFormat()
                cy.prevNextToggle('prev')
                headerSelector(moment().subtract(1, 'days').format(dayDateFormat))
            })

            it('toggle to future days', () => {
                cy.prevNextToggle('next')
                todayDayFormat()
                cy.prevNextToggle('next')
                headerSelector(moment().add(1, 'days').format(dayDateFormat))
            })

            it('select today button to return to current day', () => {
                cy.prevNextToggle('today')
                todayDayFormat()
            })

            it('add event and view in day view', () => {
                cy.intercept({
                    method: 'POST',
                    url: '/api/CalendarEvent/SaveCalendarEvent',
                }).as('newCalID')
                const eventData = {
                    timeFrom: '8:00 AM',
                    timeTo: '8:30 AM',
                    eventTime: '8:00 - 8:30',
                    eventTitle,
                }

                cy.addEventOnCal(newEvent, false)
                cy.wait('@newCalID').then((xhr) => {
                    // calId = xhr.response.body;
                    cy.verifyEvent('day', eventData)
                    cy.removeEventAPI(xhr.response.body, false, userData)
                })
            })
        })

        describe('month view', () => {
            const randomId = `${stringGen(4)}${numGen(3)}`
            const monthDateFormat = 'MMMM YYYY'
            const eventTitle = `Event - ${randomId}`
            const newEvent = {
                eventTitle,
                eventLocation: 'Los Angeles',
                eventStartDate: moment().format('DD-MMM-YY'),
                eventEndDate: moment().format('DD-MMM-YY'),
                eventStartTime: '8:00am',
                eventEndTime: '8:30am',
                eventReminder: '5 Minutes',
            }
            const monthFormat = () => headerSelector(`${moment().format(monthDateFormat)}`)

            before(() => {
                cy.visit(EVENT_LIST_URL)
            })

            it('toggle to month view and container changes', () => {
                cy.toggleCalendarView('month')
            })

            it('toggle to past months', () => {
                monthFormat()
                cy.prevNextToggle('prev')
                headerSelector(moment().subtract(1, 'months').format(monthDateFormat))
            })

            it('toggle to future months', () => {
                cy.prevNextToggle('next')
                monthFormat()
                cy.prevNextToggle('next')
                headerSelector(moment().add(1, 'months').format(monthDateFormat))

            })

            it('select today button to return to current month', () => {
                cy.prevNextToggle('today')
                monthFormat()
            })

            it('add event and view in month view', () => {
                cy.intercept({
                    method: 'POST',
                    url: '/api/CalendarEvent/SaveCalendarEvent',
                }).as('newCalID')
                const eventData = {
                    timeFrom: '8:00 AM',
                    timeTo: '8:30 AM',
                    eventTime: '8a',
                    eventTitle,
                }

                cy.addEventOnCal(newEvent, false)
                cy.wait('@newCalID').then((xhr) => {
                    // calId = xhr.response.body;
                    cy.verifyEvent('month', eventData)
                    cy.removeEventAPI(xhr.response.body, false, userData)
                })
            })
        })
    })
})
