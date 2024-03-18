import { contactForm } from '../../forms'

const contactSelectors = {
  tabs: {
    overview: '.desktop-panel-nav > #contact-tabs li > a[href="#tab-overview"]',
    deals: '.desktop-panel-nav > #contact-tabs li[data-type="deals"]',
    quotes: '.desktop-panel-nav > #contact-tabs li[data-type="quotes"]',
    events: '.desktop-panel-nav > #contact-tabs li[data-type="events"]',
    tasks: '.desktop-panel-nav > #contact-tabs li[data-type="tasks"]',
    notes: '.desktop-panel-nav > #contact-tabs li[data-type="notes"]',
    documents: '.desktop-panel-nav > #contact-tabs li[data-type="documents"]',
    salesTeam: '.desktop-panel-nav > #contact-tabs li[data-type="salesteam"]',
    activity: '.desktop-panel-nav > #contact-tabs li[data-type="activity"]',
  },

  contactForm: {
    firstNameContact: '#contactAddEdit_txtFirstName',
    firstNameValidationMessage: '.form-group-first-name span',
    lastNameContact: '#contactAddEdit_txtLastName',
    lastNameValidationMessage: '.form-group-last-name span',
    companyContact: '[aria-labelledby="select2-contactAddEdit_ddlCompany-container"]',
    companyValidationMessage: '.col-md-6.br-fields.form-fields:nth-of-type(1) .form-group.filled:nth-of-type(1) > span.error-text:nth-of-type(2)',
    cityContact: '#contactAddEdit_txtCity',
    cityValidationMessage: '.col-md-8:nth-of-type(1) .form-group.filled:nth-of-type(1) > span.error-text:nth-of-type(1)',
    emailContact: '#contactAddEdit_txtEmail',
    emailValidationMessage: '.col-md-4.form-fields.br-fields:nth-of-type(1) .form-group.filled:nth-of-type(3) > span.error-text:nth-of-type(1)',
    phoneContact: '#contactAddEdit_txtBusinessPhone',
    phoneValidationMessage: '.col-md-6.col-left-box .form-group.filled:nth-child(1) > span.error-text:nth-child(3)',
    saveContact: '#contactAddEdit_btnSave',
    editContact: '.edit-cont',
  },

  contactTab: {
    addContactHeader: '#btnAddContact',
    addContactButton: '.ac-wrapper.basic-card.contact-card .primary-btn',
    contactName: '.cc-name',
    contactJobTitle: '.cc-profile',
    contactEmail: '.cc-mail',
    contactAddress: '.address-icon',
    contactNav: '.contact-card .cc-nav',
    contactSearch: '#txtKeyword',
    contactContainer: '#tblContacts',
    addContactBody: '#divNoItems .edit_link.btn-hover.new-contact',
  },
  contactEditForm: {
    editBusinessPhone: '#contactAddEdit_txtBusinessPhone',
    editSaveBtn: 'button#contactAddEdit_btnSave',
    editPageTitle:'#contactAddEdit_lblBreadcrumbHeader',
  },

  infoWidget: {
    infoContainer: '.col-left-box > .ibox.basic-card:nth-of-type(1)',
    infoTitle: '.col-left-box > .ibox.basic-card:nth-of-type(1) .card-title.language-entry',
    infoIcon: '.col-left-box > .ibox.basic-card:nth-of-type(1) .card-title.language-entry > .icon-Notes.title-icon',
    addressIcon: '.col-left-box > .ibox.basic-card:nth-of-type(1) .ibox-content > #wrpContactAddress > .row-icon.address-icon',
    address: '.col-left-box > .ibox.basic-card:nth-of-type(1) .ibox-content > #wrpContactAddress #lblContactAddress',
    emailAddressIcon: '.col-left-box > .ibox.basic-card:nth-of-type(1) #wrpContactEmail .row-icon.email-icon.user-mail.hover-link',
    emailAddress: '.col-left-box > .ibox.basic-card:nth-of-type(1) #wrpContactEmail #lblContactEmail',
    businessPhoneIcon: '.col-left-box > .ibox.basic-card:nth-of-type(1) #wrpBusinessPhone > .row-icon.phone-icon',
    businessPhone: '.col-left-box > .ibox.basic-card:nth-of-type(1) #wrpBusinessPhone #lblBusinessPhone',
    mobilePhoneIcon: '.col-left-box > .ibox.basic-card:nth-of-type(1) #wrpMobilePhone > .image-icon.mobile-icon',
    mobilePhone: '.col-left-box > .ibox.basic-card:nth-of-type(1) #wrpMobilePhone #lblMobilePhone',
  },

  detailsWidget: {
    detailsContainer: '.ibox.widget.basic-card.detail-card',
    detailsTitle: '.ibox.widget.basic-card.detail-card .card-title.language-entry',
    detailsIcon: '.ibox.widget.basic-card.detail-card .card-title.language-entry i.icon-Notes.title-icon',
    detailsTypeHeader: '.ibox.widget.basic-card.detail-card .ibox-content #wrpContactType .card-status.card-label',
    detailsTypeContent: '.ibox.widget.basic-card.detail-card .ibox-content #wrpContactType #lblContactType',
    detailsJobTitleHeader: '.ibox.widget.basic-card.detail-card .ibox-content #wrpContactJobTitle .card-status.card-label',
    detailsJobTitleContent: '.ibox.widget.basic-card.detail-card .ibox-content #wrpContactJobTitle #lblContactJobTitle',
    detailsBirthdayHeader: '.ibox.widget.basic-card.detail-card .ibox-content #wrpContactBirthday .card-status.card-label',
    detailsBirthdayContent: '.ibox.widget.basic-card.detail-card .ibox-content #wrpContactBirthday #lblContactBirthday',
    detailsPreviousEmployerHeader: '#wrpContactPrevEmployers .card-status.card-label',
    detailsPreviousEmployedContent: '.ibox.widget.basic-card.detail-card .ibox-content #wrpContactPrevEmployers #lblContactPrevEmployers',
  },

  companyInfoWidget: {
    companyContainer: '.col-left-box > .right-col > .ibox.basic-card:nth-of-type(1)',
    companyIcon: '.col-left-box > .right-col > .ibox.basic-card:nth-of-type(1) .icon-business.title-icon',
    companyHeader: '.col-left-box > .right-col > .ibox.basic-card:nth-of-type(1) .card-title.language-entry',
    companyName: '[data-action="company-detail"]',
    companyLogo: '#divCompanyLogo',
    companyAddressLogo: '.col-left-box > .right-col > .ibox.basic-card:nth-of-type(1) #wrpAddress .row-icon.address-icon',
    companyAddress: '.col-left-box > .right-col > .ibox.basic-card:nth-of-type(1) #wrpAddress #lblAddress',
  },

  contactOwnerWidget: {
    contactOwnerContainer: '#wrapContactOwnerCard',
    contactOwnerHeader: '#wrapContactOwnerCard .card-title',
    contactOwnerIcon: '#wrapContactOwnerCard i.icon-users.title-icon',
    contactUserImage: '#wrapContactOwnerCard .ibox-content .user-wrap.clearfix #divContactOwnerImage > img',
    contactUserName: '#wrapContactOwnerCard .ibox-content .user-wrap.clearfix .user-info #lblContactOwnerName',
    contactUserJobTitle: '#wrapContactOwnerCard .ibox-content .user-wrap.clearfix .user-info #lblContactOwnerPosition',
    contactUserAddressIcon: '#wrapContactOwnerCard .ibox-content #wrpContactOwnerLocation .row-icon.address-icon',
    contactUserAddress: '#wrapContactOwnerCard .ibox-content #wrpContactOwnerLocation #lblContactOwnerLocation',
    contactUserEmailIcon: '#wrapContactOwnerCard .ibox-content #wrpContactOwnerEmail #aSalesRepEmail',
    contactUserEmail: '#wrapContactOwnerCard .ibox-content #wrpContactOwnerEmail a #lblContactOwnerEmail',
    contactUserBusinessNumberIcon: '#wrapContactOwnerCard .ibox-content #wrpContactOwnerPhone .row-icon.phone-icon.user-tel',
    contactUserBusinessNumber: '#wrapContactOwnerCard .ibox-content #wrpContactOwnerPhone #lblContactOwnerPhone',
    contactUserMobileNumberIcon: '#wrapContactOwnerCard .ibox-content #wrpContactOwnerMobilePhone #aSalesRepMobilePhone',
    contactUserMobileNumber: '#wrapContactOwnerCard .ibox-content #wrpContactOwnerMobilePhone #lblContactOwnerMobilePhone',
  },
}

