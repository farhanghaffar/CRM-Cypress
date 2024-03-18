import { eventForm } from '../../forms'

const companySelectors = {
  tabs: {
    overview: '.desktop-panel-nav li > a[href="#tab-overview"]',
    deals: '.desktop-panel-nav li[data-type="deals"]',
    quotes: '.desktop-panel-nav li[data-type="quotes"]',
    events: '.desktop-panel-nav li[data-type="events"]',
    tasks: '.desktop-panel-nav li[data-type="tasks"]',
    notes: '.desktop-panel-nav li[data-type="notes"]',
    documents: '.desktop-panel-nav li[data-type="documents"]',
    contact: '.desktop-panel-nav li[data-type="contacts"]',
    salesTeam: '.desktop-panel-nav li[data-type="salesteam"]',
    activity: '.desktop-panel-nav li[data-type="activity"]',
    relatedCompanies: '.desktop-panel-nav li[data-type="relatedcompanies"]',
  },
  eventTab: {
    addEvent: '.no-events.empty-box.empty_event [data-action="add-event"]',
    saveEvent: '#btnSave',
  },
  overview: {
    globalCompaniesSearch: '#btnGlobal',
    searchTextFilter: '#txtKeyword',
    searchCountryNameFilter: '#select2-ddlCountry-container',
    serachCityFilter: '#txtCity',
    searchPostCodeFilter: '#txtPostalCode',
    countryListFilterContainer: '#select2-ddlCountry-results',
    listViewContainer: '.row-wrapper',
    panelViewSelector: '.showView [title="Card View"]',
    panelViewContainer: '#divCardView',
  },
  companyPage: {
    name: '#lblCompanyName',
    companyDetails: {
      detailsAddress: '.ibox-content #lblAddress',
      detailsPhone: '.ibox-content #lblPhone',
      detailsFax: '.ibox-content #lblFax',
      detailsWebsite: '.ibox-content #lblWebsite',
    },
    nextWidget: {
      nextTitle: '.next-card .ibox-title',
      activityTitle: '#TaskNextLastActivity_lblNextActivityTaskType',
      eventTitle: '#TaskNextLastActivity_lblUpcomingEventDescription',
      eventDate: '#TaskNextLastActivity_lblUpcomingEventTime',
      eventTime: '#TaskNextLastActivity_lblUpcomingEventStartEndTime',
      eventLocation: '#TaskNextLastActivity_lblUpcomingEventLocation',
      eventType: '#TaskNextLastActivity_lblUpcomingEventType',
    },
    activity: {
      activityType: '#TaskNextLastActivity_lblLastActivityTaskType',
      activitySubject: '#TaskNextLastActivity_lblLastActivitySubject',
      lastActivityDate: '#TaskNextLastActivity_lblLastActivityCreatedDate',
      lastActivityCreatedBy: '#TaskNextLastActivity_lblLastActivityCreatedBy',
    },
  },
  form: {
    companyName: '#txtCompanyName',
    companyNameError: '#txtCompanyName[class="form-control error"]',
    companyNameValMessage: '#txtCompanyName-error',
    address: '#txtAddress',
    addressError: '#txtAddress[class="form-control error"]',
    city: '#txtCity',
    cityError: '#txtCity[class="form-control error"]',
    cityValMessage: '#txtCity-error',
    companyTypeValMessage: '#ddlCompanyType-error',
    phone: '#txtPhone',
    phoneError: '#txtPhone[class="form-control error"]',
    phoneValMessage: '#txtPhone-error',
    saveButton: '#btnSave',
  },

  realtedCompanies: {
    addRelatedCompanyNoCompanies: '.primary-btn>span',
    addRelatedCompanyWithCompanies: '#wrpRelatedCompanies .edit_link.btn-hover[data-target="#addRelatedCompany"]',
    formContainer: '.tableWrap',
    saveRelatedCompany: '#companyAddRelatedDialog_btnSave',
    closeRelatedCompany: '[data-dismiss="modal"]>span',
    companyFieldContainer: '#select2-ddlRelatedCompany-container',
    searchForCompany: '#companyAddRelatedDialog_txtSearch',
    searchForCompanyIcon:"#companyAddRelatedDialog_btnSearch",
    companyDropdownContainer: 'div[data-col-id="name"]',
    relatedCompanyCheckbox: '[data-col-id="add"]>input',
    linkTypeSelector: '[data-col-id="linkType"]>div',
    removeRelatedCompany: '.hover-link.delete-link',
    relatedCompanyTables: '#tblRelatedCompanies table.dataTable.no-footer',
    addedRelatedCompanyInTables: 'div.data-grid-row>div>a',
    addedRelatedCityInTables: 'div.data-grid-row>[data-col-id="location"]',    
    removeRelatedCompanyButtons: '#btnRemoveSelectedRelatedCompanies',
    deleteAll: '#ctl08',
    noRelatedCompaniesContainer: '.ff-widget-call-to-action>div>div',
    relatedCompaniesEditBtn: "[title='Edit']",
    removeRelatedCompanyBtn: "#btnRemoveRelatedCompany",
    relatedCompanyRemovePopupBtn: "[aria-labelledby='swal2-title']>div>button"
  },

  globalCompanyLookup: {
    globalHeader: '.modal-title',
    globalCross: '.closeX',
    globalSearch: '#companyLookupDialog_txtSearch',
    globalLoadingModal: '#divGlobalLoading',
  },

  companyExistsInCrm: {
    companyExistsNameInput: '#txtCompanyNameSearch',
    companyExistsCancel: '#btnCancel',
    companyExistsNext: '#aSearchCompany',

  }
}

