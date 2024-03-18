import moment from 'moment';

const campaignsSelectors = {
    form: {
        campaignNameInput: '#txtCampaignName',
        campaignNameError: '#txtCampaignName-error[for="txtCampaignName"]',
        campaignNumberInput: '#txtCampaignNumber',
        campaignNumberError: '#txtCampaignNumber-error[for="txtCampaignNumber"]',
        campaignTypeInput: '#ddlCampaignType',
        startDate: '#txtStartDate',
        endDate: '#txtEndDate',
        campaignOwnerInput: '#ddlCampaignOwner',
        campaignCommentsInput: '#txtComments',
        activeToggle: '#rbtActive',
        inactiveToggle: '#rbtInactive',
    },

    overview: {
        openForm: '.new-campaign'
    }
}

const { campaignNameInput, campaignNameError, campaignNumberInput, campaignNumberError, campaignTypeInput, startDate, endDate, campaignOwnerInput, campaignCommentsInput, activeToggle, inactiveToggle } = campaignsSelectors.form;
const { openForm } = campaignsSelectors.overview;

const specificLocationSelector = (campaignId) => `#tblCampaigns > tbody > tr[data-id="${campaignId}"]`

Cypress.Commands.add('openCampaginsForm', () => {
    cy.get(openForm)
        .contains('Campaign')
        .click()
})

Cypress.Commands.add('campaignFormValidationChecker', () => {
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

    checkFieldValidationClass(campaignNameInput)
    checkFieldValidationBorder(campaignNameInput)
    // checkFieldValidationClass(campaignNumberInput)
    // checkFieldValidationBorder(campaignNumberInput)
    // checkFieldValidationClass(startDate)
    // checkFieldValidationBorder(startDate)
    // checkFieldValidationClass(endDate)
    // checkFieldValidationBorder(endDate)

    checkErrorText(campaignNameError, 'Enter the campaign name')
    // checkErrorText(campaignNumberError, 'Enter the campaign number')
})

Cypress.Commands.add('checkCampaignOverview', (campaignId, campaignStatus, { campaignName, campaignType, campaignStartDate, campaignEndDate, campaignOwner }) => {
    // campaign headers
    cy.get('#tblCampaigns > thead > tr > th').should(($campaignsHeaders) => {
        expect($campaignsHeaders, '7 items').to.have.length(7)
        expect($campaignsHeaders.eq(0)).to.have.text('Campaign Name')
        expect($campaignsHeaders.eq(1)).to.have.text('Type')
        expect($campaignsHeaders.eq(2)).to.have.text('Start Date')
        expect($campaignsHeaders.eq(3)).to.have.text('End Date')
        expect($campaignsHeaders.eq(4)).to.have.text('Owner')
        expect($campaignsHeaders.eq(5)).to.have.text('Status')
    })

    // campaign
    cy.get(`${specificLocationSelector(campaignId)} td`).should(($campaignsBody) => {
        expect($campaignsBody, '7 items').to.have.length(7)
        expect($campaignsBody.eq(0)).to.have.text(campaignName)
        expect($campaignsBody.eq(1)).to.have.text(campaignType)
        expect($campaignsBody.eq(2)).to.have.text(moment(campaignStartDate).format('DD-MMM-YY'))
        expect($campaignsBody.eq(3)).to.have.text(moment(campaignEndDate).format('DD-MMM-YY'))
        expect($campaignsBody.eq(4)).to.contain(campaignOwner)
        expect($campaignsBody.eq(5)).to.have.text(campaignStatus)
    })
})

Cypress.Commands.add('viewAndSelectEditCampaign', (campaignId, campaignName) => {
    cy.get(`${specificLocationSelector(campaignId)} td:nth-of-type(1)`)
        .should('have.text', campaignName)
    cy.get(`${specificLocationSelector(campaignId)} .hover-link.edit-campaign`)
        .click()
    cy.wait(3000)
    cy.get(`${campaignNameInput}[value="${campaignName}"]`)
        .should('exist')
})

Cypress.Commands.add('campaignFormData', ({ campaignName, campaignNumber, campaignType, campaignStartDate, campaignEndDate, campaignOwner, campaignComments }) => {
    cy.get(`${campaignNameInput}[value="${campaignName}"]`)
        .should('exist')
    cy.get(`${campaignNumberInput}[value="${campaignNumber}"]`)
        .should('exist')
    cy.get(`#select2-ddlCampaignType-container`)
        .should('have.text', campaignType)
    cy.get(`${startDate}[value="${moment(campaignStartDate).format('DD-MMM-YY')}"]`)
        .should('exist')
    cy.get(`${endDate}[value="${moment(campaignEndDate).format('DD-MMM-YY')}"]`)
        .should('exist')
    cy.get(`#select2-ddlCampaignOwner-container`)
        .should('have.text', campaignOwner)
    cy.get(campaignCommentsInput).should('have.text', campaignComments)
})

Cypress.Commands.add('campaignNotOnOverview', (campaignId, campaignName) => {
    cy.get('#tblCampaigns').should('be.visible')
    cy.get(specificLocationSelector(campaignId))
        .should('not.exist')

    cy.get('#tblCampaigns')
        .should('not.contain.text', campaignName)
})

Cypress.Commands.add('addCampaignAPI', ({ subscriberId, userId, globalUserId }, { campaignId = 0, campaignName, campaignNumber, campaignStatus = 'Active', campaignType = 'Global', campaignComments = '', campaignStartDate, campaignEndDate }) => {
    cy.request({
        url: '/api/campaign/SaveCampaign',
        method: 'POST',
        body: {
            CampaignId: campaignId,
            SubscriberId: subscriberId,
            CampaignName: campaignName,
            CampaignNumber: campaignNumber,
            CampaignOwnerUserIdGlobal: globalUserId,
            CampaignStatus: campaignStatus,
            CampaignType: campaignType,
            Comments: campaignComments,
            StartDate: campaignStartDate,
            EndDate: campaignEndDate,
            UpdateUserIdGlobal: globalUserId
        }
    })
})

Cypress.Commands.add('deleteCampaignAPI', (campaignId, userId, subscriberId) => {
    cy.request({
        url: `/api/campaign/deletecampaign/?campaignId=${campaignId}&userId=${userId}&subscriberId=${subscriberId}`,
        method: 'GET',
    })
})