const { overview, deals, quotes, events, tasks, notes, documents, salesTeam, activity } = contactSelectors.tabs
const { addContactHeader, addContactButton, contactName, contactJobTitle, contactEmail, contactAddress, contactNav, contactSearch, contactContainer, addContactBody } = contactSelectors.contactTab
const { firstNameContact, firstNameValidationMessage, lastNameContact, lastNameValidationMessage, companyContact, companyValidationMessage, cityContact, cityValidationMessage, emailContact, emailValidationMessage, phoneContact, phoneValidationMessage, saveContact, editContact } = contactSelectors.contactForm
const { infoContainer, infoTitle, infoIcon, addressIcon, address, emailAddressIcon, emailAddress, businessPhoneIcon, businessPhone, mobilePhoneIcon, mobilePhone } = contactSelectors.infoWidget
const { detailsContainer, detailsTitle, detailsIcon, detailsTypeHeader, detailsTypeContent, detailsJobTitleHeader, detailsJobTitleContent, detailsBirthdayHeader, detailsBirthdayContent, detailsPreviousEmployerHeader, detailsPreviousEmployedContent } = contactSelectors.detailsWidget
const { companyContainer, companyIcon, companyHeader, companyName, companyLogo, companyAddressLogo, companyAddress } = contactSelectors.companyInfoWidget
const { contactOwnerContainer, contactOwnerHeader, contactOwnerIcon, contactUserImage, contactUserName, contactUserJobTitle, contactUserAddressIcon, contactUserAddress, contactUserEmailIcon, contactUserEmail, contactUserBusinessNumberIcon, contactUserBusinessNumber, contactUserMobileNumberIcon, contactUserMobileNumber } = contactSelectors.contactOwnerWidget
const { editBusinessPhone, editSaveBtn, editPageTitle } = contactSelectors.contactEditForm


