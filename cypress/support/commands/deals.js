import '@4tw/cypress-drag-drop'
const dealsSelectors = {
  tabs: {
    overview: '.desktop-panel-nav > #deal-tabs li > a[href="#tab-overview"]',
    quotes: '.desktop-panel-nav > #deal-tabs li >  a[href="#tab-quotes"]',
    events: '.desktop-panel-nav > #deal-tabs li[data-type="events"]',
    tasks: '.desktop-panel-nav > #deal-tabs li[data-type="tasks"]',
    notes: '.desktop-panel-nav > #deal-tabs li[data-type="notes"]',
    documents: '.desktop-panel-nav > #deal-tabs li[data-type="documents"]',
    contact: '.desktop-panel-nav > #deal-tabs li[data-type="contacts"]',
    salesTeam: '.desktop-panel-nav > #deal-tabs li[data-type="salesteam"]',
    activity: '.desktop-panel-nav > #deal-tabs li[data-type="activity"]',
  },

  dealOverview: {
    dealName: '#lblDealNameTop',
    dealStage: '#lblSalesStage',
    editDeal: '.desktop-header-dropdown .edit-button',
    listToggle: '.icon[data-view="list"]',
  },

  dealForm: {
    dealStageItem: '.select2-results__option',
  },

  lanes: {
    addLane: '.edit_link[data-action="new-lane"]',
  },

  activeToggle: '.active-deal.deals-link',
  inactiveToggle: '.inactive-deal.deals-link',
  closeLaneForm: '.closeX',
}

const { activeToggle, inactiveToggle, closeLaneForm } = dealsSelectors

const { overview, quotes, events, tasks, notes, documents, contact, salesTeam, activity } = dealsSelectors.tabs

const { dealName, dealStage, editDeal, listToggle } = dealsSelectors.dealOverview

const { dealStageItem } = dealsSelectors.dealForm

const { addLane } = dealsSelectors.lanes

Cypress.Commands.add('openDealForm', () => {
  cy.get('#responseGroup2 .add-new-btn > .edit_link')
    .contains('Deal')
    .click()
})

Cypress.Commands.add('toggleListViewFilter', ({ desiredFilter, newFilterWording, newFilterClassName }) => {
  cy.intercept({
    url: '/api/GlobalDeal/GetGlobalDeals',
    method: 'POST',
  }).as('waitDeals')
  cy.get('.ae-dropdown.dropdown')
    .click()

  cy.get('ul.dropdown-nav.btn-deal-stage')
    .should('be.visible')

  const typeSelector = (dealType) => `ul > li[data-status="${dealType}"]`

  cy.get(typeSelector(desiredFilter))
    .contains(newFilterWording)
    .click()

  cy.loadingModel()

  cy.get(`.ae-select-content.${newFilterClassName}`)
    .contains(newFilterWording)

  cy.wait('@waitDeals')
})

Cypress.Commands.add('listViewDeals', ({ idsArray, nameArray, salesStageArray, arrayToInclude, arrayToExclude }) => {
  
  expect(salesStageArray).to.include.members(arrayToInclude)
  expect(salesStageArray).to.not.include.members(arrayToExclude)

  cy.scrollUntilNoNewList();
  for (let i = 0; i < idsArray.length; i++) {
    cy.get(`table > tbody > tr[data-id="${idsArray[i]}"] .hover-link`).scrollIntoView()
      .should('have.text', nameArray[i])
  }
  for (let i = 0; i < idsArray.length; i++) {
    cy.testlistViewSalesStage(salesStageArray[i], idsArray[i])
  }
})

