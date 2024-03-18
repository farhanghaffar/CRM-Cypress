/// <reference types="Cypress" />

import moment from 'moment';
import { numGen, stringGen } from '../../../support/helpers';
import { CAMPAIGN_LIST_URL, COMPANY_ADD_URL, DEAL_ADD_URL, DEAL_LIST_URL } from '../../../urls';
import { campaignsForm } from '../../../forms';
const users = Cypress.env('users')
const subscriberId = Cypress.env('subscriberId')

const crmAdminGlobalUserId = users['crmAdmin'].globalUserId
const crmAdminUserId = users['crmAdmin'].userId
const crmAdminUserName = users['crmAdmin'].details.name

const userData = {
    subscriberId: subscriberId,
    userId: crmAdminUserId,
    globalUserId: crmAdminGlobalUserId
}

const selectCompanyCampaignsDropdown = () => {
    cy.get('.col-md-8:nth-of-type(1) .form-group:nth-of-type(2) .select2.select2-container.select2-container--classic')
        .click()
}

const selectDealCampaignsDropdown = () => {
    cy.get('div.col-md-12:nth-of-type(1) > .form-group:nth-of-type(3) .select2.select2-container.select2-container--classic')
        .click()
}

const campaignIncludedInDropdown = (campaignName) => {
    cy.get('#select2-ddlCampaign-results')
        .should('contain.text', campaignName)
}

const campaignNotIncludedInDropdown = (campaignName) => {
    cy.get('#select2-ddlCampaign-results')
        .should('not.contain.text', campaignName)
}

