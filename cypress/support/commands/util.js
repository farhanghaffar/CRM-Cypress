Cypress.Commands.add('select2Select', (id, search, value) => {
    cy.get(`#${id} ~ span > :nth-child(1) .select2-selection`).click()
    cy.get('.select2-container--open input:nth-child(1)').type(search, { force: true })
    cy.contains('.select2-results__options > li', value).click({ force: true })
})

Cypress.Commands.add('fillForm', (form, data) => {
    for (let key in form) {
        if (!data[key]) {
            continue
        }

        switch (form[key].type) {
            case 'input':
                cy.get(`#${form[key].id}`).clear({ force: true }).type(data[key], form[key].option)
                break
            case 'date_select':
                //cy.get(`#${form[key].id}`).then((elem) => elem.val(data[key]))
                cy.get(`#${form[key].id}`).then(elem => {
                    elem.val(data[key])
                    if (elem.datepicker) elem.datepicker("setDate", new Date(data[key]))
                })
                break
            case 'select':
                cy.get(`#${form[key].id}`).select(data[key], form[key].option)
                break
            case 'select2select':
                cy.select2Select(form[key].id, data[`${key}Search`], data[key])
                break
            case 'checkbox':
                if (data[key] === true) {
                    cy.get(`label[for="${form[key].id}"]:first`).click()
                }
                break
            case 'toggle':
                cy.get(form[key].id).click()
                break

            default:
                break

        }
    }
})

Cypress.Commands.add('uploadFile', { prevSubject: true }, (subject, fileName) => {
    return cy.fixture(fileName).then((content) => {
        const el = subject[0]
        const testFile = new File([content], fileName)
        const dataTransfer = new DataTransfer()

        dataTransfer.items.add(testFile)
        el.files = dataTransfer.files
        cy.log(el.files)
        cy.wrap(subject).trigger('change', { force: true })
    })
})