const { globalHeader, globalCross, globalSearch, globalLoadingModal } = companySelectors.globalCompanyLookup

const { overview, deals, quotes, events, tasks, notes, documents, contact, salesTeam, activity, relatedCompanies } = companySelectors.tabs

const { addEvent, saveEvent } = companySelectors.eventTab

const {
  companyName,
  companyNameError,
  companyNameValMessage,
  address,
  addressError,
  city,
  cityError,
  cityValMessage,
  companyTypeValMessage,
  phone,
  phoneError,
  phoneValMessage,
  saveButton,
} = companySelectors.form

const {
  globalCompaniesSearch,
  panelViewSelector,
  panelViewContainer,
  serachCityFilter,
  searchTextFilter,
  searchPostCodeFilter,
  searchCountryNameFilter,
  listViewContainer,
  countryListFilterContainer,
} = companySelectors.overview

const {
  name,
} = companySelectors.companyPage

const { detailsAddress, detailsPhone, detailsFax, detailsWebsite } = companySelectors.companyPage.companyDetails

const { activityType, activitySubject, lastActivityDate, lastActivityCreatedBy } = companySelectors.companyPage.activity

const { nextTitle, activityTitle, eventTitle, eventDate, eventTime, eventLocation, eventType } = companySelectors.companyPage.nextWidget

const { addRelatedCompanyNoCompanies,
  addRelatedCompanyWithCompanies,
  formContainer,
  saveRelatedCompany,
  closeRelatedCompany,
  companyFieldContainer,
  searchForCompany,
  searchForCompanyIcon,
  companyDropdownContainer,
  relatedCompanyCheckbox,
  linkTypeSelector,
  removeRelatedCompany,
  relatedCompanyTables,
  removeRelatedCompanyButtons,
  deleteAll,
  noRelatedCompaniesContainer,
  addedRelatedCompanyInTables,
  addedRelatedCityInTables,
  relatedCompaniesEditBtn,
  removeRelatedCompanyBtn,
  relatedCompanyRemovePopupBtn,
} = companySelectors.realtedCompanies

const { companyExistsNameInput, companyExistsCancel, companyExistsNext } = companySelectors.companyExistsInCrm

Cypress.Commands.add('openCompanyForm', () => {
  cy.get('.new-company')
    .contains('Company')
    .click()
})

Cypress.Commands.add('companyAlreadyExists', (companyName) => {
  cy.get(companyExistsNameInput)
    .type(companyName)

  cy.get(companyExistsNext)
    .click()
})

Cypress.Commands.add('openGlobalCompaniesLookupAndSearch', (searchTerm) => {
  cy.get(globalCompaniesSearch)
    .contains('Global')
    .click()
  cy.get(globalHeader).contains('Company Lookup')
  cy.get(globalCross).should('be.visible')

  cy.get(globalSearch).type(`${searchTerm}{enter}`)
})

