const users = Cypress.env('users')

const loginSelectors = {
  loginForm: {
    email: '#txtUsername',
    password: '#txtPassword',
    loginBtn: '#btnLogin',
  },
}

const { email, password, loginBtn } = loginSelectors.loginForm

Cypress.Commands.add('loginValidation', (type) => {
  switch (type) {
    case 'noEmail':
      cy.get(loginBtn).click()
      cy.get(email).then(($input) => {
        expect($input[0].validationMessage).to.eq('Please fill out this field.')
      })
      break
    case 'invalidEmail':
      cy.get(email)
        .clear()
        .type('test123')

      cy.get(loginBtn)
        .click()

      cy.get(email).then(($input) => {
        expect($input[0].validationMessage).to.eq('Please include an \'@\' in the email address. \'test123\' is missing an \'@\'.')
      })
      break
    case 'noPassword':
      cy.get(email)
        .clear()
        .type('test@test.com')

      cy.get(loginBtn)
        .click()

      cy.get(password).then(($input) => {
        expect($input[0].validationMessage).to.eq('Please fill out this field.')
      })
      break
    case 'incorrectDetails':
      cy.get(email)
        .clear()
        .type('test@test.com')

      cy.get(password)
        .clear()
        .type('rdtfcvygbuhnjmkjnlbhkugvyjfctdx')

      cy.get(loginBtn)
        .click()

      cy.get('#divError[class="alert alert-danger"]')
        .should('be.visible')
        .and('have.text', 'Invalid Login Details')
        .should('have.css', 'background-color')
        .and('eq', 'rgb(248, 215, 218)')
      break
  }
})

Cypress.Commands.add('login', (loginUser) => {
  const user = users[loginUser]

  cy.visit('/login.aspx')
  cy.get('#txtUsername')
    .type(user.username)
  cy.wait(500)
  cy.get('#txtPassword')
    .type(user.password)
  cy.wait(500)
  cy.get('#btnLogin')
    .click()
})

Cypress.Commands.add('logOutProgramatically', () => {
  cy.clearCookies()
  cy.clearLocalStorage()
})

Cypress.Commands.add('APILogin', (user) => {
  const loginToken = (token) => cy.request({
    method: 'GET',
    url: token,
  })

  switch (user) {
    case 'salesRep':
      loginToken('/TestPage.aspx?token=aioausyh46214516hAeR1Qr')
      break
    case 'salesManager':
      loginToken('/TestPage.aspx?token=084a55ab70e441faac6b6612354be324')
      break
    case 'locationManager':
      loginToken('/TestPage.aspx?token=4044d679f4f847af942d302595bb958a')
      break
    case 'districtManager':
      loginToken('/TestPage.aspx?token=3c341adeb0cb4e9d90746ba47b40b258')
      break
    case 'countryAdmin':
      loginToken('/TestPage.aspx?token=3c341adeb0cb4e9d90746ba47b40b258')
      break
    case 'countryManager':
      loginToken('/TestPage.aspx?token=76952f97a165418aa718ca43ac88b8ac')
      break
    case 'regionalManager':
      loginToken('/TestPage.aspx?token=73141ac53fd947a398d8f34c7b7de949')
      break
    case 'crmAdmin':
      loginToken('/TestPage.aspx?token=906f01a3a56f4b55a5019ad49a5f8e0c')
      break
  }
})
