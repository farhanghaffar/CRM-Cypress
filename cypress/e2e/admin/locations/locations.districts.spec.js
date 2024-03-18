/// <reference types="Cypress" />

import { numGen, stringGen } from '../../../support/helpers'
import { LOCATION_URL } from '../../../urls'
import { locationDistrictForm } from '../../../forms';
const users = Cypress.env('users')
const subscriberId = Cypress.env('subscriberId')

const crmAdminGlobalUserId = users['crmAdmin'].globalUserId
const crmAdminUserId = users['crmAdmin'].userId

const userData = {
    subscriberId: subscriberId,
    userId: crmAdminUserId,
    globalUserId: crmAdminGlobalUserId
}


context('locations.districts', () => {
    before(() => {
        cy.APILogin('crmAdmin')
    })

    describe('districts validation', () => {

        before(() => {
            cy.navigateAndCheckURL(LOCATION_URL)
            cy.selectLocationTab('districs')
            cy.openDistrictsForm()
        })

        it('district code and country are required', () => {
            cy.saveForm()
            cy.districtFormValidationChecker();
        })

        it('close districts form', () => {
            cy.cancelForm()
            cy.get('#divDistrictsTab')
                .should('be.visible')
        })
    })

    describe('districts functionality', () => {
        before(() => {
            cy.navigateAndCheckURL(LOCATION_URL)
            cy.selectLocationTab('districs')
        })

        it('i must be able to add a district', () => {
            cy.intercept('/api/district/SaveDistrict').as('saveDistrict')
            const newDistrict = {
                districtName: `DISTRICT ${stringGen(10)}`,
                districtCode: stringGen(3),
                districtCountry: 'United Kingdom'
            }
            cy.openDistrictsForm()
            cy.fillForm(locationDistrictForm, newDistrict)
            cy.saveForm()
            cy.wait('@saveDistrict').then((xhr) => {
                const districtId = xhr.response.body
                cy.checkDistrictsOverview(districtId, newDistrict)
                cy.removeDistrictAPI(districtId, userData)
            })
        })

        it('i must be able to edit a district', () => {
            const districtData = {
                districtName: stringGen(13),
                districtCode: numGen(4),
                countryName: 'United Kingdom'
            }
            cy.addDistrictAPI(userData, districtData).then((response) => {
                const districtId = response.body
                cy.navigateAndCheckURL(LOCATION_URL)
                cy.selectLocationTab('districs')
                cy.viewAndSelectEditDistrict(districtId, districtData.districtName)

                const editForm = {
                    districtName: `DISTRICT ${stringGen(10)}`,
                    districtCode: stringGen(3),
                    districtCountry: 'United Kingdom'
                }
                cy.fillForm(locationDistrictForm, editForm)
                cy.saveForm()
                cy.checkDistrictsOverview(districtId, editForm)
                cy.removeDistrictAPI(districtId, userData)
            })
        })

        it('i must be able to delete a district', () => {
            const districtData = {
                districtName: stringGen(8),
                districtCode: numGen(3),
                countryName: 'United Kingdom'
            }
            cy.addDistrictAPI(userData, districtData).then((response) => {
                const districtId = response.body
                cy.intercept(`/api/district/deletedistrict/?districtid=${districtId}&userId=${crmAdminUserId}&subscriberId=${subscriberId}`).as('deleteDistrict')
                cy.navigateAndCheckURL(LOCATION_URL)
                cy.selectLocationTab('districs')
                cy.viewAndSelectEditDistrict(districtId, districtData.districtName)
                cy.deleteForm()
                cy.deleteModal('Delete District!', 'Are you sure you want to delete this district?', 'delete')
                cy.wait('@deleteDistrict')
                cy.districtNotOnOverview(districtId, districtData.districtName)
            })
        })
    })
})