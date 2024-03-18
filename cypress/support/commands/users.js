import { numGen } from '../helpers'

Cypress.Commands.add('addUserAPI', (
  {
    firstName,
    lastName,
    email,
    jobTitle,
    mobilePhone,
    phone,
    fax,
    billingCode,
    locationName,
    address,
    city,
    state,
    postCode,
    country,
    currency,
    languageCode,
    displayLanguage,
    spokenLanguage,
    userRole,
    userId,
    subscriberId
  }) => {
  cy.request({
    url: '/api/user/SaveUser',
    method: 'POST',
    body: {
      'User': {
        'UserId': 0,
        'SubscriberId': subscriberId,
        'FirstName': firstName,
        'LastName': lastName,
        'EmailAddress': email,
        'Title': jobTitle,
        'MobilePhone': mobilePhone,
        'Phone': phone,
        'Fax': fax,
        'BillingCode': billingCode,
        'LocationId': '4412',
        'LocationName': locationName,
        'DistrictName': '',
        'Address': address,
        'City': city,
        'StateProvince': state,
        'PostalCode': postCode,
        'CountryName': country,
        'CurrencyCode': currency,
        'LanguageCode': languageCode,
        'DisplayLanguage': displayLanguage,
        'LanguagesSpoken': spokenLanguage,
        'UserRoles': userRole,
        'DateFormat': 'dd/MM/yyyy',
        'ReportDateFormat': '',
        'TimeZone': 'Greenwich Mean Time',
        'TimeZoneOffset': '+00:00',
        'TimeZoneCityNames': 'Dublin, Edinburgh, Lisbon, London',
        'UpdateUserId': userId,
        'LoginEnabled': true,
        'Password': 'password',
      },
      'ProfilePic': null,
      'ManagerUserIds': [],
    },
  })
})

Cypress.Commands.add('deleteUserAPI', (deleteUserId, subscriberId, userId) => {
  cy.request({
    url: `/api/user/DeleteUser/?userId=${deleteUserId}&subscriberid=${subscriberId}&loggedInUserId=${userId}`,
    method: 'GET',
  })
})