Cypress.Commands.add('contactFormValidationChecker', (type) => {
  const testContactRequiredValidation = (inputSelector, errorMessageSelector, errorText) => {
    cy.get(inputSelector)
      .should('have.css', 'border-color')
      .and('eq', 'rgb(205, 43, 30)')

    cy.get(errorMessageSelector)
      .should('have.text', errorText)
      .should('have.css', 'color')
      .and('eq', 'rgb(205, 43, 30)')
  }

  switch (type) {
    case 'email':
      cy.get(emailContact).type('abc123')
      cy.get(saveContact).click()
      cy.get(emailValidationMessage)
        .should('have.text', 'Invalid email address')
        .should('have.css', 'color')
        .and('eq', 'rgb(205, 43, 30)')
      break

    case 'required':
      cy.get(saveContact).click()
      testContactRequiredValidation(firstNameContact, firstNameValidationMessage, 'Enter the first name')
      testContactRequiredValidation(companyContact, companyValidationMessage, 'Select a company')
      testContactRequiredValidation(cityContact, cityValidationMessage, 'Enter the city')
      testContactRequiredValidation(phoneContact, phoneValidationMessage, 'Enter the phone')

      break
  }
})

Cypress.Commands.add('searchForContactName', (type, searchItem) => {
  switch (type) {
    case 'valid':
      cy.get(contactSearch)
        .clear()
        .type(`${searchItem}{enter}`)
      cy.get('div[data-col-id="name"]>div>div>a')
        .should('have.length', 1)
      cy.get('div[data-col-id="name"]>div>div>a').first().invoke('text').then((text) => {
         const normalizedText = text.replace(/<wbr>/g, ''); 
         expect(normalizedText.trim()).to.equal(searchItem);
       });  
      break

    case 'invalid':
      cy.get(contactSearch)
        .clear()
        .type(`${searchItem}{enter}`)

      cy.get('div').contains('No Contacts')
        .should('be.visible')
        .should('have.text', 'No Contacts')
      cy.get('span').contains('Add Contact').should('be.visible')
      
      break
  }
})

Cypress.Commands.add('searchForContactNameAndOpen', (searchItem) => {
  cy.get(contactSearch)
        .should('be.visible')
        .clear()
        .type(`${searchItem}{enter}`)
      cy.get('div[data-col-id="name"]>div>div>a')
        .should('have.length', 1)
      cy.get('div[data-col-id="name"]>div>div>a').first().click()
})

Cypress.Commands.add('navigateToNewContactForm', () => {
  cy.get(addContactHeader).click()
})