Cypress.Commands.add('globalCompanyRowChecker', (type, { globalCompanyId, companyTitle, companyDivision, companyAddress, companySalesTeam }) => {
  cy.wait(2000)
  const individualSelector = `#companyLookupDialog_dataGrid .row-wrapper[data-cypress-id="${globalCompanyId}"]`

  cy.get(`${individualSelector} > div [data-col-id="name"]`).contains(companyTitle)
  // cy.get(`${individualSelector} [data-col-id="name"] .faded-text`).contains(companyDivision)
  cy.get(`${individualSelector} > div [data-col-id="location"]`).contains(companyAddress).should('be.visible')

  cy.get(`${individualSelector} > div [data-col-id="salesTeam"]`).contains(companySalesTeam)

  if (type === 'existing') {
    cy.get(`${individualSelector} [data-action-type="view"]`)
      .contains('View')
    // .and('have.attr', 'href', `/Companies/CompanyDetail/CompanyDetail.aspx?globalCompanyId=${globalCompanyId}&amp;subscriberId=283`)
  } else {
    cy.get(`${individualSelector} .W120.vertical-middle.action-cell > a`).contains('Request Access')
  }
})

Cypress.Commands.add('noRelatedCompanies', () => {
  // cy.get(noRelatedCompaniesContainer)
  //   .should('be.visible')
  cy.get(noRelatedCompaniesContainer)
    .should('contain.text', 'No Related Companies')
  cy.get(addRelatedCompanyNoCompanies)
    .should('be.visible')
})

Cypress.Commands.add('deleteRelatedCompany', (type, index, relatedCompanyName) => {
  
  cy.get(relatedCompaniesEditBtn)
    .first()
    .should('be.visible')
    .click()

    cy.get('span').contains('Edit Company Link')
    .should('be.visible')  
    
  cy.get(removeRelatedCompanyBtn)
    .should('be.visible')
    .click()

  cy.get(relatedCompanyRemovePopupBtn)
  .contains('Remove')
  .should('be.visible')
  .click()    
    
  // switch (type) {
  //   case 'individual':
  //     cy.get(`${relatedCompanyTables} tbody tr:nth-of-type(${index}) ${removeRelatedCompany}`)
  //       .click()
  //     cy.get('.swal2-popup.swal2-modal.swal2-show')
  //       .should('be.visible')
  //     cy.get('#swal2-title').should('have.text', 'Remove Related Company?')
  //     cy.get('.swal2-actions > .swal2-confirm.swal2-styled')
  //       .should('have.text', 'Remove')
  //       .click()
  //     cy.loadingModel()
  //     cy.get(relatedCompanyTables)
  //       .should('not.contain.text', relatedCompanyName)
  //     break

  //   case 'all':
  //     cy.get(deleteAll)
  //       .check()
  //     cy.get(removeRelatedCompanyButtons)
  //       .contains('Remove Selected')
  //       .click()
  //     cy.get(relatedCompanyTables)
  //       .should('not.be.visible')
  //     break
  // }
})

Cypress.Commands.add('addRelatedCompany', (relatedCompany, index, { linkType, city, country, relationType }) => {
  cy.openRelatedCompaniesModal('noCompanies')
  cy.get(searchForCompany)
    .click()
    .type(relatedCompany)
    cy.get(searchForCompanyIcon)
    .click()
  cy.wait(5000)
  cy.get(companyDropdownContainer).last().invoke('text').then((text) => {
    const normalizedText = text.replace(/<wbr>/g, ''); 
    expect(normalizedText.trim()).to.equal(relatedCompany);
});
  cy.get(relatedCompanyCheckbox)
    .check()
  cy.get(linkTypeSelector)
    .click()
  cy.get('div.dd-menu-item')
    .contains(linkType)
    .click()
  cy.get(saveRelatedCompany)
    .click()
  cy.get('button').contains('Yes!')
    .should('be.visible').click()
  cy.get(addedRelatedCompanyInTables).invoke('text').then((text) => {
    const normalizedText = text.replace(/<wbr>/g, ''); 
    expect(normalizedText.trim()).to.equal(relatedCompany);
});  
cy.get(addedRelatedCityInTables).invoke('text').then((text) => {
  const normalizedText = text.replace(/<wbr>/g, ''); 
  expect(normalizedText.trim().includes(city)).to.be.true;
});  
cy.get(addedRelatedCityInTables).invoke('text').then((text) => {
  const normalizedText = text.replace(/<wbr>/g, ''); 
  expect(normalizedText.trim().includes(country)).to.be.true;
});  
})

Cypress.Commands.add('openRelatedCompaniesModal', (type) => {
  if (type === 'noCompanies') {
    cy.get(addRelatedCompanyNoCompanies).click()
  } else {
    cy.get(addRelatedCompanyWithCompanies).click()
  }
})

