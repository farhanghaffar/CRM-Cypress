/// <reference types="Cypress" />

import { numGen, stringGen } from '../../../support/helpers'
import { LOCATION_URL } from '../../../urls'
const users = Cypress.env('users')
const subscriberId = Cypress.env('subscriberId')

const crmAdminGlobalUserId = users['crmAdmin'].globalUserId
const crmAdminUserId = users['crmAdmin'].userId

const userData = {
    subscriberId: subscriberId,
    userId: crmAdminUserId,
    globalUserId: crmAdminGlobalUserId
}

context('locations.countriesToRegions', () => {
    // TESTS MUST BE RUN COLLECTIVELY.
    describe('countries to regions functionality', () => {
        let regionId
        const regionName = `REGION_${stringGen(8)}`
        const availableCountriesArray = ['Afghanistan', 'Angola', 'Azerbaidjan', 'Guam', 'Libya', 'Mongolia', 'Nepal', 'Rwanda', 'Togo', 'Yugoslavia', 'Zaire']
        before(() => {
            cy.APILogin('crmAdmin')
            cy.addRegionAPI(regionName, crmAdminGlobalUserId, subscriberId).then((res) => {
                regionId = res.body
            })
            cy.setCountriesToRegionsState(userData)
            cy.navigateAndCheckURL(LOCATION_URL)
            cy.selectLocationTab('countriesToRegions')
            cy.toggleRegionCountriesToRegions(regionName)
            cy.testCountriesWithNoRegionsOptions(availableCountriesArray)
        })

        after(() => {
            cy.deleteRegionAPI(regionId, crmAdminGlobalUserId, subscriberId)
            cy.restoreCountriesToRegions(userData)
        })

        it.skip('Add one country to Region and save', () => {
            // skipped due to being unable to select one country via cypress
            cy.toggleRegionCountriesToRegions(regionName)
            cy.selectCountryWithNoRegion('AF')
            cy.toggleCountriesToRegions('add')
            cy.saveForm()
            cy.reload()
            cy.selectLocationTab('countriesToRegions')
            cy.toggleRegionCountriesToRegions(regionName)
            cy.testRegionCountriesOptions(['Afghanistan'])
        })

        it('Add multiple countries to Region', () => {
            cy.intercept('/api/CountryRegions/UpdateCountries').as('updateCountries')
            cy.toggleCountriesToRegions('addAll')
            cy.saveForm()
            cy.wait('@updateCountries')
            cy.reload()
            cy.selectLocationTab('countriesToRegions')
            cy.toggleRegionCountriesToRegions(regionName)
            cy.testRegionCountriesOptions(availableCountriesArray)
        })

        it.skip('Remove one country from Region', () => {
            // skipped due to being unable to select one country via cypress
            cy.toggleRegionCountriesToRegions(regionName)
            cy.selectRegionCountry('Angola')
            cy.toggleCountriesToRegions('remove')
            cy.saveForm()
            cy.reload()
            cy.selectLocationTab('countriesToRegions')
            cy.toggleRegionCountriesToRegions(regionName)
            cy.testCountriesWithNoRegionsOptions(['Angola'])
        })

        it('Remove multiple countries from Region', () => {
            cy.intercept('/api/CountryRegions/UpdateCountries').as('updateCountries')
            cy.toggleCountriesToRegions('removeAll')
            cy.saveForm()
            cy.wait('@updateCountries')
            cy.reload()
            cy.selectLocationTab('countriesToRegions')
            cy.toggleRegionCountriesToRegions(regionName)
            cy.testCountriesWithNoRegionsOptions(availableCountriesArray)
        })

        it('Able to search for region inside regions toggle', () => {
            cy.get('#select2-CountriesToRegions_ddlRegions-container')
                .click()
            cy.get('.select2-search__field')
                .type(regionName)
            cy.get('#select2-CountriesToRegions_ddlRegions-results > li')
                .should('have.length', 1)
                .and('contain.text', regionName)
        })
    })
})