Cypress.Commands.add('contactOwnerWidget', ({ name, jobTitle, city, country, email, number }) => {
  cy.get(contactOwnerContainer).scrollIntoView().should('be.visible')
  cy.get(contactOwnerHeader).should('have.text', 'Contact Owner')
  cy.get(contactOwnerIcon).should('be.visible')
  cy.get(contactUserImage).should('be.visible')
  cy.get(contactUserName).should('have.text', name)
  cy.get(contactUserJobTitle).should('have.text', jobTitle)
  cy.get(contactUserEmailIcon).should('be.visible')
  cy.get(contactUserEmail).should('have.text', email)
  cy.get(contactUserMobileNumberIcon).should('be.visible')
  cy.get(contactUserMobileNumber).should('have.text', number)
})

Cypress.Commands.add('contactCompanyInfoWidget', (companyText, comapnyAddressText) => {
  cy.get(companyContainer).scrollIntoView().should('be.visible')
  cy.get(companyIcon).should('be.visible')
  cy.get(companyHeader).should('have.text', 'Company Info')
  cy.get(companyName).contains(companyText)
  cy.get(companyLogo).should('be.visible')
  cy.get(companyAddressLogo).should('be.visible')
  cy.get(companyAddress).should('have.text', comapnyAddressText)
})

Cypress.Commands.add('contactDetailsWidgetMinimalData', (type, jobTitle) => {
  cy.get(detailsContainer).should('be.visible')
  cy.get(detailsTitle).should('be.visible').and('have.text', 'Details')
  cy.get(detailsIcon).should('be.visible')
  cy.get(detailsTypeHeader).should('have.text', 'Type')
  cy.get(detailsTypeContent).should('have.text', type)
  cy.get(detailsJobTitleHeader).should('have.text', 'Job Title')
  cy.get(detailsJobTitleContent).should('have.text', jobTitle)
})

Cypress.Commands.add('contactDetailsWidgetAllData', (type, jobTitle, birthday, previousEmployer) => {
  cy.contactDetailsWidgetMinimalData(type, jobTitle)
  // cy.get(detailsBirthdayHeader).should('be.visible').and('have.text', 'Birthday')
  // cy.get(detailsBirthdayContent).should('have.text', birthday)
  // cy.get(detailsPreviousEmployerHeader).scrollIntoView()
  // cy.get(detailsPreviousEmployerHeader).should('be.visible').and('have.text', 'Previous Employers')
  cy.get(detailsPreviousEmployedContent).should('have.text', previousEmployer)
})

Cypress.Commands.add('contactInfoWidgetMinimialData', (addressText, emailAddressText) => {
  cy.get(infoContainer).should('be.visible')
  cy.get(infoTitle).should('have.text', 'Info')
  cy.get(infoIcon).should('be.visible')
  cy.get(addressIcon).should('be.visible')
  cy.get(address).should('have.text', addressText)
  cy.get(emailAddressIcon).should('be.visible')
  cy.get(emailAddress).should('have.text', emailAddressText)
})

Cypress.Commands.add('contactInfoWidgetAllData', (addressText, emailAddressText, businessPhoneNumber, mobilePhoneNumber) => {
  cy.contactInfoWidgetMinimialData(addressText, emailAddressText)
  cy.get(businessPhoneIcon).should('be.visible')
  cy.get(businessPhone).should('have.text', businessPhoneNumber)
  cy.get(mobilePhoneIcon).should('be.visible')
  cy.get(mobilePhone).should('have.text', mobilePhoneNumber)
})

Cypress.Commands.add('addContactTab', (newContact, userData) => {
  cy.intercept({
    method: 'POST',
    url: '/api/contact/SaveContact',
  }).as('newContact')

  const { firstName, lastName, jobTitle, email, address } = newContact
  const name = `${firstName} ${lastName}`

  cy.get(addContactButton).click()
  cy.wait(5000)
  cy.fillForm(contactForm, newContact)
  cy.get(saveContact).click()
  cy.wait('@newContact').then((xhr) => {
    const contactID = xhr.response.body

    cy.get(contactName).contains(name)
    cy.get(contactJobTitle).contains(jobTitle)
    cy.get(contactEmail).contains(email)
    cy.get(contactAddress).contains(address)
    // cy.removeContactAPI(contactID, userData)
  })
})

Cypress.Commands.add('attendeesFromOutsideYourCompanyPopup', (tab) => {
  switch (tab) {
    case 'do not send':
      cy.get('button')
        .contains('Do Not Send')
        .should('be.visible')
        .click()
      break
    case 'send':
      cy.get(deals).click()
      break    
  }
})

Cypress.Commands.add('navigateToContactTab', (tab) => {
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
    case 'salesTeam':
      cy.get(salesTeam).click()
      break
    case 'activity':
      cy.get(activity).click()
      break
  }
})