Cypress.Commands.add('relatedCompaniesValidation', (type) => {
  cy.openRelatedCompaniesModal('noCompanies')
  switch (type) {
    case 'noCompany':
      cy.get(saveRelatedCompany).click()
      cy.get('#addEditRelatedCompany .form-group:nth-of-type(1) .error-text')
        .contains('Required')
      break

    case 'noLinkType':
      cy.get(saveRelatedCompany).click()
      cy.get('#addEditRelatedCompany .form-group:nth-of-type(2) .error-text')
        .contains('Required')
      break

    case 'close':
      cy.get(closeRelatedCompany).click()
      cy.get('h4').contains('Add Related Companies').should('not.be.visible')
      break
  }
})

Cypress.Commands.add('testIndividualDealOnCompany', (dealID, dealName, dealStatus, decisionDate, revenue, proposalDate, profit) => {
  const dealSelector = `[data-id=${dealID}]`

  cy.get(`${dealSelector} .mcard-title`).should('have.text', dealName)
  cy.get(`${dealSelector} .border-status`).should('have.text', dealStatus)
  cy.get(`${dealSelector} .table-deals tbody > tr:first-child`)
    .contains(decisionDate)
  cy.get(`${dealSelector} .table-deals tbody > tr:first-child .data-deal-revenue`)
    .contains(revenue)
  cy.get(`${dealSelector} .table-deals tbody > tr:last-child`)
    .contains(proposalDate)
  cy.get(`${dealSelector} .table-deals tbody > tr:last-child .data-deal-profit`)
    .contains(profit)
})

Cypress.Commands.add('checkActivityWidget', (activity, subject, activityDate, activityBy) => {
  cy.get(activityType)
    .should('have.text', activity)
  cy.get(activitySubject)
    .should('have.text', subject)
  cy.get(lastActivityDate)
    .should('have.text', activityDate)
  cy.get(lastActivityCreatedBy)
    .contains(activityBy)
})

Cypress.Commands.add('noWidgetVisible', (type) => {
  if (type === 'next') {
    cy.get('#TaskNextLastActivity_nextCard')
      .should('not.exist')
  } else {
    cy.get('#TaskNextLastActivity_activityCard')
      .should('not.exist')
  }
})

Cypress.Commands.add('checkNextWidgetData', (type, activityType, name, date, time, location, eventMeetingType) => {
  if (type === 'event') {
    cy.get(activityTitle)
      .should('have.text', activityType)
    cy.get(eventTime)
      .should('have.text', time)
    cy.get(eventLocation)
      .should('have.text', location)
    cy.get(eventType)
      .should('have.text', eventMeetingType)
  } else if (type === 'task') {
    cy.get(activityTitle)
      .should('have.text', activityType)
  }

  cy.get(nextTitle)
    .contains('Next')
  cy.get('#divNoNextActivity')
    .should('not.exist')
  cy.get(eventTitle)
    .should('have.text', name)
  cy.get(eventDate)
    .should('have.text', date)
})

Cypress.Commands.add('checkCompanyDetails', (type, address, number, fax, website) => {
  cy.get(detailsAddress)
    .contains(address)

  if (type === 'data') {
    cy.get(detailsPhone)
      .should('have.text', number)
    cy.get(detailsFax)
      .should('have.text', fax)
    cy.get(detailsWebsite)
      .should('have.text', website)
  }
})

Cypress.Commands.add('searchAndCheckCompanyCity', (searchItem) => {
  cy.get(serachCityFilter)
    .type(`${searchItem}{enter}`)
  cy.get(`${listViewContainer}[data-cypress-id]`)
    .contains(searchItem)
})

Cypress.Commands.add('searchAndCheckCompanyPostcode', (searchPostcode, companyName) => {
  cy.intercept({
    url: '/api/Company/GetCompaniesGlobal',
    method: 'POST',
  }).as('waitCompanies')

  cy.get(searchPostCodeFilter)
    .type(`${searchPostcode}{enter}`)
  cy.wait('@waitCompanies')
  cy.get(`${listViewContainer}[data-cypress-id]`)
    .contains(companyName)
})

Cypress.Commands.add('searchAndCheckCompanyName', (searchItem) => {
  cy.get(searchTextFilter)
    .type(`${searchItem}{enter}`)
  cy.get(listViewContainer)
    .should('have.length', 1)
  cy.get(`${listViewContainer}[data-cypress-id]`)
    .contains(searchItem)
})

