/// <reference types="Cypress" />
import moment from 'moment'

const activitiesByDateRangeSelectors = {
      validation: {
            noResultsContainer: '#divNoItems',
            noResultsMessage: '.alert.alert-warning.text-center > p > label',
      },

      dataRow: {
            user: 'td > p[data-name="user"]',
            date: 'td > p[data-name="activity-date"]',
            eventType: 'td > p[data-name="activity-type"]',
            subject: 'td > p[data-name="subject"]',
            descrition: 'td > p[data-name="description"]',
            deal: 'td > p[data-name="deal"]',
            company: 'td > p[data-name="companies"]',
            contact: 'td > p[data-name="contacts"]',
            campaign: 'td > p[data-name="campaigns"]',
            dealType: 'td > p[data-name="deal-type"]',
            competitors: 'td > p[data-name="competitors"]',
            created: 'td > p[data-name="createddate"]',
            updated: 'td > p[data-name="lastupdated"]',
      },

      overview: {
            datePickerButton: '#reportFiltersdateRangePicker'
      }
}

const { noResultsContainer, noResultsMessage } = activitiesByDateRangeSelectors.validation
const { user, date, eventType, subject, descrition, deal, company, contact, campaign, dealType, competitors, created, updated } = activitiesByDateRangeSelectors.dataRow
const { datePickerButton } = activitiesByDateRangeSelectors.overview

const specificIdSelector = (activityId) => `#tblActivityReport > tbody > tr[data-id="${activityId}"]`

Cypress.Commands.add('validateActivitiesByDateRangeDatePicker', (range) => {
      const dateFormat = 'DD MMM, YYYY';
      cy.intercept('/api/Report/GetActivitiesByDateRangeReport').as('getActivities')
      switch (range) {
            case 'today':
                  cy.reportsDatePicker_SelectRange('Today')
                  cy.wait('@getActivities')
                  cy.collapseDateRangeDatePicker()
                  cy.reportsDatePicker_ValidateBackground('Today')

                  const today = moment().format(dateFormat)
                  cy.reportsDatePicker_ValidateSelectedRangeText(`${today} - ${today}`)
                  break;

            case 'yesterday':
                  cy.reportsDatePicker_SelectRange('Yesterday')
                  cy.wait('@getActivities')
                  cy.collapseDateRangeDatePicker()
                  cy.reportsDatePicker_ValidateBackground('Yesterday')

                  const yesterday = moment().subtract(1, 'days').format(dateFormat)
                  cy.reportsDatePicker_ValidateSelectedRangeText(`${yesterday} - ${yesterday}`)
                  break;

            case 'thisWeek':
                  cy.reportsDatePicker_SelectRange('Today')
                  cy.wait('@getActivities')
                  cy.collapseDateRangeDatePicker()
                  cy.reportsDatePicker_SelectRange('This Week')
                  cy.wait('@getActivities')
                  cy.collapseDateRangeDatePicker()
                  cy.reportsDatePicker_ValidateBackground('This Week')

                  const startWeek = moment().startOf('week').isoWeekday(7).format(dateFormat)
                  const endWeek = moment().endOf('week').isoWeekday(6).format(dateFormat)
                  cy.reportsDatePicker_ValidateSelectedRangeText(`${startWeek} - ${endWeek}`)
                  break;

            case 'lastWeek':
                  cy.reportsDatePicker_SelectRange('Last Week')
                  cy.wait('@getActivities')
                  cy.collapseDateRangeDatePicker()
                  cy.reportsDatePicker_ValidateBackground('Last Week')

                  const startLastWeek = moment().subtract(1, 'weeks').startOf('week').isoWeekday(7).format(dateFormat)
                  const endLastWeek = moment().subtract(1, 'weeks').endOf('week').isoWeekday(6).format(dateFormat)
                  cy.reportsDatePicker_ValidateSelectedRangeText(`${startLastWeek} - ${endLastWeek}`)
                  break;

            case 'thisMonth':
                  cy.reportsDatePicker_SelectRange('This Month')
                  cy.wait('@getActivities')
                  cy.collapseDateRangeDatePicker()
                  cy.reportsDatePicker_ValidateBackground('This Month')

                  const startOfMonth = moment().clone().startOf('month').format(dateFormat)
                  const endOfMonth = moment().clone().endOf('month').format(dateFormat)
                  cy.reportsDatePicker_ValidateSelectedRangeText(`${startOfMonth} - ${endOfMonth}`)
                  break;

            case 'lastMonth':
                  cy.reportsDatePicker_SelectRange('Last Month')
                  cy.wait('@getActivities')
                  cy.collapseDateRangeDatePicker()
                  cy.reportsDatePicker_ValidateBackground('Last Month')

                  const startOfLastMonth = moment().subtract(1, 'months').clone().startOf('month').format(dateFormat)
                  const endOfLastMonth = moment().subtract(1, 'months').clone().endOf('month').format(dateFormat)
                  cy.reportsDatePicker_ValidateSelectedRangeText(`${startOfLastMonth} - ${endOfLastMonth}`)
                  break;

            case 'custom':
                  cy.get('.drp-calendar.left tbody .available:not(.off)')
                        .contains(moment().add(1, 'days').format('D'))
                        .click()

                  cy.get('.drp-calendar.left tbody .available:not(.off)')
                        .contains(moment().add(3, 'days').format('D'))
                        .click()
                  cy.activitiesByDateRangeApplyDatePicker()
                  cy.wait('@getActivities')
                  cy.collapseDateRangeDatePicker()
                  cy.reportsDatePicker_ValidateBackground('Custom')

                  const customFrom = moment().add(1, 'days').format(dateFormat)
                  const customTo = moment().add(3, 'days').format(dateFormat)
                  // cy.reportsDatePicker_ValidateSelectedRangeText(`${customFrom} - ${customTo}`)
                  break;
      }
})