Cypress.Commands.add('testlistViewSalesStage', (type, dealId) => {
  const dealTypeSelector = `table > tbody > tr[data-id="${dealId}"] > td:nth-of-type(5) > div`

  switch (type) {
    case 'Qualifying':
      cy.get(dealTypeSelector)
        .should('have.text', 'Qualifying')
        .should('have.class', 'border-status lblue')
        .should('have.css', 'background-color')
        .and('eq', 'rgb(90, 189, 237)')
      break

    case 'Negotiation':
      cy.get(dealTypeSelector)
        .should('have.text', 'Negotiation')
        .should('have.class', 'border-status mblue')
        .should('have.css', 'background-color')
        .and('eq', 'rgb(30, 146, 210)')
      break

    case 'Trial Shipment':
      cy.get(dealTypeSelector)
        .should('have.text', 'Trial Shipment')
        .should('have.class', 'border-status green')
        .should('have.css', 'background-color')
        .and('eq', 'rgb(3, 146, 128)')
      break

    case 'Final Negotiation':
      cy.get(dealTypeSelector)
        .should('have.text', 'Final Negotiation')
        .should('have.class', 'border-status')
        .should('have.css', 'background-color')
        .and('eq', 'rgb(12, 98, 156)')
      break

    case 'Won':
      cy.get(dealTypeSelector)
        .should('have.text', 'Won')
        .should('have.class', 'border-status dgreen')
        .should('have.css', 'background-color')
        .and('eq', 'rgb(31, 195, 159)')
      break

    case 'Lost':
      cy.get(dealTypeSelector)
        .should('have.text', 'Lost')
        .should('have.class', 'border-status red')
        .should('have.css', 'background-color')
        .and('eq', 'rgb(247, 114, 104)')
      break

    case 'Stalled':
      cy.get(dealTypeSelector)
        .should('have.text', 'Stalled')
        .should('have.class', 'border-status grey')
        .should('have.css', 'background-color')
        .and('eq', 'rgb(255, 237, 189)')
  }
})

Cypress.Commands.add('navigateToListView', (type) => {
  cy.get(listToggle)
    .should('not.have.class', 'active')
    .should('have.css', 'background-color')
    .and('eq', 'rgb(247, 249, 250)')

  cy.get(listToggle)
    .click()

  if (type === 'data') {
    // cy.get('#list-view').should('be.visible')

    cy.get(listToggle)
      .should('have.class', 'active')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(27, 131, 189)')
  }
})

Cypress.Commands.add('navigateToLaneForm', (dealTitle) => {
  cy.get(dealName).should('have.text', dealTitle)
  cy.get(addLane).click()
  cy.get('.btn.btn-primary.active[id="btnAir"]')
    .should('be.visible')
    .should('have.css', 'background-color')
    .and('eq', 'rgb(30, 146, 210)')
})

Cypress.Commands.add('testLoadingText', (dataStage) => {
  cy.get(`.grid-wrap[data-stage="${dataStage}"] .sk-spinner.sk-spinner-fading-circle`)
    .should('be.visible')
  cy.get(`.grid-wrap[data-stage="${dataStage}"] .loading-msg.m-t-xs`)
    .should('be.visible')
    .should('have.text', 'Loading deals...')
})

Cypress.Commands.add('testDealCard', ({ dataStage, dealID, dealTitle, dealCompanyName, dealOwner }) => {
  const dealSelector = `[data-stage="${dataStage}"] [data-id="${dealID}"].grid-box`

  cy.get(dealSelector).should('be.visible')
  cy.get(`${dealSelector} .cd-title > a`)
    .should('have.text', dealTitle)
  cy.get(`${dealSelector} .cd-company`)
    .contains(dealCompanyName)
  cy.get(`${dealSelector} .info-wrapper > .info-title`)
    .contains('FINANCIALS')
  // cy.get(`${dealSelector} .cd-table`)
  //     .contains('VOLUMES')
  cy.get('.cd-table td:last-child')
    .contains(dealOwner)
})

Cypress.Commands.add('navigateToDealTab', (tab) => {
  switch (tab) {
    case 'overview':
      cy.get(overview)
        .should('be.visible')
        .click()
      break
    case 'quotes':
      cy.get(quotes).click()
      break;
    case 'events':
      cy.get(events).click()
      break
    case 'tasks':
      cy.get(tasks).click()
      break
    case 'notes':
      cy.get(notes).click()
      break
    case 'documents':
      cy.get(documents).click()
      break
    case 'contact':
      cy.get(contact).click()
      break
    case 'salesTeam':
      cy.get(salesTeam).click()
      break
    case 'activity':
      cy.get(activity).click()
      break
  }
})

