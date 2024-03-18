import moment from 'moment'
import { eventForm } from '../../forms'
import { stringGen } from '../helpers'

const eventsSelectors = {
    noEventsCallToAction: '[data-cypress-testing-id="call-to-action-add-event"]',
    addEvent: {
        addEventLinkHeader: '#btnAddEvent',
        addEventLinkBody: '.no-events.empty-box.empty_event .primary-btn.W200',
        saveEvent: '#btnSave',
        deleteEvent: '.delete-link.pull-right[data-action="delete-event"]',
        deleteConfirmButton: '.swal2-confirm.swal2-styled',
    },

    eventForm: {
        closeEvent: '.closeX[data-action="cancel-event"]',
        eventName: '#txtEventTitle',
        eventAddGuests: '#select2-ddlInvites-container',
        eventGuestsInput: '.select2-search.select2-search--dropdown .select2-search__field',
        eventCategoriesDropdown: '.right-box:nth-child(2) .form-group.filled:nth-child(1) .select2.select2-container.select2-container--classic',
        eventTimeBlock: 'a.fc-time-grid-event.fc-v-event.fc-event.fc-start.fc-end',
        recurringCheck: '#repeats',
        recurringDropdown: '#select2-ddlRepeat-container',
        attachment: '#calendarAttachmentsBoxWrapper',
        attachmentName: '.attachment:nth-of-type(2) .col-file-name',
    },

    eventModal: {
        container: '#calendarEventViewDialog',
        eventTitle: '[data-field-id="Subject"]',
        categoryType: '[data-field-id="CategoryIds"]',
        publicPrivate: '[data-field-id="PublicPrivate"]',
        busyFree: '[data-field-id="BusyFree"]',
        companyName: '[data-field-id="CompanyName"]',
        locationName: '[data-field-id="Location"]',
        dealName: '[data-field-id="DealNames"]',
        startDateTimeName: '[data-field-id="StartDateTime"]',
        endDateTimeName: '[data-field-id="EndDateTime"]',
        recurringName: '[data-field-id="IsRecurring"]',
        reminderName: '[data-field-id="ReminderMinutes"]',
        guests: '[data-list-type="guests"]',
        attachments: '[data-list-type="attachments"]',
        description: '[data-field-id="Description"]',
        edit: '#CalendarEventView_btnEdit',
        close: '#CalendarEventView_btnClose',
    },
}

const { addEventLinkHeader, addEventLinkBody, saveEvent, deleteEvent, deleteConfirmButton } = eventsSelectors.addEvent
const { closeEvent, eventName, eventAddGuests, eventGuestsInput, eventCategoriesDropdown, eventTimeBlock, recurringCheck, recurringDropdown, attachment, attachmentName } = eventsSelectors.eventForm
const { container, eventTitle, categoryType, publicPrivate, busyFree, companyName, locationName, dealName, startDateTimeName, endDateTimeName, recurringName, reminderName, guests, attachments, description, edit, close } = eventsSelectors.eventModal

Cypress.Commands.add('skipWaitingForInvitationEmail', (type) => {
    cy.get('h2.swal2-title')
        .should('have.text', 'Send Invitations')

    switch (type) {
        case 'dont send':
            cy.get('button.swal2-cancel')
                .contains(`Don't Send`)
                .click()
            break

        case 'send':
            cy.get('button.swal2-confirm')
                .contains(`Send`)
                .click()
    }
})

