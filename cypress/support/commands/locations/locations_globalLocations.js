import { locationCompanyLocationsForm } from '../../../forms';

const globalLocationsSelectors = {
    form: {
        globalLocationsNameInput: '#txtLocationName',
        globalLocationsNameError: '#txtLocationName-error[for="txtLocationName"]',
        globalLocationsCodeInput: '#txtLocationCode',
        globalLocationsCodeError: '#txtLocationCode-error[for="txtLocationCode"]',
        countryInput: '[aria-labelledby="select2-ddlCountry-container"]',
        countryError: '#ddlCountry-error[for="ddlCountry"]'
    },

    overview: {
        openForm: '.new-global-location',
        searchInput: '#txtGlobalKeyword'
    }
}

const { globalLocationsNameInput, globalLocationsNameError, globalLocationsCodeInput, globalLocationsCodeError, countryInput, countryError } = globalLocationsSelectors.form;
const { openForm, searchInput } = globalLocationsSelectors.overview;

const specificLocationSelector = (locationId) => `#tblGlobalLocations > tbody > tr[data-id="${locationId}"]`
Cypress.Commands.add('globalLocationsFormValidationChecker', () => {
    const checkFieldValidationClass = (selector) => {
        cy.get(selector)
            .should('have.class', 'error')
    }

    const checkFieldValidationBorder = (selector) => {
        cy.get(selector)
            .should('have.css', 'border-color')
            .and('eq', 'rgb(205, 43, 30)')
    }

    const checkErrorText = (selector, errorString) => {
        cy.get(selector)
            .should('have.text', errorString)
            .should('have.css', 'color')
            .and('eq', 'rgb(205, 43, 30)')
    }

    checkFieldValidationClass(globalLocationsNameInput)
    checkFieldValidationBorder(globalLocationsNameInput)
    checkFieldValidationClass(globalLocationsCodeInput)
    checkFieldValidationBorder(globalLocationsCodeInput)
    checkFieldValidationBorder(countryInput)

    checkErrorText(globalLocationsNameError, 'Enter the location name')
    checkErrorText(globalLocationsCodeError, 'Enter the location code')
    checkErrorText(countryError, 'Select a country')
})

Cypress.Commands.add('openGlobalLocationsForm', () => {
    cy.get(openForm)
        .should('contain.text', 'Global Location')
        .click()
})

Cypress.Commands.add('checkGlobalLocationsOverview', (locationsId, { globalLocationName, globalLocationCode, globalLocationCountry }) => {
    cy.get('#tblGlobalLocations > thead > tr > th').should(($locationsHeaders) => {
        expect($locationsHeaders, '10 items').to.have.length(10)
        expect($locationsHeaders.eq(0)).to.have.text('Location')
        expect($locationsHeaders.eq(1)).to.have.text('Code')
        expect($locationsHeaders.eq(2)).to.have.text('Country')
        expect($locationsHeaders.eq(3)).to.have.text('Air')
        expect($locationsHeaders.eq(4)).to.have.text('Inland Port')
        expect($locationsHeaders.eq(5)).to.have.text('Multi Modal')
        expect($locationsHeaders.eq(6)).to.have.text('Rail')
        expect($locationsHeaders.eq(7)).to.have.text('Road')
        expect($locationsHeaders.eq(8)).to.have.text('Seaport')
    })

    cy.get(`${specificLocationSelector(locationsId)} td`).should(($locationsBody) => {
        expect($locationsBody, '10 items').to.have.length(10)
        expect($locationsBody.eq(0)).to.have.text(globalLocationName)
        expect($locationsBody.eq(1)).to.have.text(globalLocationCode)
        expect($locationsBody.eq(2)).to.have.text(globalLocationCountry)
    })
})

