const activitySelectors = {
  events: {
    title: '[data-col-id="title"] [data-cypress-id="title-link"]',
    date: '[data-col-id="start"]',
    locationName: '[data-col-id="location"]',
    company: '[data-col-id="company"] > a',
    category: '[data-col-id="type"]',
    deals: '[data-col-id="deals"] > div',
    actions: '[data-col-id="actions"]',
  },

  tasks: {
    taskTitle: '[data-col-id="name"] > span',
    taskDueDate: '[data-col-id="dueDate"]',
    taskCompany: '[data-col-id="company"] a',
    taskContact: '[data-col-id="contact"] a',
    taskDeal: '[data-col-id="deal"] a',
  },

  activityTrend: {
    newDeals: 'table#tblActivities > tr:nth-of-type(1)',
    newDealsMetric: '[data-name="new-deals"]',
    wonDeals: 'table#tblActivities > tr:nth-of-type(2)',
    wonDealMetric: '[data-name="won-deals"]',
    lostDeals: 'table#tblActivities > tr:nth-of-type(3)',
    lostDealsMetric: '[data-name="lost-deals"]',
    tasks: 'table#tblActivities > tr:nth-of-type(4)',
    tasksMetric: '[data-name="tasks"]',
    events: 'table#tblActivities > tr:nth-of-type(5)',
    eventsMetric: '[data-name="events"]',
    newCompanies: 'table#tblActivities > tr:nth-of-type(6)',
    newCompaniesMetric: '[data-name="new-companies"]',
    logins: 'table#tblActivities > tr:nth-of-type(7)',
    loginsMetric: '[data-name="logins"]',
    notes: 'table#tblActivities > tr:nth-of-type(8)',
    notesMetric: '[data-name="notes"]',
    modalPopupClose: '#modalPopup .modal-header  > .close.closeX',
  },
}

const { title, date, locationName, company, category, deals, actions } = activitySelectors.events
const { taskTitle, taskDueDate, taskCompany, taskContact, taskDeal } = activitySelectors.tasks
const {
  newDeals,
  newDealsMetric,
  wonDeals,
  wonDealMetric,
  lostDeals,
  lostDealsMetric,
  tasks,
  tasksMetric,
  events,
  eventsMetric,
  newCompanies,
  newCompaniesMetric,
  logins,
  loginsMetric,
  notes,
  notesMetric,
  modalPopupClose,
} = activitySelectors.activityTrend

const eventSelector = (eventId) => `#events-list-data-grid .row-wrapper[data-activity-id="${eventId}"]`
const taskSelector = (taskId) => `#tasks-list-data-grid .row-wrapper[data-activity-id="${taskId}"]`
const actvitySelector = '#divActivityChart'

const getIframeDocument = () => {
  return cy
        .get('iframe#frm_popup')
        .its('0.contentDocument').should('exist')
}

const getIframeBody = () => {
  // get the document
  return getIframeDocument()
        .its('body').should('not.be.undefined')
        .then(cy.wrap)
}

Cypress.Commands.add('selectEventNameBasedOnType', (isCompany, id) => {
  if (isCompany) {
    cy.get(`.event-title a.hover-link[data-action="edit-event"][event-id="${id}"]`)
            .click()
  }
})

Cypress.Commands.add('checkEventOverview', ({ eventId, eventTitle, eventDate, eventTime, eventLocation, eventCompany, eventCat, eventDeals }) => {
  const eventIdentifier = eventSelector(eventId)
  const selectors = (specificSelector) => cy.get(`${eventIdentifier} ${specificSelector}`)

  selectors(category).contains(eventCat)
  selectors(title).contains(eventTitle)
  // selectors(date).contains(`${eventDate} - ${eventTime}`)
  selectors(locationName).contains(eventLocation)
  selectors(company).contains(eventCompany)
  selectors(deals).contains(eventDeals)
})

Cypress.Commands.add('selectEventFromActivity', (eventName) => {
  // cy.get(`${eventSelector(eventId)} ${title}`)
  //     .click()
  cy.get('#events-list-data-grid .row-wrapper')
        .contains(eventName)
        .click()
})

Cypress.Commands.add('selectEventFromTab', (eventId) => {
  cy.get(`#divEvents > .event-wrap[data-event-id="${eventId}"] .hover-link`)
        .click()
})

Cypress.Commands.add('checkTaskOverview', ({ taskId, title, dueDate, company, contact, deal }) => {
  const taskIdentifier = taskSelector(taskId)
  const selectors = (specificSelector) => cy.get(`${taskIdentifier} ${specificSelector}`)

  selectors(taskTitle).contains(title)
  selectors(taskDueDate).contains(dueDate)
  selectors(taskCompany).contains(company)
  selectors(taskContact).contains(contact)
  selectors(taskDeal).contains(deal)
})

Cypress.Commands.add('selectTaskFromActivity', (taskName) => {
  // cy.get(`${taskSelector(taskId)} ${taskTitle}`)
  //     .click()
  cy.get('#tasks-list-data-grid .row-wrapper')
        .contains(taskName)
        .click()
})

Cypress.Commands.add('activityMarkTaskComplete', (taskId) => {
  cy.get(`${taskSelector(taskId)} .data-grid-column[data-col-id="completed"] [type="checkbox"]`)
        .click({ force: true })
})