Cypress.Commands.add('dealsListTest', (salesStage, deals, dealList) => {
  for (let i = 0; i < deals; i++) {
    cy.get(`.grid-wrap[data-stage=${salesStage}] > div`).should(($deals) => {
      expect($deals.eq(i)).to.contain(dealList[i])
    })
  }
})
Cypress.Commands.add('dragAndDropDeal', (dragFrom, dragTo) => {  
  cy.wait(5000)
  const cardToMove = `.deal-card > .grid-wrap.ui-sortable[data-stage="${dragFrom}"]`;
  cy.get(cardToMove)
  .as('cardToMove');  

  cy.get(`.deal-card > .grid-wrap.ui-sortable[data-stage="${dragTo}"]>div>p`)
    .as('targetList');        
  cy.get('@targetList').then($element => {
      const position = $element[0].getBoundingClientRect();
      const xCoordinate = position.x || position.left; 
      const yCoordinate = position.y || position.top;
      cy.get('@cardToMove').trigger('mousedown', { which: 1 });
      cy.get('@targetList').trigger('mousemove', { clientX: xCoordinate, clientY: yCoordinate });
      cy.wait(1000);
      cy.get('@targetList').trigger('mouseup', { force: true });

      // Assertions
    cy.get('@targetList').should('not.contain', 'No active Deals'); // Example assertion
    cy.wait(5000)
    });    
  })


Cypress.Commands.add('toggleTabs', (tab) => {
  tab === 'inactive' ? cy.get(inactiveToggle).click() : cy.get(activeToggle).click()
})
Cypress.Commands.add('noDealMessageTabs', (type) => {
  const noDealChecker = (dealTypeArray, message) => {
    for (let i = 0; i < dealTypeArray.length; i++) {
      cy.get(`[data-stage="${dealTypeArray[i]}"] > .no-deal.text-center`)
        .should('be.visible')
        .and('have.text', message)
    }
  }

  switch (type) {
    case 'active':
      const activeNoDealMessage = 'No active Deals'
      const activeTypeArray = ['Qualifying', 'Negotiation', 'Trial Shipment']

      noDealChecker(activeTypeArray, activeNoDealMessage)
      break
    case 'inactive':
      const inactiveNoDealMessage = 'No inactive Deals'
      const inactiveTypeArray = ['Won', 'Lost', 'Stalled']

      cy.toggleTabs('inactive')
      noDealChecker(inactiveTypeArray, inactiveNoDealMessage)
      break
  }
})

Cypress.Commands.add('selectNewDealFromTab', () => {
  cy.get('.deals-acts [data-action="new-deal"]')
    .should('be.visible')
    .click()
})

Cypress.Commands.add('selectSalesStage', (salesStage) => {
  cy.get('#select2-ddlSalesStage-container')
    .click()
  cy.get(dealStageItem)
    .contains(salesStage)
    .click()
})

Cypress.Commands.add('checkDealStageOnOverview', (newDealName, type) => {
  cy.get(dealName).should('have.text', newDealName)
  switch (type) {
    case 'qualifying':
      cy.get(dealStage)
        .should('have.text', 'Qualifying')
        .should('have.class', 'border-status lblue')
        .should('have.css', 'background-color')
        .and('eq', 'rgb(90, 189, 237)')
      break

    case 'negotiation':
      cy.get(dealStage)
        .should('have.text', 'Negotiation')
        .should('have.class', 'border-status mblue')
        .should('have.css', 'background-color')
        .and('eq', 'rgb(30, 146, 210)')
      break

    case 'trial shipment':
      cy.get(dealStage)
        .should('have.text', 'Trial Shipment')
        .should('have.class', 'border-status green')
        .should('have.css', 'background-color')
        .and('eq', 'rgb(3, 146, 128)')
      break

    case 'final negotiation':
      cy.get(dealStage)
        .should('have.text', 'Final Negotiation')
        .should('have.class', 'border-status')
        .should('have.css', 'background-color')
        .and('eq', 'rgb(12, 98, 156)')
      break

    case 'won':
      cy.get(dealStage)
        .should('have.text', 'Won')
        .should('have.class', 'border-status dgreen')
        .should('have.css', 'background-color')
        .and('eq', 'rgb(31, 195, 159)')
      break

    case 'lost':
      cy.get(dealStage)
        .should('have.text', 'Lost')
        .should('have.class', 'border-status red')
        .should('have.css', 'background-color')
        .and('eq', 'rgb(247, 114, 104)')
      break

    case 'stalled':
      cy.get(dealStage)
        .should('have.text', 'Stalled')
        .should('have.class', 'border-status grey')
        .should('have.css', 'background-color')
        .and('eq', 'rgb(255, 237, 189)')
  }
})

