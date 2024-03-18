Cypress.Commands.add('navBarToggleState', (toggle) => {
    // 0 == active
    // 1 == off
    const navHover = () => cy.get('#navSidebar_imgUserProfilePic').trigger('mouseover')
    const toggleNavBar = () => cy.get('.user-section.btn-user-menu-expand-on-hover').click()
    const navBarExpanded = () => cy.get('#sidebar').should('have.class', 'expanded')
    const navBarCollapsed = () => cy.get('#sidebar').should('not.have.class', 'expanded')
    const toggleAway = () => cy.get('.globalHead').trigger('mouseover')
    if (toggle == 0) {
        toggleAway()
        navBarCollapsed()
        navHover()
        navBarExpanded()
    } else if (toggle == 1) {
        navHover()
        toggleNavBar()
        toggleAway()
        navBarExpanded()
        navHover()
        navBarExpanded()
    }
})