Cypress.Commands.add('validateEventOverviewModal', (data,
    {
        eventHeader,
        visibility,
        publicPrivateIconClass,
        appearAs,
        busyFreeIconClass,
        isAllDay,
        allDayDate,
        startDateTime,
        endDateTime,
        eventOwnerUsername,
        categoryName,
        categoryColour,
        companyNameDetails,
        location,
        dealNameDetails,
        reminderTime,
        attachmentName,
        descriptionBody,
    }) => {
    cy.get(eventTitle)
        .should('have.text', eventHeader)
    cy.get(`${publicPrivate} span`)
        .should('have.text', visibility)
    cy.get(`${publicPrivate} i`)
        .should('have.class', publicPrivateIconClass)
    cy.get(`${busyFree} span`)
        .should('have.text', appearAs)
    cy.get(`${busyFree} i`)
        .should('have.class', busyFreeIconClass)

    if (isAllDay == false) {
        cy.get(startDateTimeName)
            .contains(startDateTime, { matchCase: false })
        cy.get(`${startDateTimeName} i`)
            .should('have.class', 'fa-calendar-o')
        cy.get(endDateTimeName)
            .contains(endDateTime, { matchCase: false })
        cy.get(`${endDateTimeName} i`)
            .should('have.class', 'fa-calendar-o')
    } else {
        cy.get(startDateTimeName)
            .contains('all day')

        cy.get(startDateTimeName)
            .contains(allDayDate)
    }

    if (data) {
        cy.get(categoryType)
            .contains(categoryName)
        cy.get(`${guests}`)
            .contains(eventOwnerUsername)
        cy.get(`${categoryType} i`)
            .should('have.css', 'color')
            .and('eq', categoryColour)
        cy.get(companyName)
            .contains(companyNameDetails)
        cy.get(`${companyName} i`)
            .should('have.class', 'fa-building-o')
        cy.get(locationName)
            .contains(location)
        cy.get(`${locationName} i`)
            .should('have.class', 'fa-map-marker')
        cy.get(dealName)
            .contains(dealNameDetails)
        cy.get(`${dealName} i`)
            .should('have.class', 'fa-bullseye')
        cy.get(reminderName)
            .contains(reminderTime)
        cy.get(`${reminderName} i`)
            .should('have.class', 'fa-bell-o')
        cy.get(attachments)
            .contains(attachmentName)
        cy.get(description)
            .should('have.text', descriptionBody)
    } else {
        //attachments container
        cy.get('.modal-view-content > .row:nth-of-type(2) > .col:nth-of-type(2)')
            .contains('NO ITEMS')
    }
})
Cypress.Commands.add('viewEventModalOverviewEditClose', ({ eventName, type }) => {
    cy.get(eventTitle)
        .should('have.text', eventName)
    switch (type) {
        case 'edit':
            cy.get(edit)
                .click()
            break

        case 'close':
            cy.get(close)
                .click()

            cy.get(container)
                .should('not.be.visible')
            break

        case 'readOnly':
            cy.get(edit)
                .should('not.be.visible')
                .and('have.class', 'hide')
            break
    }
})

Cypress.Commands.add('recurringEventOption', (recurringString) => {
    const recurringInput = {
        eventRepeats: recurringString,
    }

    cy.get(recurringDropdown)
        .should('not.be.visible')
    cy.get(recurringCheck)
        .click({ force: true })
    cy.get(recurringDropdown)
        .should('be.visible')

    cy.fillForm(eventForm, recurringInput)
})

Cypress.Commands.add('saveEvent', () => {
    cy.get(saveEvent)
        .click({ force: true })
})

Cypress.Commands.add('closeEventForm', () => {
    cy.get(closeEvent).click()
})

Cypress.Commands.add('addAttachment', () => {
    const fileName = 'images/sloth.jpg'

    cy.get(attachment)
        .click()

    cy.get('.modal-title')
        .contains('Attach File')
    cy.get('#drop-wrp').selectFile('cypress/fixtures/images/sloth.jpg', {
        action: 'drag-drop'
      })
    cy.wait(4000)
    cy.get('#attachFile').click()

    cy.get(attachmentName)
        .should('have.text', 'sloth.jpg')
})

Cypress.Commands.add('checkInviteeList', (inviteeName) => {
    cy.get('#tblInvites')
        .contains(inviteeName)
})

Cypress.Commands.add('addNewCompanyToEvent', (companyName) => {
    cy.get('#divEventCompanyContainer .select2-selection.select2-selection--single')
        .click()
    cy.get('.select2-search.select2-search--dropdown .select2-search__field')
        .type(companyName)
    cy.get('.select2-results__options > li')
        .should('have.length', 1)
    cy.get('#select2-ddlCompany-results')
        .contains(companyName)
        .click()
    cy.get('#select2-ddlCompany-container')
        .contains(companyName)
})

Cypress.Commands.add('addNewDealToEvent', (newDealName) => {
    cy.get('.select2.select2-container.select2-container--classic:nth-of-type(2)')
        .click()
    cy.get('.select2-results__options > li')
        .should('have.length', 1)
    cy.get('#select2-ddlDeal-results')
        .contains(newDealName)
        .click()
    cy.get('.select2.select2-container.select2-container--classic:nth-of-type(2)')
        .contains(newDealName)  

})