Cypress.Commands.add('newDeal', (addEdit, dealForm, newDeal, newDealName, type, userData) => {
  cy.intercept({
    method: 'POST',
    url: '/api/deal/SaveDeal',
  }).as('dealID')

  const newLaneForm = {
    laneVolume: '283',
    laneRevenue: '5000',
    laneProfit: '50',
    laneOriginRegion: 'East Asia & Oceania',
    laneConsigneeName: 'Test',
    laneDestinationRegion: 'The Americas'
  }

  // Fill the form
  cy.fillForm(dealForm, newDeal)

  // Click Save
  cy.get('#btnSave').click({ force: true })
  cy.wait('@dealID').then((xhr) => {
    const dealID = xhr.response.body

    if (addEdit === 'add') {
      cy.get('#divLaneAddEdit').should('be.visible')
      cy.addLane(newLaneForm)
    }

    cy.checkDealStageOnOverview(newDealName, type)
    cy.deleteDealAPI(dealID, userData)
  })
})

Cypress.Commands.add('editDeal', () => {
  cy.get(editDeal).click()
})

Cypress.Commands.add('addDeal', (globalCompanyID, companyName, contactID, contactName, dealName, salesStage, { subscriberId, userId, globalUserId }) => {
  cy.request({
    method: 'POST',
    url: '/api/deal/SaveDeal',
    body: {
      'Deal': {
        'DealId': 0,
        'SubscriberId': subscriberId,
        'Comments': '',
        'Commodities': 'Chemicals',
        'CompanyIdGlobal': globalCompanyID,
        'CompanyName': companyName,
        'Competitors': 'Apex',
        'DealName': dealName,
        'DealOwnerIdGlobal': globalUserId,
        'DealOwnerName': 'Brendon Hartley',
        'DealType': 'New Business',
        'Incoterms': '',
        'Industry': 'Automotive',
        'PrimaryContactIdGlobal': contactID,
        'PrimaryContactName': contactName,
        'SalesStageName': salesStage,
        'Campaign': '',
        "CommissionType": null,
        "CommissionStartDate": null,
        'ContractEndDate': null,
        'DecisionDate': '26-Dec-20', 
        'EstimatedStartDate': null,
        'DateProposalDue': '25-Dec-20',
        'UpdateUserId': userId,
        'UpdateUserIdGlobal': globalUserId,
      }, 
  'SavingUserId': userId,
  'SavingUserSubscriberId': subscriberId,
    }    
  })
})

Cypress.Commands.add('listDealData', (salesStage, { subscriberId, userId, globalUserId }) => {
  cy.request({
    method: 'POST',
    url: '/api/GlobalDeal/GetGlobalDeals',
    body: {
      'SubscriberId': subscriberId,
      'LinkedUserIds': [globalUserId],
      'UserId': userId,
      'UserIdGlobal': globalUserId,
      'RecordsPerPage': 30,
      'CurrentPage': 1,
      'SortOrder': 'DealName asc',
      'Keyword': '',
      'SalesStages': salesStage,
    },
  })
})

Cypress.Commands.add('deleteDealAPI', (dealId, { subscriberId, userId, globalUserId }) => {
  cy.request({
    method: 'GET',
    url: `/api/deal/DeleteDeal/?dealId=${dealId}&userId=${userId}&dealSubscriberId=${subscriberId}&userSubscriberId=${subscriberId}`,
  })
})

Cypress.Commands.add('scrollUntilNoNewList', () => {
  let previousRowCount = -1;

  cy.get('table > tbody > tr').its('length').then(length => {
    previousRowCount = length;
  });
  cy.get('table > tbody > tr').last().scrollIntoView();
  cy.wait(1000); 
  cy.get('table > tbody > tr').its('length').then(length => {
    if (length > previousRowCount) {    
      scrollUntilNoNewElements();
    }
  });
})
function scrollUntilNoNewElements() {
  let previousRowCount = -1;

  cy.get('table > tbody > tr').its('length').then(length => {
    previousRowCount = length;
  });
  cy.get('table > tbody > tr').last().scrollIntoView();
  cy.wait(1000); 
  cy.get('table > tbody > tr').its('length').then(length => {
    if (length > previousRowCount) {    
      scrollUntilNoNewElements();
    }
  });
}