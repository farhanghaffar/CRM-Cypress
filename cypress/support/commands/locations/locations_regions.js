import { locationRegionForm } from '../../../forms';

const locationsSelectors = {
    regions: {
        addRegionButton: 'a.new-region',
        editRegionButton: 'a.edit-region',
        regionNameForm: 'input#txtRegionName',
        saveRegionFormButton: 'button#btnSave',
        regionTable: 'table#tblRegions'
    }
}

const { addRegionButton, editRegionButton, regionNameForm, saveRegionFormButton, regionTable } = locationsSelectors.regions;

const selectEditRegion = (regionId, subscriberId) => {
    cy.get(`tr[data-id="${regionId}"] ${editRegionButton}`)
        .click()
}

Cypress.Commands.add('selectAddRegionButton', () => {
    cy.get(addRegionButton)
        .contains('Region')
        .click()
})

Cypress.Commands.add('addRegion', (regionData) => {
    cy.selectAddRegionButton()
    cy.fillForm(locationRegionForm, regionData)
    cy.get(saveRegionFormButton)
        .click();
})

Cypress.Commands.add('editRegion', (subscriberId, regionId, editedRegionName) => {
    selectEditRegion(regionId)
    cy.get(regionNameForm)
        .clear()
        .type(editedRegionName)
    cy.get(saveRegionFormButton)
        .click();
})

Cypress.Commands.add('deleteRegion', (type, regionId, subscriberId) => {
    cy.intercept({
        url: `/api/CountryRegions/GetCountries?subscriberid=${subscriberId}`,
        method: 'GET'
    }).as('openRegion')
    switch (type) {
        case 'regionPage':
            cy.get(`tr[data-id="${regionId}"] a.delete-item`)
                .click();
            break;

        case 'specificPage':
            selectEditRegion(regionId, subscriberId)
            cy.get('#btnDelete')
                .click()
            break;
    }

    cy.deleteModal('Delete Region!', 'Are you sure you want to delete this region?', 'delete')
    cy.wait(3000)
    cy.selectLocationTab('regions')
    cy.wait('@openRegion')
})

Cypress.Commands.add('checkRegionData', (type, regionId, regionName) => {
    switch (type) {
        case 'data':
            cy.get(`${regionTable} tr[data-id="${regionId}"] > td`)
                .should('contain.text', regionName)
            break;

        case 'no-data':
            cy.get('#tblRegions')
                .should('not.contain', regionName)
            break;
    }
})

Cypress.Commands.add('addRegionAPI', (regionName, globalUserId, subscriberId) => {
    cy.request({
        url: '/api/region/SaveRegion',
        method: 'POST',
        body: {
            RegionId: 0,
            RegionName: regionName,
            SubscriberId: subscriberId,
            UpdateUserIdGlobal: globalUserId
        }
    })
})

Cypress.Commands.add('deleteRegionAPI', (regionId, globalUserId, subscriberId) => {
    cy.request({
        url: `/api/region/DeleteRegion/?regionId=${regionId}&userIdGlobal=${globalUserId}&subscriberId=${subscriberId}`,
        method: 'GET'
    })
})