Cypress.Commands.add('eventFormValidation', (type) => {
    switch (type) {
        case 'eventName':
            cy.get(`${eventName}[class="input-field error"]`)
                .should('have.css', 'border-color')
                .and('eq', 'rgb(205, 43, 30)')
            break

        case 'guestEmail':
            const guestInputString = 'srdtg'

            cy.get(eventAddGuests).click()
            cy.get(eventGuestsInput)
                .type(`${guestInputString}{enter}`, { delay: 500 })
            // cy.addGuestToEvent(guestInputString)
            // cy.wait(2000)
            // cy.get(eventGuestsInput)
            //   .type('{enter}')
            cy.checkValidationModal('Invalid Email Address!')
            break
    }
})

Cypress.Commands.add('addGuestToEvent', (guestInputString) => {
    cy.get(eventAddGuests).click()
    cy.get(eventGuestsInput)
        .type(`${guestInputString}`)
})

Cypress.Commands.add('eventTypeTimeBlockChange', (type) => {
    switch (type) {
        case 'colourChange':
            // add event cat
            const newCatName = `New Cat ${stringGen(4)}`
            const colour = '#ff00ff'

            cy.request({
                url: '/api/CalendarEvent/SaveEventCategory',
                method: 'POST',
                body: {
                    'SubscriberId': '283',
                    'UpdateUserId': '16036',
                    'eventCategoryId': 0,
                    'CategoryColor': colour,
                    'CategoryName': newCatName,
                },
            }).then((response) => {
                const eventCatId = response.body
                const eventTime = {
                    eventStartTime: '9:00am',
                    eventEndTime: '10:30am',
                }

                cy.reload()
                cy.openEventForm()
                cy.get('ul.select2-selection__rendered > li.select2-selection__choice > span.select2-selection__choice__remove').click({ multiple: true })

                cy.fillForm(eventForm, eventTime)
                cy.get(eventCategoriesDropdown)
                    .click()

                cy.get('#select2-ddlCategories-results')
                    .contains(newCatName)
                    .click({ force: true })

                cy.get(eventTimeBlock)
                    .should('have.css', 'background-color')
                    .and('eq', 'rgb(255, 0, 255)')

                cy.request({
                    url: `/api/CalendarEvent/DeleteEventCategory/?id=${eventCatId}&userId=16036&subscriberId=283`,
                    method: 'GET',
                })
            })

            break

        case 'timeChange':
            const timeData = {
                eventStartTime: '9:00am',
                eventEndTime: '11:00am',
                eventReminder: '5 Minutes',
            }

            cy.fillForm(eventForm, timeData)

            cy.get(`${eventTimeBlock} .fc-time[data-full="9:00 AM - 11:00 AM"]`)
                .should('exist')
            break
    }
})

Cypress.Commands.add('dropAndVerifyCatDropdown', (colour, name) => {
    cy.get(eventCategoriesDropdown)
        .click()

    cy.get(`.select2-results__option  .fa.fa-square[style="color: ${colour}; margin-right: 6px;"]`)
        .should('exist')

    cy.get('.select2-results__option')
        .contains(name)

    cy.get(eventCategoriesDropdown)
        .click()
})

Cypress.Commands.add('deleteEventOnTab', (eventName, eventID) => {
    cy.selectEventFromTab(eventID)
    const modalData = {
        eventName,
        type: 'edit',
    }

    cy.viewEventModalOverviewEditClose(modalData)
    cy.selectDeleteButtonOnEvent()
    cy.get('.swal2-popup.swal2-modal.swal2-show')
        .should('be.visible')

    cy.get('.swal2-header').contains('Delete Event!')

    cy.get('.swal2-content').contains('Are you sure you want to delete this event?')

    cy.get(deleteConfirmButton)
        .contains('Yes, Delete')
        .click()
    cy.wait(5000)
})

Cypress.Commands.add('eventsTabList', (eventsListArray) => {
    cy.wait(2000)
    for (let i = 0; i < eventsListArray.length; i++) {
        cy.get(`#divEvents > div:nth-child(${i + 1})`)
            .contains(eventsListArray[i])
    }
})

