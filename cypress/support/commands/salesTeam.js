const salesTeamSelectors = {
  salesTeamForm: {
    addSalesTeamMemberButton: '.primary-btn[data-target="#addSalesTeamMemberDialog"]',
    saveSalesTeamUser: '#addSalesTeamButtonSave',
    removeSalesTeamUser: 'a.del-cont',
  },

  addedUser: {
    salesUserName: '.cc-name',
    salesUserJobTitle: '.cc-profile .cc-title',
    salesUserLocation: '.cc-profile .cc-skill',
    salesUserEmail: '.cc-profile .cc-mail.cc-item',
    salesUserAddress: '.cc-address .row-icon.address-icon',
    salesUserNumber: '.col-auto.image-icon.mobile-icon',
    salesUserRole: '.flag-role',
  },
}

const { addSalesTeamMemberButton, saveSalesTeamUser, removeSalesTeamUser } = salesTeamSelectors.salesTeamForm
const { salesUserName, salesUserJobTitle, salesUserLocation, salesUserEmail, salesUserAddress, salesUserNumber, salesUserRole } = salesTeamSelectors.addedUser

const searchForm = {
  salesTeamMember: {
    id: 'AddSalesTeamMember_ddlSalesTeamMember',
    type: 'select2select',
  },

  salesRole: {
    id: 'AddSalesTeamMember_ddlSalesTeamRole',
    type: 'select',
    option: { force: true },
  },
}


Cypress.Commands.add('addSalesTeamMember', (type, newSearch, salesUserId,
  { salesName, salesJobTitle, salesLocation, salesEmail, salesAddress, salesNumber, salesRole }
) => {
  const salesTeamUserID = (selector) => `.contact-item[data-id="${salesUserId}"] ${selector}`

  cy.get(addSalesTeamMemberButton).click()
  cy.fillForm(searchForm, newSearch)
  cy.get(saveSalesTeamUser).click()

  cy.loadingModel()

  cy.wait(4000)

  //check user added
  cy.get(`.contact-item[data-id="${salesUserId}"]`).should('be.visible')
  cy.get(salesTeamUserID(salesUserName)).contains(salesName)
  cy.get(salesTeamUserID(salesUserJobTitle)).contains(salesJobTitle)
  cy.get(salesTeamUserID(salesUserLocation)).contains(salesLocation)
  cy.get(salesTeamUserID(salesUserEmail)).contains(salesEmail)
  cy.get(salesTeamUserID(salesUserNumber)).contains(salesNumber)
  cy.get(salesTeamUserID(salesUserRole)).contains(salesRole)
})

Cypress.Commands.add('editSalesTeamMember', (type, newSearch, salesUserId,
  { salesName, salesJobTitle, salesLocation, salesEmail, salesAddress, salesNumber, salesRole,editSalesRole }
) => {
  const salesTeamUserID = (selector) => `.contact-item[data-id="${salesUserId}"] ${selector}`

  cy.get(addSalesTeamMemberButton).click()
  cy.fillForm(searchForm, newSearch)
  cy.get(saveSalesTeamUser).click()

  cy.waitUntilLoadingModelDisappear()

  cy.wait(4000)

  //check user added
  cy.get(`.contact-item[data-id="${salesUserId}"]`).should('be.visible')
  cy.get(salesTeamUserID(salesUserName)).contains(salesName)
  cy.get(salesTeamUserID(salesUserJobTitle)).contains(salesJobTitle)
  cy.get(salesTeamUserID(salesUserLocation)).contains(salesLocation)
  cy.get(salesTeamUserID(salesUserEmail)).contains(salesEmail)
  cy.get(salesTeamUserID(salesUserNumber)).contains(salesNumber)
  cy.get(salesTeamUserID(salesUserRole)).contains(editSalesRole)
})

Cypress.Commands.add('editSalesTeam', (salesUserId, form, newSearch) => {
  const salesTeamUserID = (selector) => `.contact-item[data-id="${salesUserId}"] ${selector}`

  cy.get(`${salesTeamUserID('.del-cont[data-target="#addSalesTeamMemberDialog"]')}`)
        .click()
        cy.wait(4000)
  cy.fillForm(form, newSearch)
  cy.wait(4000)
  cy.get(saveSalesTeamUser).click()
  cy.waitUntilLoadingModelDisappear()

  cy.wait(4000)
})