Cypress.Commands.add('globalLocationFormRetainData', (locationName, locationCode, locationCountry, laneLength) => {
    cy.get(`${globalLocationsNameInput}[value="${locationName}"]`)
        .should('exist')
    cy.get(`${globalLocationsCodeInput}[value="${locationCode}"]`)
        .should('exist')

    // SKIPPED DUE TO A BUG - https://trello.com/c/AUFt9xoq/1157-global-locations-country-value-isnt-carried-over-to-edit-form
    cy.get(`${countryInput} > span`)
        .should('have.text', locationCountry)
    cy.get('input[checked="checked"]')
        .should('have.length', laneLength)
})

Cypress.Commands.add('locationTypeChecker', (locationId, indexArray, notPresentIndexArray = []) => {
    // test index's are present. Array must be indexes of the <td> element. For example, 'Air' would be index 4
    indexArray.forEach((instance) => {
        cy.get(`${specificLocationSelector(locationId)} td:nth-of-type(${instance}) > img`)
            // BUG. Cypress viewport is pretty small so unable to see ticked lanes - https://trello.com/c/X1SDlMZE/1155-global-locations-responsive-users-unable-to-see-all-lanes-on-overview
            // .should('be.visible')
            .should('have.attr', 'src', '/_content/_img/icons/temp-check.png')
    })

    notPresentIndexArray.forEach((instance) => {
        cy.get(`${specificLocationSelector(locationId)} td:nth-of-type(${instance}) > img`)
            .should('not.exist')
    })
})

Cypress.Commands.add('viewAndSelectEditGlobalLocation', (locationId, locationName) => {
    cy.get(`${specificLocationSelector(locationId)} td:nth-of-type(1)`)
        .should('have.text', locationName)
    cy.get(`${specificLocationSelector(locationId)} .hover-link.edit-global-location`)
        .click()
    cy.wait(3000)
    cy.get(`${globalLocationsNameInput}[value="${locationName}"]`)
        .should('exist')
})

Cypress.Commands.add('globalLocationsNotOnOverview', (locationId, locationName) => {
    cy.get('#divNoGlobalLocations[class="no-items details-box"] > p.e-text')
        .should('be.visible')
        .and('have.text', 'no global locations')
    cy.get(specificLocationSelector(locationId))
        .should('not.exist')
    cy.get('#divGlobalLocationsTab')
        .should('not.contain.text', locationName)
})

Cypress.Commands.add('searchGlobalLocations', (searchTerm) => {
    cy.intercept('/api/GlobalLocation/GetGlobalLocations/').as('getGlobalLocations')
    cy.get(searchInput)
        .clear()
        .type(`${searchTerm}{enter}`)
    cy.wait('@getGlobalLocations')
})

Cypress.Commands.add('addGlobalLocationsAPI', ({ subscriberId, userId, globalUserId }, { globalLocationId = 0, globalLocationName, globalLocationCode, globalLocationCountry, isAirport = false, isInlandPort = false, isMultiModal = false, isRailTerminal = false, isRoadTerminal = false, isSeaPort = false }) => {
    cy.request({
        url: '/api/globallocation/SaveGlobalLocation',
        method: 'POST',
        body: {
            GlobalLocation: {
                GlobalLocationId: globalLocationId,
                CountryName: globalLocationCountry,
                LocationCode: globalLocationCode,
                LocationName: globalLocationName,
                UpdateUserId: userId,
                Airport: isAirport,
                InlandPort: isInlandPort,
                MultiModal: isMultiModal,
                RailTerminal: isRailTerminal,
                RoadTerminal: isRoadTerminal,
                SeaPort: isSeaPort
            },
            SubscriberId: subscriberId
        }
    })
})

Cypress.Commands.add('removeGlobalLocationsAPI', (globalLocationId, { userId, subscriberId }) => {
    cy.request({
        url: `/api/globallocation/deletegloballocation/?globallocationid=${globalLocationId}&userId=${userId}&subscriberId=${subscriberId}`,
        method: 'GET'
    })
})