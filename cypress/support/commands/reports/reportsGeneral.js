const reportSelectors = {
  reportSections: {
    container: '.wrapper.reportList',
    activitiesByDateRange: '.col-sm-6.reportBox a[href="ActivitiesByDateRange/ActivitiesByDateRangeReport.aspx"]',
  },
  filterInputs: {
    filterContainer: '#responsiveContent1',
    fromDate: '#txtDateFrom',
    toDate: '#txtDateTo',
    events: '#chkCalendarEvents',
    tasks: '#chkTasks',
    notes: '#chkNotes',
    countries: '#ddlCountry',
    locations: '#ddlLocation',
    competitors: '#ddlCompetitors',
    companies: '#ddlCompany',
    campaigns: '#ddlCampaigns',
    dealType: '#ddlDealType',
  },
  filterButtons: {
    runReport: '#btnRun',
    excel: '#btnExcel',
  },
  resultsTable: {
    tableContainer: '#tblActivityReport',
    editTask: '[data-target="#addTaskDialog"]',
    editEvent: '[data-action="edit-event"]',
  },
}

const { container, activitiesByDateRange } = reportSelectors.reportSections
const { filterContainer, fromDate, toDate, events, tasks, notes, countries, locations, competitors, companies, campaigns, dealType } = reportSelectors.filterInputs
const { runReport, excel } = reportSelectors.filterButtons
const { tableContainer } = reportSelectors.resultsTable

Cypress.Commands.add('navigateToSection', (section) => {
  cy.get(container).should('be.visible')
  switch (section) {
    case ('activitiesByDateRange'):
      cy.get(activitiesByDateRange).click()
      break
  }

  cy.get(filterContainer).should('be.visible')
})

Cypress.Commands.add('noReportsReturned', (noReportsText) => {
  cy.get('.no-tasks')
    .should('be.visible')
  
  cy.get('.no-tasks .e-text')
    .contains(noReportsText)
})

Cypress.Commands.add('runReport', () => {
  cy.get(runReport).click()
})

Cypress.Commands.add('collapseReportFilterOptions', () => {
  cy.get('#btnAdvanced')
    .click()
})

Cypress.Commands.add('reportsDatePicker_SelectRange', (range) => {
  cy.get(`.daterangepicker li[data-range-key="${range}"]`).click()
})

Cypress.Commands.add('reportsDatePicker_ValidateBackground', (range) => {
  cy.get(`.daterangepicker li[data-range-key="${range}"]`)
              .should('have.class', 'active')
              .should('have.css', 'background-color')
              .and('eq', 'rgb(0, 136, 204)')
})

Cypress.Commands.add('reportsDatePicker_ValidateSelectedRangeText', (range) => {
  cy.get('.daterangepicker > .drp-buttons > .drp-selected').should('have.text', range)
})

Cypress.Commands.add('collapseDateRangeDatePicker', () => {
  cy.get('#reportFiltersdateRangePicker')
        .click()
  cy.get('.daterangepicker.show-ranges.show-calendar.opensright')
        .should('be.visible')
})