Cypress.Commands.add('salesTeamChecker', (salesTeamName, salesTeamRole, salesUserId) => {
  const salesTeamUserID = (selector) => `.contact-item[data-id="${salesUserId}"] ${selector}`

  cy.get(salesTeamUserID(salesUserName)).contains(salesTeamName)
  cy.get(salesTeamUserID(salesUserRole)).contains(salesTeamRole)
})

Cypress.Commands.add('removeSalesTeamMember', (salesUserId, salesTeamUserName) => {
  const salesTeamUserID = (selector) => `.contact-item[data-id="${salesUserId}"] ${selector}`

  cy.get(salesTeamUserID(removeSalesTeamUser))
        .contains('remove')
        .click()
  cy.get('#swal2-title')
        .contains('Remove Member?')
  cy.get('.swal2-confirm.swal2-styled')
        .contains('Remove')
        .click()
  cy.loadingModel()

  cy.wait(4000)
  cy.get(`.contact-item[data-id="${salesUserId}"]`).should('not.exist')
  cy.get('#tab-sales-team').should('not.contain', salesTeamUserName)
})

Cypress.Commands.add('addSalesTeamMemberAPI', (type, { companyId, contactId, dealId, globalUserId, userId, salesTeamRole, subscriberId }) => {
  switch (type) {
    case 'contact':
      cy.request({
        url: '/api/contact/AddContactUser',
        method: 'POST',
        body: {
          'UpdatedBy': userId,
          'UpdatedByGlobalUserId': globalUserId,
          'UserSubscriberId': subscriberId,
          'ContactSubscriberId': subscriberId,
          'GlobalContactId': contactId,
          'GlobalUserId': globalUserId,
          'SalesTeamRole': salesTeamRole,
          'SendInvitation': true
        },
      })
      break

    case 'deal':
      cy.request({
        url: '/api/deal/AddDealSalesTeam',
        method: 'POST',
        body: {
          'DealId': dealId,
          'DealSubscriberId': subscriberId,
          'UpdatedBy': userId,
          'GlobalUserId': globalUserId,
          'SalesTeamRole': salesTeamRole,
          'SendInvitation': true,
          'UpdatedByGlobalUserId': globalUserId,
          'UserSubscriberId': subscriberId
        },
      })
      break

    case 'company':
      cy.request({
        url: '/api/company/addcompanyuser',
        method: 'POST',
        body: {
          'UpdatedBy': userId,
          'CompanyId': companyId,
          'CompanySubscriberId': subscriberId,
          'GlobalUserId': globalUserId,
          'SalesTeamRole': salesTeamRole,
          'SendInvitation': true,
          'UpdatedUserIdGlobal': globalUserId
        },
      })
      break
  }
})

Cypress.Commands.add('deleteSalesTeamUserAPI', (type, deleteUserId, contactId, dealId, companyId, globalUserId, subscriberId) => {
  switch (type) {
    case 'contact':
      cy.request({
        url: `/api/contact/DeleteContactUser/?deleteUserId=${deleteUserId}&contactId=${contactId}&globalUserId=${globalUserId}&subscriberId=${subscriberId}`,
        method: 'GET',
      })
      break
    case 'deal':
      cy.request({
        url: `/api/deal/DeleteDealUser/?deleteUserId=${deleteUserId}&dealId=${dealId}&globalUserId=${globalUserId}&dealSubscriberId=${subscriberId}&userSubscriberId=${subscriberId}`,
        method: 'GET',
      })
      break

    case 'company':
      cy.request({
        url: `/api/company/DeleteCompanyUser/?deleteUserId=${deleteUserId}&companyId=${companyId}&userIdGlobal=${globalUserId}&companySubscriberId=${subscriberId}&deleteUserSubscriberId=${subscriberId}`,
        method: 'GET',
      })
  }
})
