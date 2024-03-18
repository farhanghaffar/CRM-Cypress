import moment from 'moment'

const calendarSelectors = {
    header: {
        addTaskBtn: '#btnAddTask',
        addEventBtn: '[data-action="add-event"]',
        taskFilter: '#chkTasks',
        eventFilter: '#chkEvents',
    },

    eventForm: {
        deleteButton: '[data-action="delete-event"]',
    },

    viewToggle: {
        monthView: '.fc-month-button.fc-button.fc-state-default.fc-corner-left',
        monthViewContainer: '.fc-view.fc-month-view.fc-basic-view',
        weekview: '.fc-agendaWeek-button.fc-button.fc-state-default',
        weekViewContainer: '.fc-view.fc-agendaWeek-view.fc-agenda-view',
        dayView: '.fc-agendaDay-button.fc-button.fc-state-default.fc-corner-right',
        dayViewContainer: '.fc-view.fc-agendaDay-view.fc-agenda-view',
        prevArrow: '.fc-prev-button.fc-button.fc-state-default.fc-corner-left[aria-label="prev"]',
        nextArrow: '.fc-next-button.fc-button.fc-state-default.fc-corner-right[aria-label="next"]',
        todayToggle: '.fc-today-button.fc-button.fc-state-default.fc-corner-left.fc-corner-right',
    },

    weekView: {
        weekTitle: '.fc-day-header.fc-widget-header.fc-today',
        weekEventTime: '.fc-content .fc-time',
        weekEventTitle: '.fc-content .fc-title',
    },

    dayView: {
        dayHeader: '.fc-day-header.fc-widget-header.fc-today',
    },

    monthView: {
        monthHeader: '#calendar .fc-center',
    },
}

const { addTaskBtn, addEventBtn, taskFilter, eventFilter } = calendarSelectors.header
const { deleteButton } = calendarSelectors.eventForm
const { monthView, monthViewContainer, weekview, weekViewContainer, dayView, dayViewContainer, prevArrow, nextArrow, todayToggle } = calendarSelectors.viewToggle
const { weekTitle, weekEventTime, weekEventTitle } = calendarSelectors.weekView
const { dayHeader } = calendarSelectors.dayView
const { monthHeader } = calendarSelectors.monthView

Cypress.Commands.add('toggleFilters', (type) => {
    cy.intercept({
        url: '/api/activity/GetActivitiesForCalendar/',
        method: 'POST',
    }).as('getActivities')
    switch (type) {
        case 'tasks':
            cy.get(taskFilter)
                .click({ force: true })
            cy.wait('@getActivities')
            break

        case 'events':
            cy.get(eventFilter)
                .click({ force: true })
            cy.wait('@getActivities')
            break
    }
})

Cypress.Commands.add('checkRecurringEvents', (recurringEventName, length) => {
    const recurringSelector = `.fc-content:contains("${recurringEventName}")`

    cy.get(recurringSelector)
        .should('have.length.greaterThan', length)
})

Cypress.Commands.add('openNewTaskForm', () => {
    cy.get(addTaskBtn)
        .click()

    cy.get('#addTaskDialog')
        .should('be.visible')
})

Cypress.Commands.add('selectFirstRecurring', (recurringEventName) => {
    const recurringSelector = `.fc-content:contains("${recurringEventName}"):first`

    cy.get(recurringSelector)
        .click()
})

Cypress.Commands.add('selectDeleteButtonOnEvent', () => {
    cy.get(deleteButton)
        .click()
})

Cypress.Commands.add('deleteEventOnCal', (type, recurringDeleteType, eventName) => {
    cy.selectDeleteButtonOnEvent()

    if (type === 'recurring') {
        cy.get('#swal2-title').should('have.text', 'Delete Event!')
        cy.get('#swal2-content').should('have.text', 'Would you only like to delete this event, or all recurring instances of this event?')

        switch (recurringDeleteType) {
            case 'all':
                cy.get('.swal2-cancel.swal2-styled')
                    .contains('All Recurring')
                    .click()
                break

            case 'individual':
                cy.get('.swal2-confirm.swal2-styled')
                    .contains('This Event Only')
                    .click()
                break
        }
    } else {
        cy.deleteModal('Delete Event!', 'Are you sure you want to delete this event?', 'delete')
        cy.get('.fc-month-view')
            .should('not.contain.text', eventName)
    }
})

Cypress.Commands.add('verifyEvent', (type, { timeFrom, timeTo, eventTime, eventTitle }) => {
    switch (type) {
        case 'week':
            const weekViewDayTitle = `${weekTitle}[data-date="${moment().format('YYYY-MM-DD')}"]`
            cy.get(weekViewDayTitle).should('have.text', moment().format('ddd M/Ddddd'))
            cy.get(`${weekEventTime}[data-full="${timeFrom} - ${timeTo}"] span`).contains(eventTime, { matchCase: false })
            cy.get(weekEventTitle).contains(eventTitle)
            break

        case 'day':
            const dayViewTitle = `${dayHeader}[data-date="${moment().format('YYYY-MM-DD')}"]`
            cy.get(dayViewTitle).contains(moment().format('dddd'))
            cy.get(`${weekEventTime}[data-full="${timeFrom} - ${timeTo}"] span`).contains(eventTime, { matchCase: false })
            cy.get(weekEventTitle).contains(eventTitle)
            break

        case 'month':
            cy.get(monthHeader).should('have.text', moment().format('MMMM YYYY'))
            cy.wait(5000)
            cy.get(`${weekEventTime}`).contains(eventTime, { matchCase: false })
            cy.get(weekEventTitle).contains(eventTitle)
            break
    }
})

Cypress.Commands.add('prevNextToggle', (type) => {
    cy.intercept({
        url: '/api/activity/GetActivitiesForCalendar/',
        method: 'POST',
    }).as('getCalEvents')
    switch (type) {
        case 'prev':
            cy.get(prevArrow)
                .click()
            // cy.wait('@getCalEvents')
            break

        case 'next':
            cy.get(nextArrow)
                .click()
            // cy.wait('@getCalEvents')
            break

        case 'today':
            cy.get(todayToggle)
                .click()
            // cy.wait('@getCalEvents')
            break
    }
})

Cypress.Commands.add('toggleCalendarView', (type) => {
    const selectedBackgroundColour = 'rgb(30, 146, 210)'
    const selectToggleButton = (selector) => cy.get(selector)
        .click()
        .should('have.css', 'background-color')
        .and('eq', selectedBackgroundColour)

    switch (type) {
        case 'month':
            selectToggleButton(monthView)
            cy.get(monthViewContainer)
                .should('be.visible')
            break

        case 'week':
            selectToggleButton(weekview)
            cy.get(weekViewContainer)
                .should('be.visible')
            break

        case 'day':
            selectToggleButton(dayView)
            cy.get(dayViewContainer)
                .should('be.visible')
            break
    }
})

Cypress.Commands.add('openEventForm', () => {
    cy.wait(2000)
    cy.get(addEventBtn)
        .click({ force: true })
})