context('campaigns', () => {
    before(() => {
        cy.APILogin('crmAdmin')
    })

    describe('campaigns validation', () => {
        before(() => {
            cy.navigateAndCheckURL(CAMPAIGN_LIST_URL)
            cy.openCampaginsForm()
        })

        it('name date field is required', () => {
            cy.saveForm()
            cy.campaignFormValidationChecker();
        })

        it('close company locations form', () => {
            cy.cancelForm()
            cy.get('#tblCampaigns')
                .should('be.visible')
        })
    })

    describe('company locations functionality', () => {
        before(() => {
            cy.navigateAndCheckURL(CAMPAIGN_LIST_URL)
        })

        it('Add campaign and see on overview', () => {
            cy.intercept('/api/campaign/SaveCampaign').as('saveCampaign')
            const campaignsData = {
                campaignName: `CAMPAIGN_${stringGen(8)}`,
                // campaignNumber: stringGen(3),
                campaignTypeSearch: 'Global',
                campaignType: 'Global',
                // campaignStartDate: moment().format('YYYY-MM-DD'),
                // campaignEndDate: moment().add(1, 'days').format('YYYY-MM-DD'),
                campaignOwnerSearch: crmAdminUserName,
                campaignOwner: crmAdminUserName,
                campaignComments: `CAMPAIGN COMMENT ${stringGen(20)}`
            }
            cy.openCampaginsForm()
            cy.fillForm(campaignsForm, campaignsData)
            cy.saveForm()
            cy.wait('@saveCampaign').then((xhr) => {
                const campaignId = xhr.response.body
                cy.checkCampaignOverview(campaignId, 'Active', campaignsData)
                cy.deleteCampaignAPI(campaignId, userData.userId, subscriberId)
            })
        })

        it('Selecting campaign displays all data on edit form', () => {
            const campaignData = {
                campaignName: `CAMPAIGN_${stringGen(7)}`,
                campaignNumber: numGen(6),
                campaignTypeSearch: 'Local',
                campaignType: 'Local',
                campaignStatus: 'Inactive',
                campaignComments: 'TEST',
                campaignOwner: crmAdminUserName,
                campaignStartDate: moment().format('YYYY-MM-DD'),
                campaignEndDate: moment().add(5, 'days').format('YYYY-MM-DD')
            }
            cy.addCampaignAPI(userData, campaignData).then((response) => {
                const campaignId = response.body
                cy.navigateAndCheckURL(CAMPAIGN_LIST_URL)
                cy.viewAndSelectEditCampaign(campaignId, campaignData.campaignName)
                cy.campaignFormData(campaignData)
                cy.deleteCampaignAPI(campaignId, userData.userId, subscriberId)
            })
        })

        it('Edit campaign', () => {
            const campaignData = {
                campaignName: `CAMPAIGN_${stringGen(7)}`,
                campaignNumber: numGen(6),
                campaignStartDate: moment().format('YYYY-MM-DD'),
                campaignEndDate: moment().add(5, 'days').format('YYYY-MM-DD')
            }

            cy.addCampaignAPI(userData, campaignData).then((response) => {
                const campaignId = response.body
                const editCampaign = {
                    campaignName: `EDIT_${stringGen(4)}`,
                    campaignNumber: stringGen(3),
                    campaignTypeSearch: 'Local',
                    campaignType: 'Local',
                    campaignStartDate: moment().add(5, 'days').format('YYYY-MM-DD'),
                    campaignEndDate: moment().add(10, 'days').format('YYYY-MM-DD'),
                    campaignOwnerSearch: crmAdminUserName,
                    campaignOwner: crmAdminUserName,
                    campaignComments: `CAMPAIGN COMMENT ${stringGen(20)}`
                }
                cy.navigateAndCheckURL(CAMPAIGN_LIST_URL)
                cy.viewAndSelectEditCampaign(campaignId, campaignData.campaignName)
                cy.fillForm(campaignsForm, editCampaign)
                cy.saveForm()
                cy.checkCampaignOverview(campaignId, 'Active', editCampaign)
                cy.deleteCampaignAPI(campaignId, userData.userId, subscriberId)
            })
        })

        it('Delete campaign', () => {
            const campaignData = {
                campaignName: `CAMPAIGN_${stringGen(7)}`,
                campaignNumber: numGen(6),
                campaignStartDate: moment().format('YYYY-MM-DD'),
                campaignEndDate: moment().add(5, 'days').format('YYYY-MM-DD')
            }

            cy.addCampaignAPI(userData, campaignData).then((response) => {
                const campaignId = response.body
                cy.intercept(`/api/campaign/deletecampaign/?campaignId=${campaignId}&userId=${userData.userId}&subscriberId=${subscriberId}`).as('deleteCampaign')
                cy.navigateAndCheckURL(CAMPAIGN_LIST_URL)
                cy.viewAndSelectEditCampaign(campaignId, campaignData.campaignName)
                cy.deleteForm()
                cy.deleteModal('Delete Campaign!', 'Are you sure you want to delete this campaign?', 'delete')
                cy.wait('@deleteCampaign')
                cy.campaignNotOnOverview(campaignId, campaignData.campaignName)
            })
        })

        describe('active campaign check', () => {
            let campaignId
            const campaignData = {
                campaignName: `CAMPAIGN_${stringGen(7)}`,
                campaignNumber: numGen(6),
                campaignStartDate: moment().format('YYYY-MM-DD'),
                campaignEndDate: moment().add(5, 'days').format('YYYY-MM-DD')
            }
            before(() => {
                cy.addCampaignAPI(userData, campaignData).then((response) => {
                    campaignId = response.body
                })
            })

            after(() => {
                cy.deleteCampaignAPI(campaignId, userData.userId, subscriberId)
            })

            it('active campaign displays on campaign dropdown on company form', () => {
                cy.navigateAndCheckURL(COMPANY_ADD_URL)
                cy.companyAlreadyExists(stringGen(20))
                cy.wait(2000)
                selectCompanyCampaignsDropdown()
                campaignIncludedInDropdown(campaignData.campaignName)
            })

            it('active campaign displays on campaign dropdown on deal form', () => {
                cy.navigateAndCheckURL(DEAL_LIST_URL)
                cy.openDealForm()
                selectDealCampaignsDropdown()
                campaignIncludedInDropdown(campaignData.campaignName)
            })
        })

        describe('inactive campaign check', () => {
            let campaignId
            const campaignData = {
                campaignName: `CAMPAIGN_${stringGen(7)}`,
                campaignNumber: numGen(6),
                campaignStatus: 'Inactive',
                campaignStartDate: moment().format('YYYY-MM-DD'),
                campaignEndDate: moment().add(5, 'days').format('YYYY-MM-DD')
            }
            before(() => {
                cy.addCampaignAPI(userData, campaignData).then((response) => {
                    campaignId = response.body
                })
            })

            after(() => {
                cy.deleteCampaignAPI(campaignId, userData.userId, subscriberId)
            })

            it('inactive campaign does not display on campaign dropdown on company form', () => {
                cy.navigateAndCheckURL(COMPANY_ADD_URL)
                cy.companyAlreadyExists(stringGen(20))
                cy.wait(2000)
                selectCompanyCampaignsDropdown()
                campaignNotIncludedInDropdown(campaignData.campaignName)
            })

            it('inactive campaign does not display on campaign dropdown on deal form', () => {
                cy.navigateAndCheckURL(DEAL_LIST_URL)
                cy.openDealForm()
                selectDealCampaignsDropdown()
                campaignNotIncludedInDropdown(campaignData.campaignName)
            })
        })
    })
})