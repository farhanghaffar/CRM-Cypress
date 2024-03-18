import moment from 'moment'
import 'moment-timezone'
import { noteForm } from '../../forms'

const notesSelectors = {
    noteBody: {
        noteDate: '[data-col-id="createdDate"]',
        noteTitle: '[data-col-id="note"]',
        noteAuthor: '[data-col-id="owner"]',
        editNote: '.fa.fa-edit',
        deleteNote: '#NoteAddEdit_btnNoteDelete',
    },
    noteContainer: {
        addNote: '#btnAddNote',
    },
    noteForm: {
        noteBody: '#NoteAddEdit_txtNote_edit',
        saveNote: '#NoteAddEdit_btnNoteAdd',
    },
    noNotes: {
        noNotesIcon: '.no-notes.empty-box.tableDisplay .icon-Notes',
        noNotesText: '.no-notes.empty-box.tableDisplay .e-text',
    },
    notesHeader: {
        notesTitle: '.note-listing.basic-card .card-title.language-entry',
        notesIcon: '.note-listing.basic-card .icon-Notes.title-icon',
    },
    noNotesCallToAction: '[data-cypress-testing-id="call-to-action-add-note"]'
}

const { noteDate, noteTitle, noteAuthor, editNote, deleteNote } = notesSelectors.noteBody
const { addNote } = notesSelectors.noteContainer
const { noteBody, saveNote } = notesSelectors.noteForm
const { notesTitle, notesIcon } = notesSelectors.notesHeader
const specifitNoteSelector = (noteId) => `.row-wrapper[data-activityid="${noteId}"]`

Cypress.Commands.add('addNote', (newNote, newNoteName, userName, globalUserId) => {
    cy.intercept({
        method: 'POST',
        url: '/api/note/savenote',
    }).as('newNote')
    cy.get(notesTitle).contains('Notes')
    cy.get(notesIcon).should('be.visible')

    // fill the note form
    cy.get(addNote)
        .click()
    cy.fillForm(noteForm, newNote)
    cy.wait(3000)
    // save note
    cy.get(saveNote).click()
    cy.wait('@newNote').then((xhr) => {
        const noteId = xhr.response.body
        const noteSelector = specifitNoteSelector(noteId)

        cy.get(noteSelector).should('be.visible')
        cy.get(`${noteSelector} ${noteTitle}`).contains(newNoteName)
        cy.get(`${noteSelector} ${noteDate}`).contains(moment().tz('America/Los_Angeles').format('ddd, DD MMM, YYYY'))
        cy.get(`${noteSelector} ${noteAuthor}`).contains(userName)
        cy.deleteNoteAPI(noteId, globalUserId)
    })
})

Cypress.Commands.add('editNote', (editNoteTitle, newNoteBody, noteId, userName, globalUserId) => {
    cy.intercept({
        method: 'POST',
        url: '/api/note/savenote',
    }).as('newNote')

    const noteSelector = specifitNoteSelector(noteId)

    cy.get(`${noteSelector} ${noteTitle}`).contains(editNoteTitle)
    cy.get(`${noteSelector} ${editNote}`)
        .click()
    cy.get(noteBody)
        .clear()
        .type(newNoteBody)
    cy.get(saveNote).click()
    cy.wait('@newNote')

    cy.get(noteSelector).should('be.visible')
    cy.get(`${noteSelector} ${noteTitle}`).contains(newNoteBody)
    cy.get(`${noteSelector} ${noteDate}`).contains(moment().tz('America/Los_Angeles').format('ddd, DD MMM, YYYY'))
    cy.get(`${noteSelector} ${noteAuthor}`).contains(userName)
    cy.deleteNoteAPI(noteId, globalUserId)
})

Cypress.Commands.add('deleteNote', (noteTitleForDelete, noteId) => {
    cy.intercept({
        method: 'GET',
        url: `/api/note/deletenote/?noteId=${noteId}&globalUserId=13752`,
    }).as('deleteNote')
    cy.get(`${specifitNoteSelector(noteId)} ${editNote}`)
        .click()
    cy.get(deleteNote).click()
    cy.get('button.swal2-confirm.swal2-styled').contains('Yes, Delete!').click()
    cy.wait('@deleteNote')
    cy.noNotesDisplaysCorrectly()
    // cy.get('#divNotes').should('not.contain', noteTitleForDelete)
})

Cypress.Commands.add('noNotesDisplaysCorrectly', () => {
    cy.get(notesSelectors.noNotesCallToAction).should('be.visible')
})

Cypress.Commands.add('checkNoNoteValidation', () => {
    cy.get(addNote)
        .click()
    cy.get(saveNote).click()
    cy.checkValidationModal('Enter a note!')
})

Cypress.Commands.add('addNoteAPI', (type, { globalCompanyId, noteContent, contactId, dealId }, { subscriberId, userId, globalUserId }) => {
    switch (type) {
        case 'company':
            cy.request({
                url: '/api/note/savenote',
                method: 'POST',
                body: {
                    'ActivityId': 0,
                    'CompanyIdGlobal': globalCompanyId,
                    'NoteContent': noteContent,
                    'SubscriberId': subscriberId,
                    'UpdateUserId': userId,
                    'UpdateUserIdGlobal': globalUserId,
                    'OwnerUserIdGlobal': globalUserId,
                    'UserId': userId,
                    'UserIdGlobal': globalUserId,
                },
            })
            break

        case 'contact':
            cy.request({
                url: '/api/note/savenote',
                method: 'POST',
                body: {
                    'ActivityId': 0,
                    'CompanyIdGlobal': globalCompanyId,
                    'NoteContent': noteContent,
                    'SubscriberId': subscriberId,
                    'ContactIds': contactId,
                    'UpdateUserId': userId,
                    'UpdateUserIdGlobal': globalUserId,
                    'OwnerUserIdGlobal': globalUserId,
                    'UserId': userId,
                    'UserIdGlobal': globalUserId,
                },
            })
            break
        case 'deal':
            cy.request({
                url: '/api/note/savenote',
                method: 'POST',
                body: {
                    'ActivityId': 0,
                    'CompanyIdGlobal': globalCompanyId,
                    'NoteContent': noteContent,
                    'SubscriberId': subscriberId,
                    'UpdateUserId': userId,
                    'DealIds': dealId,
                    'UpdateUserIdGlobal': globalUserId,
                    'OwnerUserIdGlobal': globalUserId,
                    'UserId': userId,
                    'UserIdGlobal': globalUserId,
                },
            })
    }

})

Cypress.Commands.add('deleteNoteAPI', (noteId, globalUserId) => {
    cy.request({
        method: 'GET',
        url: `/api/note/DeleteNote/?noteId=${noteId}&globalUserId=${globalUserId}`,
    })
})

Cypress.Commands.add('addNoteAPIUsers', ({ globalCompanyID, noteContent, userId, globalUserId, subscriberId }) => {
    cy.request({
        url: '/api/note/savenote',
        method: 'POST',
        body: {
            'ActivityId': null,
            'CompanyIdGlobal': globalCompanyID,
            'NoteContent': noteContent,
            'SubscriberId': subscriberId,
            'UserId': userId,
            'UserIdGlobal': globalUserId,
            'UpdateUserId': userId,
            'UpdateUserIdGlobal': globalUserId,
            'OwnerUserIdGlobal': globalUserId,
        },
    })
})
