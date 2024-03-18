import { stringGen, numGen } from '../../support/helpers'
const users = Cypress.env('users')
const subscriberId = Cypress.env('subscriberId')

context('login', () => {

  before(() => {
    cy.navigateAndCheckURL('')
  })
  describe('login form', () => {
    describe('validation', () => {
      it('no email data validation message', () => {
        cy.loginValidation('noEmail')
      })

      it('invalid email validation message', () => {
        cy.loginValidation('invalidEmail')
      })

      it('no password data validation message', () => {
        cy.loginValidation('noPassword')
      })

      it('invalid login details', () => {
        cy.loginValidation('incorrectDetails')
      })
    })

    describe('navigation', () => {
      const footerSelector = (path) => `.row.login-footer .text-left a[href="${path}"]`

      beforeEach(() => {
        cy.navigateAndCheckURL('')
      })

      it('navigate to terms and conditions page', () => {
        cy.get(footerSelector('Privacy.aspx'))
                    .should('have.text', 'Privacy Policy')
                    .click()

        cy.url().should('have.string', 'Privacy.aspx')
        cy.get('h1.page-title').should('have.text', 'Privacy Statement')
      })

      it('navigate to privacy policy page', () => {
        cy.get(footerSelector('Terms.aspx'))
                    .should('have.text', 'Terms & Conditions')
                    .click()

        cy.url().should('have.string', 'Terms.aspx')
        cy.get('h1.page-title').should('have.text', 'Terms and Conditions')
      })
    })
  })

  describe('functionality', () => {
    const userData = {
      firstName: 'Jeremy',
      lastName: 'Clarkson',
      email: `${stringGen(9)}${numGen(6)}@thegrandtour${numGen(7)}.com`,
      jobTitle: 'presenter',
      mobilePhone: '1234567890',
      phone: '9988997765',
      fax: '0987654321',
      billingCode: '123',
      locationName: 'Manchester',
      address: '107 Piccadilly',
      city: 'Manchester',
      state: 'Greater Manchester',
      postCode: 'M60 7HA',
      country: 'UK',
      currency: 'GBP',
      languageCode: 'en-US',
      displayLanguage: 'English',
      spokenLanguage: 'English',
      userRole: 'Sales Rep',
      userId: 9432,
      subscriberId: subscriberId
    }

    describe('login', () => {
      let newUserId

      before(() => {
        cy.request({
          method: 'GET',
          url: '/TestPage.aspx?token=906f01a3a56f4b55a5019ad49a5f8e0c',
        })
        cy.addUserAPI(userData).then((response) => {
          newUserId = response.body.UserId
        })
      })

      beforeEach(() => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.navigateAndCheckURL('')
      })

      after(() => {
        cy.request({
          method: 'GET',
          url: '/TestPage.aspx?token=906f01a3a56f4b55a5019ad49a5f8e0c',
        })
        cy.deleteUserAPI(newUserId, subscriberId, users['crmAdmin'].userId)
      })

      it('user must be able to successfully login', () => {
        const user = 'salesManager';
        cy.login(user)
        cy.get('#navSidebar_lblUserName')
                    .should('have.text', users[user].details.name)
      })

      it('newly created user can login successfully', () => {
        cy.get('#txtUsername')
                    .type(userData.email)
        cy.wait(500)
        cy.get('#txtPassword')
                    .type('password')
        cy.wait(500)
        cy.get('#btnLogin')
                    .click()

        cy.get('#navSidebar_lblUserName')
                    .should('have.text', `${userData.firstName} ${userData.lastName}`)
      })
    })

    describe('logout', () => {
      const user = 'salesManager';
      before(() => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.navigateAndCheckURL('')
        cy.login(user)
        cy.get('#navSidebar_lblUserName')
                    .should('have.text', users[user].details.name)
      })

      it('user should be able to logout', () => {
        cy.get('#navSidebar_imgUserProfilePic')
                    .click()

        cy.wait(2000)

        cy.get('#lblUserFullName').should('have.text', users[user].details.name)
        cy.get('.btn-log-out')
                    .should('have.text', 'Log Out')
                    .click()

        cy.get('#txtUsername')
                    .should('be.visible')
        cy.get('#txtPassword')
                    .should('be.visible')
        cy.get('#btnLogin')
                    .should('be.visible')
      })
    })

    describe.skip('forgot password', () => {
      it('user must be able to change password', () => {

      })

      it('user must be able to login after password change', () => {

      })
    })
  })
})