Cypress.Commands.add('actitiviteByDateRange_ToggleDatePicker', (type, leftHeader, rightHeader) => {
      const leftCalendarHeader = (header) => cy.get('.drp-calendar.left .month').should('have.text', header)
      const rightCalendarHeader = (header) => cy.get('.drp-calendar.right .month').should('have.text', header)
      if (type == 'next') {
            cy.get('.drp-calendar.right .next.available')
                  .click()
            leftCalendarHeader(leftHeader)
            rightCalendarHeader(rightHeader)
      } else if (type == 'prev') {
            cy.get('.drp-calendar.left .prev.available')
                  .click()
            leftCalendarHeader(leftHeader)
            rightCalendarHeader(rightHeader)
      }
})

Cypress.Commands.add('activitiesByDateRangeApplyDatePicker', () => {
      cy.get('.drp-buttons > button.applyBtn')
            .click()
})

Cypress.Commands.add('userRoleValidationABDR', (visibleRows, nonVisibleRows, containingUsernames, nonVisibleUsernames, reportResponseArray) => {
      // check for existing rows and non existing rows
      for (let i = 0; i < visibleRows.length; i++) {
            cy.get(`${specificIdSelector(visibleRows[i])}`)
                  .should('exist')
            cy.log('run')
      }

      for (let i = 0; i < nonVisibleRows.length; i++) {
            cy.get(`${specificIdSelector(nonVisibleRows[i])}`)
                  .should('not.exist')
      }

      // check API response
      expect(reportResponseArray).to.include.members(containingUsernames)
      expect(reportResponseArray).to.not.include.members(nonVisibleUsernames)
})

Cypress.Commands.add('selectCompanyFromReport', (activityId, companyName) => {
      cy.get(`${specificIdSelector(activityId)} ${company} > p > a`)
            .invoke('removeAttr', 'target')
            .click()

      cy.get('.page-title > h1 > #lblCompanyName')
            .should('have.text', companyName)
})

Cypress.Commands.add('reportsNoItemsValidation', (message) => {
      cy.get(noResultsContainer)
            .should('be.visible')

      cy.get(noResultsMessage)
            .should('have.text', message)
})

Cypress.Commands.add('validateDataRow', (rowActivityId, {
      rowUserName,
      rowDate,
      rowEventType,
      rowSubject,
      rowDescription,
      rowDeal,
      rowCompany,
      rowContact,
      rowCampaign,
      rowDealType,
      rowCompetitors,
      rowCreated,
      rowUpdated,
}) => {
      const rowId = specificIdSelector(rowActivityId)
      const selector = (specificSelector) => cy.get(`${rowId} ${specificSelector}`)

      selector(user)
            .should('have.text', rowUserName)
      selector(date)
            .contains(rowDate)
      selector(eventType)
            .should('have.text', rowEventType)
      selector(subject)
            .should('have.text', rowSubject)
      selector(descrition)
            .should('have.text', rowDescription)
      selector(deal)
            .should('have.text', rowDeal)
      selector(company)
            .contains(rowCompany)
      selector(contact)
            .should('have.text', rowContact)
      selector(campaign)
            .should('have.text', rowCampaign)
      selector(dealType)
            .should('have.text', rowDealType)
      selector(competitors)
            .should('have.text', rowCompetitors)
      selector(created)
            .contains(rowCreated)
      selector(updated)
            .contains(rowUpdated)
})

Cypress.Commands.add('rowNotDisplayed', (rowActivityId) => {
      cy.get(specificIdSelector(rowActivityId))
            .should('not.exist')
})
