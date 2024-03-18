const companyLocationsSelectors = {
    form: {
        districtNameInput: '#txtDistrictName',
        districtCode: '#txtDistrictCode',
        districtCodeError: '#txtDistrictCode-error',
        districtCountry: '[aria-labelledby="select2-ddlCountry-container"]',
        districtCountryError: '#ddlCountry-error'
    },

    overview: {
        addDistrict: '.new-district'
    }
}

const { districtNameInput, districtCode, districtCodeError, districtCountry, districtCountryError } = companyLocationsSelectors.form;
const { addDistrict } = companyLocationsSelectors.overview;

const specificDistrictSelector = (districtId) => `#tblDistricts > tbody > tr[data-id="${districtId}"]`
Cypress.Commands.add('districtFormValidationChecker', () => {
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

    checkFieldValidationClass(districtCode)
    checkFieldValidationClass(districtCodeError)
    checkFieldValidationClass(districtCountryError)
    checkFieldValidationBorder(districtCode)
    checkFieldValidationBorder(districtCountry)

    checkErrorText(districtCodeError, 'Enter the district code')
    checkErrorText(districtCountryError, 'Select a country')
})

Cypress.Commands.add('openDistrictsForm', () => {
    cy.get(addDistrict)
        .should('contain.text', 'District')
        .click()
})

Cypress.Commands.add('checkDistrictsOverview', (districtId, { districtName, districtCode, districtCountry }) => {
    cy.get('#tblDistricts > thead > tr > th').should(($districtHeaders) => {
        expect($districtHeaders, '4 items').to.have.length(4)
        expect($districtHeaders.eq(0)).to.have.text('Name')
        expect($districtHeaders.eq(1)).to.have.text('Code')
        expect($districtHeaders.eq(2)).to.have.text('Country')
    })

    cy.get(`${specificDistrictSelector(districtId)} td`).should(($districtBody) => {
        expect($districtBody, '4 items').to.have.length(4)
        expect($districtBody.eq(0)).to.have.text(districtName)
        expect($districtBody.eq(1)).to.have.text(districtCode)
        expect($districtBody.eq(2)).to.have.text(districtCountry)
    })
})

Cypress.Commands.add('viewAndSelectEditDistrict', (districtId, districtName) => {
    cy.get(`${specificDistrictSelector(districtId)} td:nth-of-type(1)`)
        .should('have.text', districtName)
    cy.get(`${specificDistrictSelector(districtId)} .hover-link.edit-district`)
        .click()
    cy.wait(3000)
    cy.get(`${districtNameInput}[value="${districtName}"]`)
        .should('exist')
})

Cypress.Commands.add('districtNotOnOverview', (districtId, districtName) => {
    cy.get('#tblDistricts').should('be.visible')
    cy.get(specificDistrictSelector(districtId))
        .should('not.exist')

    cy.get('#tblLocations')
        .should('not.contain.text', districtName)
})

Cypress.Commands.add('addDistrictAPI', ({ subscriberId, userId }, { districtId = 0, districtName, districtCode, countryName }) => {
    cy.request({
        url: '/api/district/SaveDistrict',
        method: 'POST',
        body: { 
            "DistrictId": districtId, 
            "SubscriberId": subscriberId, 
            "DistrictName": districtName, 
            "DistrictCode": districtCode, 
            "CountryName": countryName, 
            "UpdateUserId": userId 
        }
    })
})

Cypress.Commands.add('removeDistrictAPI', (districtId, { userId, subscriberId }) => {
    cy.request({
        url: `/api/district/deletedistrict/?districtid=${districtId}&userId=${userId}&subscriberId=${subscriberId}`,
        method: 'GET'
    })
})