Cypress.Commands.add('addEventOnTab', (newFormData, email) => {
    cy.selectAddEventHeader()
    cy.wait(6000)
    cy.fillForm(eventForm, newFormData)
    cy.get(saveEvent).click({ force: true })
    email === true ? cy.get('.swal2-cancel.left-cancel.swal2-styled').click() : cy.wait(100)
})

Cypress.Commands.add('addEventOnCal', (newFormData, email) => {
    cy.openEventForm()
    cy.fillForm(eventForm, newFormData)
    cy.saveEvent()
    email === true ? cy.get('.swal2-cancel.left-cancel.swal2-styled').click() : cy.wait(100)
})

Cypress.Commands.add('noEventsOnTab', () => {
    cy.get(eventsSelectors.noEventsCallToAction)
        .should('be.visible')
})

Cypress.Commands.add('selectAddEventHeader', () => {
    cy.get(addEventLinkHeader)
        .click()
})

Cypress.Commands.add('checkAllDay', () => {
    cy.get('#chkAllDay')
        .click({ force: true })
})

Cypress.Commands.add('removeEventAPI', (calID, recurring, { subscriberId, userId, globalUserId }) => {
    cy.request({
        method: 'GET',
        url: `api/activity/HardDeleteActivity/?activityId=${calID}&deleteRecurring=${recurring}&subscriberId=${subscriberId}`,
    })
})

Cypress.Commands.add('addNewEventAPI', (invitee, { subscriberId, name, id, globalUserId, userName, globalCompanyId, startTime, endTime, inviteeGlobalUserId, inviteeUserName }) => {
    if (invitee) {
        cy.request({
            method: 'POST',
            url: '/api/CalendarEvent/SaveCalendarEvent',
            body: {
                'CalendarEvent': {
                    'ActivityId': 0,
                    'SubscriberId': subscriberId,
                    'UserIdGlobal': globalUserId,
                    'UserId': id,
                    'UserName': userName,
                    'UpdateUserId': id,
                    'UpdateUserIdGlobal': globalUserId,
                    'OwnerUserId': id,
                    'OwnerUserIdGlobal': globalUserId,
                    'Subject': name,
                    'Description': '',
                    'IsAllDay': false,
                    'Location': '',
                    'BusyFree': 'Busy',
                    'PublicPrivate': 'Public',
                    'ReminderMinutes': '',
                    'IsRecurring': false,
                    'EventTimeZone': '',
                    'CompanyIdGlobal': globalCompanyId,
                    'StartDateTime': startTime,
                    'EndDateTime': endTime,
                    'DealIds': '',
                },
                'Invites': [
                    {
                        'AttendeeType': 'Organizer',
                        'InviteType': 'user',
                        'UserIdGlobal': globalUserId,
                        'UserName': userName,
                    },
                    {
                        'AttendeeType': 'Organizer',
                        'InviteType': 'user',
                        'UserIdGlobal': inviteeGlobalUserId,
                        'UserName': inviteeUserName,
                    },
                ],
                'Documents': [

                ],
                'NotifyInternalAttendees': false,
                'NotifyExternalAttendees': false,
                'SavingUserSubscriberId': subscriberId,
                'SavingUserId': id,
            },
        })
    } else {
        cy.request({
            method: 'POST',
            url: '/api/CalendarEvent/SaveCalendarEvent',
            body: {
                'CalendarEvent': {
                    'ActivityId': 0,
                    'SubscriberId': subscriberId,
                    'UserIdGlobal': globalUserId,
                    'CategoryId': 2769,
                    'CategoryIds': "2769",
                    'CategoryName': "Meeting External",
                    'UserId': id,
                    'UserName': userName,
                    'UpdateUserId': id,
                    'UpdateUserIdGlobal': globalUserId,
                    'OwnerUserId': id,
                    'OwnerUserIdGlobal': globalUserId,
                    'Subject': name,
                    'Description': '',
                    'IsAllDay': false,
                    'Location': '',
                    'BusyFree': 'Busy',
                    'PublicPrivate': 'Public',
                    'ReminderMinutes': '',
                    'IsRecurring': false,
                    'EventTimeZone': '',
                    'CompanyIdGlobal': globalCompanyId,
                    'StartDateTime': startTime,
                    'EndDateTime': endTime,
                    'DealIds': '',
                },
                'Invites': [],
                'Documents': [],
                'NotifyInternalAttendees': false,
                'NotifyExternalAttendees': false,
                'SavingUserSubscriberId': subscriberId,
                'SavingUserId': id,
            },
        })
    }
})