Cypress.Commands.add('addContact', (contactForm, newContact, contactName) => {
  cy.intercept({
    method: 'POST',
    url: '/api/contact/SaveContact',
  }).as('saveContact')
  cy.fillForm(contactForm, newContact)
  cy.get(saveContact).click()
  cy.wait('@saveContact')
  cy.get(contactSearch)
    .clear()
    .type(contactName)
  cy.get(contactSearch)
    .next('a')
    .find('i')
    .click(); 
    
  cy.get('div[data-col-id="name"]>div>div>a').first().invoke('text').then((text) => {
    const normalizedText = text.replace(/<wbr>/g, ''); 
    expect(normalizedText.trim()).to.equal(contactName);
  });
})

Cypress.Commands.add('editContacts', (contactName, mobileNumber) => {
  cy.get(contactSearch)
    .clear()
    .type(contactName)
  cy.get(contactSearch)
    .next('a')
    .find('i')
    .click(); 
    
  cy.get('div[data-col-id="name"]>div>div>a').first().click()
  cy.get("[data-action='edit-contact']").should('be.visible').click()
  cy.get('#contactAddEdit_txtBusinessPhone').scrollIntoView().should('be.visible').type(mobileNumber)
})

Cypress.Commands.add("editContact", (contactName, businessPhoneNumber) => {
  cy.contains('a', contactName)
      .parent('div')
      .parent('div')
      .parent('div')
      .next()
      .find('a').contains('edit').should('be.visible')
      .click();
  cy.get(editPageTitle).should('be.visible')  
  cy.get(editBusinessPhone).scrollIntoView().should('be.visible').clear().type(businessPhoneNumber);
  cy.get(editSaveBtn).scrollIntoView().should('be.visible').click(); 
});

Cypress.Commands.add("removeContact", (contactName) => {
  cy.contains('a', contactName)
      .parent('div')
      .parent('div')
      .parent('div')
      .next()
      .find('a').contains('remove').should('be.visible')
      .click();
  cy.get('button').contains('Remove').should('be.visible').click()    
  cy.wait(5000)  
});

Cypress.Commands.add('addContactWithCompanyIDAPI', (globalCompanyId, contactName, { subscriberId, userId, globalUserId }, newContactNumber) => {
  cy.request({
    method: 'POST',
    url: '/api/contact/SaveContact',
    body: {
      'Contact': {
        'BirthdayDay': null,
        'BirthdayMonth': null,
        'BusinessAddress': '127 Dying Bird Lane',
        'BusinessCity': 'LA',
        'BusinessCountry': 'United States',
        'BusinessPhone': newContactNumber,
        'BusinessPostalCode': '67899',
        'BusinessStateProvince': '',
        'Comments': '',
        'ContactName': `AAA ${contactName}`,
        'ContactOwnerUserIdGlobal': globalUserId,
        'ContactType': 'Transportation Manager',
        'Email': 'test@test.test',
        'FirstName': 'AAA',
        'FormerEmployee': 0,
        'GlobalCompanyId': globalCompanyId,
        'GlobalContactId': 0,
        'HasChildern': 0,
        'Hobbies': '',
        'HolidayCards': 0,
        'LastName': contactName,
        'Married': 0,
        'MobilePhone': '',
        'OkToCall': 0,
        'PreviousEmployees': '',
        'ReceiveEmail': 0,
        'SubscriberId': subscriberId,
        'Title': 'Guy',
        'UpdateUserId': userId,
        'UpdateUserIdGlobal': globalUserId
      },
      'ProfilePic': null,
      'UpdateUserIdGlobal': globalUserId
    },
  })
})

Cypress.Commands.add('removeContactAPI', (contactID, { subscriberId, userId, globalUserId }) => {
  cy.request({
    method: 'GET',
    url: `/api/contact/DeleteContact/?globalContactId=${contactID}&globalUserId=${globalUserId}&subscriberid=${subscriberId}`,
  })
})

Cypress.Commands.add('listContacts', ({ subscriberId, userId, globalUserId }) => {
  cy.request({
    method: 'POST',
    url: '/api/contact/GetContacts',
    body: {
      'SubscriberId': subscriberId,
      'RecordsPerPage': 60,
      'Keyword': '',
      'CurrentPage': 1,
      'UserId': userId,
      'CompanyId': 0,
      'SortBy': 'contactname asc',
      'UserIdGlobal': globalUserId,
    },
  })
})
