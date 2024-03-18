import { COMPANY_ADD_URL } from '../../urls'
import { stringGen } from '../../support/helpers';

context('company-validation', () => {
  before(() => {
    cy.APILogin('salesRep')
  })
  describe('Contact Form Validation', () => {

    beforeEach(() => {
      cy.visit(COMPANY_ADD_URL)
    })

    it('Company Name, Address, City and Industry correct validation with no input', () => {
      cy.get('#txtCompanyNameSearch')
        .type(stringGen(15))
      cy.get('#aSearchCompany')
        .click()
      cy.get('#txtCompanyName')
        .clear()
      cy.checkCompanyFormValidation()
    })
  })
})
