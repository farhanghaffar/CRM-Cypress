import moment from 'moment'

Cypress.Commands.add('validateSalesRepKpiDatePicker', (range) => {
    const dateFormat = 'DD MMM, YYYY';
    cy.intercept('/api/Report/GetAsyncReportResponse?refId=**').as('getKpiReport')
    switch (range) {
        case 'today':
            cy.reportsDatePicker_SelectRange('Today')
            cy.wait('@getKpiReport')
            cy.collapseDateRangeDatePicker()
            cy.reportsDatePicker_ValidateBackground('Today')

            const today = moment().format(dateFormat)
            cy.reportsDatePicker_ValidateSelectedRangeText(`${today} - ${today}`)
            break;

        case 'yesterday':
            cy.reportsDatePicker_SelectRange('Yesterday')
            cy.wait('@getKpiReport')
            cy.collapseDateRangeDatePicker()
            cy.reportsDatePicker_ValidateBackground('Yesterday')

            const yesterday = moment().subtract(1, 'days').format(dateFormat)
            cy.reportsDatePicker_ValidateSelectedRangeText(`${yesterday} - ${yesterday}`)
            break;

        case 'thisWeek':
            cy.reportsDatePicker_SelectRange('This Week')
            cy.wait('@getKpiReport')
            cy.collapseDateRangeDatePicker()
            cy.reportsDatePicker_ValidateBackground('This Week')

            const startWeek = moment().startOf('week').isoWeekday(7).format(dateFormat)
            const endWeek = moment().endOf('week').isoWeekday(6).format(dateFormat)
            cy.reportsDatePicker_ValidateSelectedRangeText(`${startWeek} - ${endWeek}`)
            break;

        case 'lastWeek':
            cy.reportsDatePicker_SelectRange('Last Week')
            cy.wait('@getKpiReport')
            cy.collapseDateRangeDatePicker()
            cy.reportsDatePicker_ValidateBackground('Last Week')

            const startLastWeek = moment().subtract(1, 'weeks').startOf('week').isoWeekday(7).format(dateFormat)
            const endLastWeek = moment().subtract(1, 'weeks').endOf('week').isoWeekday(6).format(dateFormat)
            cy.reportsDatePicker_ValidateSelectedRangeText(`${startLastWeek} - ${endLastWeek}`)
            break;

        case 'thisMonth':
            cy.reportsDatePicker_SelectRange('This Month')
            cy.wait('@getKpiReport')
            cy.collapseDateRangeDatePicker()
            cy.reportsDatePicker_ValidateBackground('This Month')

            const startOfMonth = moment().clone().startOf('month').format(dateFormat)
            const endOfMonth = moment().clone().endOf('month').format(dateFormat)
            cy.reportsDatePicker_ValidateSelectedRangeText(`${startOfMonth} - ${endOfMonth}`)
            break;

        case 'lastMonth':
            cy.reportsDatePicker_SelectRange('Today')
            cy.wait('@getKpiReport')
            cy.collapseDateRangeDatePicker()
            cy.reportsDatePicker_SelectRange('Last Month')
            cy.wait('@getKpiReport')
            cy.collapseDateRangeDatePicker()
            cy.reportsDatePicker_ValidateBackground('Last Month')

            const startOfLastMonth = moment().subtract(1, 'months').clone().startOf('month').format(dateFormat)
            const endOfLastMonth = moment().subtract(1, 'months').clone().endOf('month').format(dateFormat)
            cy.reportsDatePicker_ValidateSelectedRangeText(`${startOfLastMonth} - ${endOfLastMonth}`)
            break;

        case 'custom':
            cy.get('.drp-calendar.right tbody .available:not(.off)')
                .contains(moment().add(1, 'days').format('D'))
                .click()

            cy.get('.drp-calendar.right tbody .available:not(.off)')
                .contains(moment().add(3, 'days').format('D'))
                .click()
            cy.activitiesByDateRangeApplyDatePicker()
            cy.wait('@getKpiReport')
            cy.collapseDateRangeDatePicker()
            cy.reportsDatePicker_ValidateBackground('Custom')

            const customFrom = moment().add(1, 'days').format(dateFormat)
            const customTo = moment().add(3, 'days').format(dateFormat)
            // cy.reportsDatePicker_ValidateSelectedRangeText(`${customFrom} - ${customTo}`)
            break;
    }
})