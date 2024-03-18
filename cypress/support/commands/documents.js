import { documentForm } from '../../forms'
import moment from 'moment'
import 'moment-timezone'

const documentSelectors = {
    documentList: {
        documentsContainer: '#tableDocumentsList',
        documentAdd: '.docListing .button.add.add-document',
    },
    addDocument: {
        documentTitle: '#DetailTabDocumentsAddEdit_txtDocumentTitle',
        documentDescription: '#DetailTabDocumentsAddEdit_txtDocumentDescription',
        documentSave: '#btnDocumentsEditSave',
    },
    noDocumentsCallToAction: '[data-cypress-testing-id="call-to-action-add-document"]'
}

const { documentsContainer, documentAdd } = documentSelectors.documentList
const { documentTitle, documentDescription, documentSave } = documentSelectors.addDocument

Cypress.Commands.add('checkDocumentValidationMessage', (validationType) => {
    switch (validationType) {
        case 'title':
            cy.get(documentAdd).click()
            cy.get(documentSave).click()
            cy.checkValidationModal('Enter the document title!')
            cy.wait(3000)
            cy.get('#DetailTabDocumentsAddEdit .close.closeX').click()
            break

        case 'document':
            cy.get(documentAdd).click()
            cy.get(documentTitle).type('test')
            cy.get(documentSave).click()
            cy.checkValidationModal('Select a document!')
            cy.wait(3000)
            cy.get('#DetailTabDocumentsAddEdit .close.closeX').click()
            break

        case 'largeFileType':
            cy.get(documentAdd).click()
            cy.get(documentTitle).type('test')
            cy.get('.add-document #drop-wrp').selectFile('cypress/fixtures/images/largeFile.jpg', {
                action: 'drag-drop'
            })

            const errorLargeFileType = {
                errorText: 'File To Large',
                errorContentText: 'The maximum allowable file size is 10MB.',
            }

            cy.checkErrorModal(errorLargeFileType)
            cy.wait(3000)
            cy.get('#DetailTabDocumentsAddEdit .close.closeX').click()
            break

        case 'incorrectFileType':
            const fileNameJson = 'cypress/fixtures/images/upload.json'
            cy.get(documentAdd).click()
            cy.get(documentTitle).type('test')
            cy.get('.add-document #drop-wrp').selectFile(fileNameJson, {
                action: 'drag-drop'
            })
            const errorIncorrectFileType = {
                errorText: 'Unsupported File Type',
                errorContentText: 'The \'.json\' file type is not supported.',
            }

            cy.checkErrorModal(errorIncorrectFileType)
            break
    }
})

Cypress.Commands.add('noDocumentsValidation', () => {
    cy.get(documentSelectors.noDocumentsCallToAction)
        .should('be.visible')
})

Cypress.Commands.add('addDocument', (type, globalCompanyId, contactId, dealId, newDocument, docTitle, docDescription) => {
    const fileName = 'images/sloth.jpg'
    cy.intercept({
        method: 'POST',
        url: '/api/document/SaveDocuments',
    }).as('uploadDocument')
    cy.intercept({
        method: 'POST',
        url: '/api/document/GetDocuments',
    }).as('getDocuments')

    // Click "Add" Document
    cy.get('a[href="#tab-documents"]:first').click()

    cy.get(documentAdd).click()

    // Fill the form
    cy.fillForm(documentForm, newDocument)

    cy.get('.add-document #drop-wrp').selectFile('cypress/fixtures/images/sloth.jpg', {
        action: 'drag-drop'
    })
    cy.wait(8000)
    cy.get(documentSave).click()
    // cy.wait('@uploadDocument')

    cy.wait('@getDocuments')

    // const docID = xhr.response.body[0].DocumentId
    cy.get('#documentsWrapper .action-link.hover-link').should('have.text', docTitle)
    cy.get('#documentsWrapper .data-grid-row [data-col-id="description"]').should('have.text', docDescription)
    cy.get('#documentsWrapper [data-col-id="fileName"] .hover-link').contains('sloth.jpg')
    cy.get('#documentsWrapper .data-grid-row [data-col-id="dateModified"]').contains(moment().tz('America/Los_Angeles').format('ddd, DD-MMM-YY'))

    // deleteDoc === true ? cy.deleteDocumentAPI(docID) : cy.get(documentsContainer).should('be.visible')
})

Cypress.Commands.add('deleteDocument', () => {
    cy.intercept({
        method: 'GET',
        url: '/api/document/Delete',
    }).as('deleteDoc')
    cy.wait(3000)
    cy.get('.hover-link.action-delete > i').click({ force: true })

    // Confirm Yes
    cy.get('.swal2-actions > :nth-child(1)').click({ force: true })
    // cy.wait('@deleteDoc').then(() => {
    cy.noDocumentsValidation()
})

Cypress.Commands.add('addDocumentAPI', (dealID, { subscriberId, userId, globalUserId }) => {
    cy.request({
        method: 'POST',
        url: '/api/document/SaveDocuments',
        'Content-Type': 'application/json; charset=utf-8',
        body: [
            {
                'SubscriberId': subscriberId,
                'UploadedBy': userId,
                'Title': 'API Upload Doc Title',
                'Description': 'API Upload Doc Desc',
                'DocumentBlobReference': 'zp1f5283-4d5d-4e71-a40b-1102ce496066.jpg',
                'DocumentContainerReference': 'temp',
                'FileName': 'bird.jpg',
                'DocumentTypeId': 4,
                'DealId': dealID,
            },
        ],
    })
})