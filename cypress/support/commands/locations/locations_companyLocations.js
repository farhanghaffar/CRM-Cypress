const companyLocationsSelectors = {
    form: {
        locationNameInput: '#txtLocationName',
        locationNameError: '#txtLocationName-error[for="txtLocationName"]',
        locationCodeInput: '#txtLocationCode',
        locationCodeError: '#txtLocationCode-error[for="txtLocationCode"]',
        countryInput: '[aria-labelledby="select2-ddlCountry-container"]',
        countryError: '#ddlCountry-error[for="ddlCountry"]',
        regionInput: '[aria-labelledby="select2-ddlRegion-container"]',
        regionError: '#ddlRegion-error[for="ddlRegion"]',
    },

    overview: {
        openForm: '.new-location'
    }
}

const { locationNameInput, locationNameError, locationCodeInput, locationCodeError, countryInput, countryError, regionInput, regionError } = companyLocationsSelectors.form;
const { openForm } = companyLocationsSelectors.overview;

const specificLocationSelector = (locationId) => `#tblLocations > tbody > tr[data-id="${locationId}"]`
Cypress.Commands.add('requiredValidationChecker', () => {
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

    checkFieldValidationClass(locationNameInput)
    checkFieldValidationBorder(locationNameInput)
    checkFieldValidationClass(locationCodeInput)
    checkFieldValidationBorder(locationCodeInput)
    checkFieldValidationBorder(countryInput)
    checkFieldValidationBorder(regionInput)

    checkErrorText(locationNameError, 'Enter the location name')
    checkErrorText(locationCodeError, 'Enter the location code')
    checkErrorText(countryError, 'Select a country')
    checkErrorText(regionError, 'Select a region')
})

Cypress.Commands.add('openCompanyLocationsForm', () => {
    cy.get(openForm)
        .should('contain.text', 'Location')
        .click()
})

Cypress.Commands.add('checkCompanyLocationsOverview', (locationsId, { locationName, locationCode, locationType, locationAddress, locationCountry, locationPhone }) => {
    cy.get('#tblLocations > thead > tr > th').should(($locationsHeaders) => {
        expect($locationsHeaders, '7 items').to.have.length(7)
        expect($locationsHeaders.eq(0)).to.have.text('Name')
        expect($locationsHeaders.eq(1)).to.have.text('Code')
        expect($locationsHeaders.eq(2)).to.have.text('Type')
        expect($locationsHeaders.eq(3)).to.have.text('Address')
        expect($locationsHeaders.eq(4)).to.have.text('Country')
        expect($locationsHeaders.eq(5)).to.have.text('Phone')
    })

    cy.get(`${specificLocationSelector(locationsId)} td`).should(($locationsBody) => {
        expect($locationsBody, '7 items').to.have.length(7)
        expect($locationsBody.eq(0)).to.have.text(locationName)
        expect($locationsBody.eq(1)).to.have.text(locationCode)
        expect($locationsBody.eq(2)).to.have.text(locationType)
        expect($locationsBody.eq(3)).to.have.text(locationAddress)
        expect($locationsBody.eq(4)).to.have.text(locationCountry)
        expect($locationsBody.eq(5)).to.have.text(locationPhone)
    })
})

Cypress.Commands.add('viewAndSelectEditCompanyLocation', (locationId, locationName) => {
    cy.get(`${specificLocationSelector(locationId)} td:nth-of-type(1)`)
        .should('have.text', locationName)
    cy.get(`${specificLocationSelector(locationId)} .hover-link.edit-location`)
        .click()
    cy.wait(3000)
    cy.get(`${locationNameInput}[value="${locationName}"]`)
        .should('exist')
})

Cypress.Commands.add('locationNotOnOverview', (locationId, locationName) => {
    cy.get('#tblLocations').should('be.visible')
    cy.get(specificLocationSelector(locationId))
        .should('not.exist')

    cy.get('#tblLocations')
        .should('not.contain.text', locationName)
})

Cypress.Commands.add('searchCompanyLocationOverview', (locationId, locationName, type) => {
    cy.searchResults(locationName)

    if(type == 'valid') {
        cy.get('#tblLocations > tbody > tr')
            .should('have.length', 1)
        cy.get(`${specificLocationSelector(locationId)} td:nth-of-type(1)`)
            .should('have.text', locationName)
    } else {
        cy.get('#tblLocations > tbody')
            .should('not.be.visible')
    }
})

Cypress.Commands.add('addCompanyLocationAPI', ({ subscriberId, userId, globalUserId }, { address = '', city = '', comments = '', countryName, districtCode = 0, fax = '', locationCode, locationName, locationType = 'Branch', phone = '', postCode = '', stateProvince = '', regionName }) => {
    cy.request({
        url: '/api/location/SaveLocation',
        method: 'POST',
        body: {
            "Location": {
                LocationId: 0,
                SubscriberId: subscriberId,
                Address: address,
                City: city,
                Comments: comments,
                CountryName: countryName,
                DistrictCode: districtCode,
                Fax: fax,
                LocationCode: locationCode,
                LocationName: locationName,
                LocationType: locationType,
                Phone: phone,
                PostalCode: postCode,
                StateProvince: stateProvince,
                RegionName: regionName,
                UpdateUserId: userId
            },
            UpdateByGlobalUserId: globalUserId
        }
    })
})

Cypress.Commands.add('removeCompanyLocationAPI', (locationId, { userId, subscriberId }) => {
    cy.request({
        url: `/api/location/deletelocation/?locationid=${locationId}&userId=${userId}&subscriberId=${subscriberId}`,
        method: 'GET'
    })
})