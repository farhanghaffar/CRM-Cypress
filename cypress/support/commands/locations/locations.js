Cypress.Commands.add('selectLocationTab', (tab) => {
    const selectTab = (tabId) => {
        cy.get('.border-tabs')
            .should('be.visible')

        cy.get(`.border-tabs > [data-id="${tabId}"]`)
            .click()
            .should('have.class', 'active')
    }


    switch (tab) {
        case 'companyLocations':
            selectTab('#divLocationsTab')
            break

        case 'districs':
            selectTab('#divDistrictsTab')
            break;

        case 'globalLocations':
            selectTab('#divGlobalLocationsTab')
            break;

        case 'regions':
            selectTab('#divRegionsTab')
            break;

        case 'countriesToRegions':
            selectTab('#divCountriesRegionsTab')
            cy.wait(2000)
            break;
    }
})