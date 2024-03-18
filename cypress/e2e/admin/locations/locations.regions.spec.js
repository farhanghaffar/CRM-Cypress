/// <reference types="Cypress" />

import { stringGen } from '../../../support/helpers'
import { LOCATION_URL } from '../../../urls'
const users = Cypress.env('users')
const subscriberId = Cypress.env('subscriberId')

context('locations.regions', () => {
    const crmAdminData = {
        globalUserId: users['crmAdmin'].globalUserId
    }
    const { globalUserId } = crmAdminData;
    before(() => {
        cy.APILogin('crmAdmin')
    })

    describe('region functionality', () => {
        beforeEach(() => {
            cy.intercept({
                url: '/api/region/SaveRegion',
                method: 'POST'
            }).as('saveRegion')
            cy.navigateAndCheckURL(LOCATION_URL)
            cy.selectLocationTab('regions')
        })

        it('add region', () => {
            const regionData = {
                regionName: stringGen(10)
            }

            cy.navigateAndCheckURL(LOCATION_URL)
            cy.selectLocationTab('regions')
            cy.addRegion(regionData)
            cy.wait('@saveRegion').then((res) => {
                cy.selectLocationTab('regions')
                cy.checkRegionData('data', res.response.body, regionData.regionName)
                cy.deleteRegionAPI(res.response.body, globalUserId, subscriberId)
            })
        })

        it('edit region', () => {
            const newRegionName = stringGen(13)
            const editedRegionName = stringGen(6)
            cy.addRegionAPI(newRegionName, globalUserId, subscriberId).then((res) => {
                cy.navigateAndCheckURL(LOCATION_URL)
                cy.selectLocationTab('regions')
                cy.checkRegionData('data', res.body, newRegionName)
                cy.editRegion(subscriberId, res.body, editedRegionName)
                cy.wait('@saveRegion')
                cy.selectLocationTab('regions')
                cy.checkRegionData('data', res.body, editedRegionName)
                cy.deleteRegionAPI(res.body, globalUserId, subscriberId)
            })
        })

        it('delete region on page', () => {
            const newRegionName = stringGen(15)
            cy.addRegionAPI(newRegionName, globalUserId, subscriberId).then((res) => { 
                cy.navigateAndCheckURL(LOCATION_URL)
                cy.selectLocationTab('regions')
                cy.checkRegionData('data', res.body, newRegionName)
                cy.deleteRegion('regionPage', res.body, subscriberId)
                cy.checkRegionData('no-data', res.body, newRegionName)
            })
        })

        it('delete region on specific region page', () => {
            const newRegionName = stringGen(15)
            cy.addRegionAPI(newRegionName, globalUserId, subscriberId).then((res) => { 
                cy.navigateAndCheckURL(LOCATION_URL)
                cy.selectLocationTab('regions')
                cy.checkRegionData('data', res.body, newRegionName)
                cy.deleteRegion('specificPage', res.body, subscriberId)
                cy.checkRegionData('no-data', res.body, newRegionName)
            })
        })
    })
})