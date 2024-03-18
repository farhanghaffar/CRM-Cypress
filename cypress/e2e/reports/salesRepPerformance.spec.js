/// <reference types="Cypress" />

import moment from 'moment'
import { stringGen } from '../../support/helpers'
import { REPORT_SALES_REP_KPI_REPORT } from '../../urls'
const subscriberId = Cypress.env('subscriberId')

context('reports.salesRepPerformance', () => {

    before(() => {
        cy.APILogin('salesRep')
    })

    describe('validation', () => {
        beforeEach(() => {
            cy.intercept('/api/Dropdown/GetAccessibleGlobalUserIdsForUser').as('getGlobalUserIds')
            cy.navigateAndCheckURL(REPORT_SALES_REP_KPI_REPORT)
            cy.wait('@getGlobalUserIds')
        })

        describe('date picker', () => {
            const monthHeaderFormat = 'MMMM YYYY';

            beforeEach(() => {
                // open date picker
                cy.collapseDateRangeDatePicker()
            })

            it('toggle to today and see date change', () => {
                cy.validateSalesRepKpiDatePicker('today')
            })

            it('toggle to yesterday and see date change', () => {
                cy.validateSalesRepKpiDatePicker('yesterday')
            })

            it('toggle to this week and see date change', () => {
                cy.validateSalesRepKpiDatePicker('thisWeek')
            })

            it('toggle to last week and see date change', () => {
                cy.validateSalesRepKpiDatePicker('lastWeek')
            })

            it('toggle to this month and see date change', () => {
                cy.validateSalesRepKpiDatePicker('thisMonth')
            })

            it('toggle to last month and see date change', () => {
                cy.validateSalesRepKpiDatePicker('lastMonth')
            })

            it('toggle to custom date and see date change', () => {
                cy.validateSalesRepKpiDatePicker('custom')
            })

            it('toggle next month and see header change', () => {
                cy.actitiviteByDateRange_ToggleDatePicker('next', moment().format(monthHeaderFormat), moment().add(1, 'months').format(monthHeaderFormat))
            })

            it('toggle previous month and see header change', () => {
                cy.actitiviteByDateRange_ToggleDatePicker('prev', moment().subtract(2, 'months').format(monthHeaderFormat), moment().subtract(1, 'months').format(monthHeaderFormat))
            })

            it('cancel out of date picker', () => {
                cy.get('.cancelBtn').click()
                cy.get('.daterangepicker').should('not.be.visible')
            })
        })

    })
})