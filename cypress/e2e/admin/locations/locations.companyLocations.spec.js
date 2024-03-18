/// <reference types="Cypress" />

import { numGen, stringGen } from '../../../support/helpers'
import { LOCATION_URL } from '../../../urls'
import { locationCompanyLocationsForm } from '../../../forms';
const users = Cypress.env('users')
const subscriberId = Cypress.env('subscriberId')

const crmAdminGlobalUserId = users['crmAdmin'].globalUserId
const crmAdminUserId = users['crmAdmin'].userId

const userData = {
    subscriberId: subscriberId,
    userId: crmAdminUserId,
    globalUserId: crmAdminGlobalUserId
}


context('locations.companyLocations', () => {
    before(() => {
        cy.APILogin('crmAdmin')
    })

    describe('company locations validation', () => {

        before(() => {
            cy.navigateAndCheckURL(LOCATION_URL)
            cy.selectLocationTab('companyLocations')
            cy.openCompanyLocationsForm()
        })

        it('location, code, country and region fields are required', () => {
            cy.saveForm()
            cy.requiredValidationChecker();
        })

        it('close company locations form', () => {
            cy.cancelForm()
            cy.get('#divLocationsTab')
                .should('be.visible')
        })
    })

    describe('company locations functionality', () => {

        before(() => {
            cy.navigateAndCheckURL(LOCATION_URL)
            cy.selectLocationTab('companyLocations')
        })

        it('i must be able to add a company location', () => {
            cy.intercept('/api/location/SaveLocation').as('saveLocation')
            const newCompanyLocation = {
                locationName: `A${stringGen(10)}`,
                locationCode: `B${stringGen(3)}`,
                locationType: 'Agent',
                locationAddress: '21 Test Lane',
                locationCity: 'Lancaster',
                locationState: 'Yorkshire',
                locationPostCode: 'LA1 1AA',
                locationPhone: numGen(9),
                locationFax: numGen(9),
                locationComments: stringGen(20),
                locationDistrict: 'Greater Manchester',
                locationCountry: 'United Kingdom',
                locationRegion: 'Europe, Middle East & Africa',
            }
            cy.openCompanyLocationsForm()
            cy.fillForm(locationCompanyLocationsForm, newCompanyLocation)
            cy.saveForm()
            cy.wait('@saveLocation').then((xhr) => {
                const locationId = xhr.response.body
                cy.checkCompanyLocationsOverview(locationId, newCompanyLocation)
                cy.removeCompanyLocationAPI(locationId, userData)
            })
        })

        it('i must be able to edit a company location', () => {
            const locationData = {
                countryName: 'United Kingdom',
                locationCode: numGen(4),
                locationName: `A${stringGen(10)}`,
                regionName: 'Europe, Middle East & Africa'
            }
            cy.addCompanyLocationAPI(userData, locationData).then((response) => {
                const locationId = response.body
                cy.navigateAndCheckURL(LOCATION_URL)
                cy.selectLocationTab('companyLocations')
                cy.viewAndSelectEditCompanyLocation(locationId, locationData.locationName)

                const editForm = {
                    locationName: `A${stringGen(10)}`,
                    locationCode: `B${stringGen(3)}`,
                    locationType: 'Agent',
                    locationAddress: '222 Test Lane',
                    locationCity: 'Bolton',
                    locationState: 'Lancashire',
                    locationPostCode: 'B11441',
                    locationPhone: numGen(9),
                    locationFax: numGen(9),
                    locationComments: stringGen(20),
                    locationDistrict: 'Greater Manchester',
                    locationCountry: 'United Kingdom',
                    locationRegion: 'Europe, Middle East & Africa',
                }

                cy.fillForm(locationCompanyLocationsForm, editForm)
                cy.saveForm()
                cy.checkCompanyLocationsOverview(locationId, editForm)
                cy.removeCompanyLocationAPI(locationId, userData)
            })
        })

        it('i must be able to delete a company location', () => {
            const locationData = {
                countryName: 'United Kingdom',
                locationCode: numGen(4),
                locationName: stringGen(10),
                regionName: 'Europe, Middle East & Africa'
            }
            cy.addCompanyLocationAPI(userData, locationData).then((response) => {
                const locationId = response.body
                cy.intercept(`/api/location/deletelocation/?locationid=${locationId}&userId=${crmAdminUserId}&subscriberId=${subscriberId}`).as('deleteLocation')
                cy.navigateAndCheckURL(LOCATION_URL)
                cy.selectLocationTab('companyLocations')
                cy.viewAndSelectEditCompanyLocation(locationId, locationData.locationName)
                cy.deleteForm()
                cy.deleteModal('Delete Location!', 'Are you sure you want to delete this location?', 'delete')
                cy.wait('@deleteLocation')
                cy.locationNotOnOverview(locationId, locationData.locationName)
            })
        })

        it('i must be able to perform a valid search on the company location page', () => {
            const locationData = {
                countryName: 'United Kingdom',
                locationCode: numGen(4),
                locationName: stringGen(10),
                regionName: 'Europe, Middle East & Africa'
            }
            cy.addCompanyLocationAPI(userData, locationData).then((response) => {
                const locationId = response.body
                cy.navigateAndCheckURL(LOCATION_URL)
                cy.selectLocationTab('companyLocations')
                cy.searchCompanyLocationOverview(locationId, locationData.locationName, 'valid')
                cy.removeCompanyLocationAPI(locationId, userData)
            })
        })

        it('an invalid search returns no results', () => {
            cy.navigateAndCheckURL(LOCATION_URL)
            cy.selectLocationTab('companyLocations')
            cy.searchCompanyLocationOverview('', 'eazsxrdfcghvjbjknlm', 'invalid')
        })
    })
})