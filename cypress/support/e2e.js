import './commands/activity'
import './commands/calendar'
import './commands/campaigns'
import './commands/companies'
import './commands/contacts'
import './commands/deals'
import './commands/documents'
import './commands/events'
import './commands/general'
import './commands/lanes'
import './commands/languages'
import './commands/locations/locations'
import './commands/locations/locations_companyLocations'
import './commands/locations/locations_countriesToRegions'
import './commands/locations/locations_districts'
import './commands/locations/locations_globalLocations'
import './commands/locations/locations_regions'
import './commands/login'
import './commands/navBar'
import './commands/notes'
import './commands/reports/reportsActivitiesByDateRange'
import './commands/reports/reportsGeneral'
import './commands/reports/reportsSalesRepKpiReports'
import './commands/quotes'
import './commands/salesTeam'
import './commands/settings'
import './commands/tasks'
import './commands/users'
import './commands/util'
import './localStorage'
import './cookies'


beforeEach(function () {
  // cy.restoreLocalStorage()
  // cy.restoreCookieStorage()
})

afterEach(() => {
  // cy.saveLocalStorage()
  // cy.saveCookieStorage()
})

Cypress.Cookies.defaults({
  // whitelist: (cookie) => {
  //   console.log(cookie)
  //   // implement your own logic here
  //   // if the function returns truthy
  //   // then the cookie will not be cleared
  //   // before each test runs
  // }
  preserve: ['ASP.NET_SessionId', '__cfduid', 'ARRAffinity'],
})

Cypress.on('uncaught:exception', (err, runnable) => {
  cy.log('uncaught:exception', err)
  console.log(`err: ${err}`)
  console.log(`runnable: ${runnable}`)

  return false
})