Cypress.Commands.add('searchAndCheckCompanyCountry', (searchItem) => {
  cy.get(searchCountryNameFilter)
    .click()
  cy.get(countryListFilterContainer)
    .contains(searchItem)
    .click()
  cy.get(listViewContainer)
    .should('have.length', 1)
  cy.get(`${listViewContainer}[data-cypress-id]`)
    .contains(searchItem)
})

Cypress.Commands.add('navigateAndCheckPanelView', () => {
  cy.get(panelViewSelector)
    .click()
  cy.get(panelViewContainer)
    .should('be.visible')
})

Cypress.Commands.add('saveForm', () => {
  cy.get(saveButton).click()
})

Cypress.Commands.add('checkCompanyFormValidation', () => {
  const errorBorder = (selector) => {
    cy.get(selector)
      .scrollIntoView()
      .should('be.visible')
      .should('have.css', 'background-color')
  }

  const errorMessage = (selector, message) => {
    cy.get(selector)
      .should('exist')
      .and('have.text', message)
    // .and('eq', 'rgb(205, 43, 30)')
  }

  cy.saveForm()
  errorBorder(companyNameError)
  errorBorder(cityError)
  errorBorder(phoneError)
  //add industry once fixed

  errorMessage(companyNameValMessage, 'Enter the company name')
  errorMessage(cityValMessage, 'Enter the city')
  errorMessage(companyTypeValMessage, 'Select the company type')
  errorMessage(phoneValMessage, 'Enter the phone number')
})

Cypress.Commands.add('navigateToTab', (tab) => {
  switch (tab) {
    case 'overview':
      cy.get(overview)
        .should('be.visible')
        .click()
      break
    case 'deals':
      cy.get(deals).click()
      break
    case 'quotes':
      cy.get(quotes).click()
      break
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
    case 'relatedCompanies':
      cy.get(relatedCompanies).click()
      break
  }
})

Cypress.Commands.add('addCompanyAPI', ({ companyName, subscriberId, userId, globalUserId }) => {
  cy.request({
    failOnStatusCode: false,
    method: 'POST',
    url: '/api/company/SaveCompany',
    body: {
      'Company': {
        'SubscriberId': subscriberId,
        'CompanyId': 0,
        'CompanyName': companyName,
        'CompanyOwnerUserIdGlobal': globalUserId,
        'Competitors': "",
        'Address': 'Test123',
        'City': 'San Pedro',
        'ParentCode': '',
        'Phone': '+448976645231',
        'PostalCode': 'P90812F',
        'CountryName': 'United States',
        'User': userId,
        'CompanyTypes': 'Carrier',
        'Industry': 'Chemical',
        'Source': 'LinkedIn',
        'Fax': '0123456789',
        'Website': 'www.google.com',
        'CampaignName': '',
        'UpdateUserId': userId,
        'Division': 'Finance',
        'CompanyCode': 'TEST',
        'StateProvince': 'Cali',
        'Active': false,
        'UpdateUserIdGlobal': globalUserId,
        'IsCustomer': false,
        'Comments': 'COMMENT TEST',
      },
      'UpdatedUserIdGlobal': globalUserId
    },
  })
})

Cypress.Commands.add('deleteCompanyAPI', (companyId, globalUserId, subscriberId) => {
  cy.request({
    method: 'GET',
    url: `/api/company/DeleteCompany/?companyid=${companyId}&userIdGlobal=${globalUserId}&subscriberid=${subscriberId}`,
  })
})

Cypress.Commands.add('getCompanyList', ({ subscriberId, userId, globalUserId }) => {
  cy.request({
    method: 'POST',
    url: '/api/Company/GetCompaniesGlobal',
    body: {
      'SubscriberId': subscriberId,
      'UserId': userId,
      'RecordsPerPage': 28,
      'Keyword': '',
      'CurrentPage': 1,
      'City': '',
      'PostalCode': '',
      'SortBy': 'companyname asc',
      'UserIdGlobal': globalUserId,
      'FilterType': 'ALL',
    },
  })
})

Cypress.Commands.add('searchResultsCompanies', (searchText) => {
  cy.get('#txtKeyword')
    .type(searchText)
    .should('have.value', searchText)
    .should('be.visible')
  cy.get('.search-form.search .btn-search').click()
})