Cypress.Commands.add('addEventWithAllData', (globalCompanyId, { subscriberId, globalUserId, id, userName, name, description, isAllDay, location, isRecurring, startTime, endTime, dealId = '' }) => {
    cy.request({
        method: 'POST',
        url: '/api/CalendarEvent/SaveCalendarEvent',
        body: {
            'CalendarEvent': {
                'ActivityId': 0,
                'SubscriberId': subscriberId,
                'UserIdGlobal': globalUserId,
                'UserId': id,
                'UserName': userName,
                'UpdateUserId': id,
                'UpdateUserIdGlobal': globalUserId,
                'OwnerUserId': id,
                'OwnerUserIdGlobal': globalUserId,
                'Subject': name,
                'Description': description,
                'IsAllDay': isAllDay,
                'Location': location,
                'CategoryName': 'Meeting External',
                'CategoryColor': 'f2c748',
                'CategoryId': 2769,
                'CategoryIds': '2769',
                'BusyFree': 'Free',
                'PublicPrivate': 'Private',
                'ReminderMinutes': '15',
                'IsRecurring': isRecurring,
                'EventTimeZone': '',
                'CompanyIdGlobal': globalCompanyId,
                'StartDateTime': startTime,
                'EndDateTime': endTime,
                'DealIds': dealId,
            }, 'Invites': [
                { 'AttendeeType': 'Organizer', 'InviteType': 'user', 'UserIdGlobal': globalUserId, 'UserName': userName },
                { 'AttendeeType': 'Required', 'InviteType': 'external', 'Email': 'externalEmail@email.com' },
            ],
            'Documents': [
                { 'FileName': '158023.png', 'Title': '158023.png', 'SubscriberId': '283', 'UploadedBy': id, 'DocumentId': 18356, 'ActivityId': 0, 'DocumentBlobReference': '1a7a24bc-c74a-4ede-b09d-218c2a343930.png', 'DocumentContainerReference': 'temp', 'UploadUrl': 'https://crm6.blob.core.windows.net/temp/1a7a24bc-c74a-4ede-b09d-218c2a343930.png' },
            ],
            'NotifyInternalAttendees': false,
            'NotifyExternalAttendees': true,
            'SavingUserSubscriberId': subscriberId,
            'SavingUserId': id,
        },
    })
})

Cypress.Commands.add('addRecurringEvent', ({ subscriberId, globalUserId, id, userName, name, isAllDay, isRecurring, recurringOccurence, startTime, endTime }) => {
    cy.request({
        timeout: 120000,
        method: 'POST',
        url: '/api/CalendarEvent/SaveCalendarEvent',
        body: {
            'CalendarEvent': {
                'ActivityId': 0,
                'SubscriberId': subscriberId,
                'UserIdGlobal': globalUserId,
                'UserId': id,
                'UserName': userName,
                'UpdateUserId': id,
                'UpdateUserIdGlobal': globalUserId,
                'OwnerUserId': id,
                'OwnerUserIdGlobal': globalUserId,
                'Subject': name,
                'Description': "",
                'IsAllDay': isAllDay,
                'Location': "",
                'CategoryName': 'Meeting External',
                'CategoryColor': 'f2c748',
                'CategoryId': 2769,
                'CategoryIds': '2769',
                'BusyFree': 'Free',
                'PublicPrivate': 'Private',
                'ReminderMinutes': '15',
                'IsRecurring': isRecurring,
                'ReoccurrenceIncrementType': recurringOccurence,
                'EventTimeZone': '',
                'CompanyIdGlobal': '',
                'StartDateTime': startTime,
                'EndDateTime': endTime,
                'DealIds': '',
            }, 'Invites': [
                { 'AttendeeType': 'Organizer', 'InviteType': 'user', 'UserIdGlobal': globalUserId, 'UserName': userName }
            ],
            'Documents': [],
            'NotifyInternalAttendees': false,
            'NotifyExternalAttendees': false,
            'SavingUserSubscriberId': subscriberId,
            'SavingUserId': id,
        }
    })
})