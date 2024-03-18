/// <reference types="Cypress" />

import { numGen, stringGen } from '../../../support/helpers'
import { LOCATION_URL } from '../../../urls'
import { locationGlobalLocationsForm } from '../../../forms';
const users = Cypress.env('users')
const subscriberId = Cypress.env('subscriberId')

const crmAdminGlobalUserId = users['crmAdmin'].globalUserId
const crmAdminUserId = users['crmAdmin'].userId

const userData = {
    subscriberId: subscriberId,
    userId: crmAdminUserId,
    globalUserId: crmAdminGlobalUserId
}


context('locations.globalLocations', () => {
    before(() => {
        cy.APILogin('crmAdmin')
    })

    describe('global locations validation', () => {

        before(() => {
            cy.navigateAndCheckURL(LOCATION_URL)
            cy.selectLocationTab('globalLocations')
            cy.openGlobalLocationsForm()
        })

        it('location, code and country are required on the global locations form', () => {
            cy.saveForm()
            cy.globalLocationsFormValidationChecker();
        })

        it('close company locations form', () => {
            cy.cancelForm()
            cy.get('#divGlobalLocationsTab')
                .should('be.visible')
        })

        it('search field shows red boarder if no content is present', () => {
            cy.get('#aGlobalSearch .icon-search')
                .click();
            cy.get('#txtGlobalKeyword')
                .should('have.css', 'border-color')
                .and('eq', 'rgb(205, 43, 30)')
        })
    })

    describe('company locations functionality', () => {
        before(() => {
            cy.navigateAndCheckURL(LOCATION_URL)
            cy.selectLocationTab('globalLocations')
        })

        it('i must be able to add a global location', () => {
            cy.intercept('/api/globallocation/SaveGlobalLocation').as('saveLocation')
            const newCompanyLocation = {
                globalLocationName: stringGen(15),
                globalLocationCode: stringGen(3),
                globalLocationCountry: 'Algeria',
                isAirport: true,
                isInlandPort: true,
                isMultiModal: true,
                isRailTerminal: true,
                isRoadTerminal: true,
                isSeaPort: true
            }

            cy.openGlobalLocationsForm()
            cy.fillForm(locationGlobalLocationsForm, newCompanyLocation)
            cy.saveForm()
            cy.wait('@saveLocation').then((xhr) => {
                const locationId = xhr.response.body
                cy.searchGlobalLocations(newCompanyLocation.globalLocationName)
                cy.checkGlobalLocationsOverview(locationId, newCompanyLocation)
                cy.locationTypeChecker(locationId, [4, 5, 6, 7, 8, 9])
                cy.removeGlobalLocationsAPI(locationId, userData)
            })
        })

        it('i must be able to edit a global location', () => {
            const newCompanyLocation = {
                globalLocationName: stringGen(17),
                globalLocationCode: stringGen(9),
                globalLocationCountry: 'Botswana',
                isAirport: true
            }
            cy.addGlobalLocationsAPI(userData, newCompanyLocation).then((response) => {
                cy.intercept('/api/globallocation/SaveGlobalLocation').as('saveLocation')
                const locationId = response.body
                cy.navigateAndCheckURL(LOCATION_URL)
                cy.selectLocationTab('globalLocations')
                cy.searchGlobalLocations(newCompanyLocation.globalLocationName)
                cy.viewAndSelectEditGlobalLocation(locationId, newCompanyLocation.globalLocationName)

                const editForm = {
                    globalLocationName: stringGen(20),
                    globalLocationCode: stringGen(2),
                    globalLocationCountry: 'China',
                    isAirport: true,
                    isMultiModal: true,
                    isRailTerminal: true,
                    isSeaPort: true
                }

                cy.fillForm(locationGlobalLocationsForm, editForm)
                cy.saveForm()
                cy.wait('@saveLocation')
                cy.searchGlobalLocations(editForm.globalLocationName)
                cy.checkGlobalLocationsOverview(locationId, editForm)
                cy.locationTypeChecker(locationId, [6, 7, 9], [4, 5, 8])
                cy.removeGlobalLocationsAPI(locationId, userData)
            })
        })

        it('i must be able to delete a global location', () => {
            const newCompanyLocation = {
                globalLocationName: stringGen(20),
                globalLocationCode: stringGen(4),
                globalLocationCountry: 'Indonesia'
            }
            cy.addGlobalLocationsAPI(userData, newCompanyLocation).then((response) => {
                const locationId = response.body
                cy.intercept(`/api/globallocation/deletegloballocation/?globallocationid=${locationId}&userId=${crmAdminUserId}&subscriberId=${subscriberId}`).as('deleteLocation')
                cy.navigateAndCheckURL(LOCATION_URL)
                cy.selectLocationTab('globalLocations')
                cy.searchGlobalLocations(newCompanyLocation.globalLocationName)
                cy.viewAndSelectEditGlobalLocation(locationId, newCompanyLocation.globalLocationName)
                cy.deleteForm()
                cy.deleteModal('Delete Global Location!', 'Are you sure you want to delete this global location?', 'delete')
                cy.wait('@deleteLocation')
                cy.searchGlobalLocations(newCompanyLocation.globalLocationName)
                cy.globalLocationsNotOnOverview(locationId, newCompanyLocation.locationName)
            })
        })

        // SKIPPED DUE TO A BUG - https://trello.com/c/AUFt9xoq/1157-global-locations-country-value-isnt-carried-over-to-edit-form
        it.skip('form retains added data on edit', () => {
            const newCompanyLocation = {
                globalLocationName: stringGen(17),
                globalLocationCode: stringGen(9),
                globalLocationCountry: 'Botswana',
                isAirport: true,
                isInlandPort: true,
                isMultiModal: true,
                isRailTerminal: true,
                isRoadTerminal: true,
                isSeaPort: true

            }
            cy.addGlobalLocationsAPI(userData, newCompanyLocation).then((response) => {
                cy.intercept('/api/globallocation/SaveGlobalLocation').as('saveLocation')
                const locationId = response.body
                cy.navigateAndCheckURL(LOCATION_URL)
                cy.selectLocationTab('globalLocations')
                cy.searchGlobalLocations(newCompanyLocation.globalLocationName)
                cy.viewAndSelectEditGlobalLocation(locationId, newCompanyLocation.globalLocationName)
                cy.globalLocationFormRetainData(newCompanyLocation.globalLocationName, newCompanyLocation.globalLocationCode, newCompanyLocation.globalLocationCountry, 6)
                cy.removeGlobalLocationsAPI(locationId, userData)
            })
        })
    })

    describe('searching global locations', () => {
        let locationId
        const newCompanyLocation = {
            globalLocationName: stringGen(30),
            globalLocationCode: stringGen(9),
            globalLocationCountry: 'Bhutan'
        }

        before(() => {
            cy.addGlobalLocationsAPI(userData, newCompanyLocation).then((response) => {
                locationId = response.body
            })
        })

        beforeEach(() => {
            cy.navigateAndCheckURL(LOCATION_URL)
            cy.selectLocationTab('globalLocations')
        })

        after(() => {
            cy.removeGlobalLocationsAPI(locationId, userData)
        })

        it('i must be able to search by location name', () => {
            cy.searchGlobalLocations(newCompanyLocation.globalLocationName)
            cy.checkGlobalLocationsOverview(locationId, newCompanyLocation)
        })

        it('i must be able to search by location code', () => {
            cy.searchGlobalLocations(newCompanyLocation.globalLocationCode)
            cy.checkGlobalLocationsOverview(locationId, newCompanyLocation)
        })

        it('i must be able to search by location country', () => {
            cy.searchGlobalLocations(newCompanyLocation.globalLocationCountry)
            cy.checkGlobalLocationsOverview(locationId, newCompanyLocation)
        })

        it('searching for invalid location displays no results', () => {
            cy.searchGlobalLocations('QWERTYUIOPLKNHGFDSAZXCVBNM')
            cy.globalLocationsNotOnOverview(locationId, newCompanyLocation.locationName)
        })

        // SKIPPED DUE TO BUG - https://trello.com/c/2diWnr5O/1156-global-locations-canceling-out-of-form-will-remove-the-users-current-search
        it.skip('canceling out of form still displays existing search', () => {
            cy.searchGlobalLocations(newCompanyLocation.globalLocationName)
            cy.checkGlobalLocationsOverview(locationId, newCompanyLocation)
            cy.openGlobalLocationsForm()
            cy.cancelForm()
            cy.checkGlobalLocationsOverview(locationId, newCompanyLocation)
        })
    })
})