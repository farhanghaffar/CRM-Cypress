import { taskForm, taskFormCal } from '../../forms'

const tasksSelectors = {
    taskForm: {
        taskName: '#TaskAddEdit_txtName',
        taskDescription: '#TaskAddEdit_txtDescription',
        taskDueDate: '#TaskAddEdit_txtDueDate',
        taskDealName: 'select#TaskAddEdit_ddlDeal',
        taskContact: 'select#TaskAddEdit_ddlContact',
        addTask: '#btnAddTask',
        addTaskCal: '#TaskAddEdit_btnTaskAdd',
        saveTask: '#task-add-actions > a#TaskAddEdit_btnTaskAdd',
        deleteTask: '#TaskAddEdit_btnTaskDelete',
    },
    viewTasks: {
        listDate: '#DueDate',
        listName: '.items-wrap [data-col-id="name"]',
        listDesc: '.Description',
        listUser: '.ContactNames',
        listCompany: '#CompanyName',
        listEdit: '.action-edit > i.fa-edit',
        listDelete: '.action-delete > i.icon-Delete',
    },
    noTasksCallToAction: '[data-cypress-testing-id="call-to-action-add-task"]',
}

const { taskContact, taskDealName, taskDescription, taskDueDate, taskName, addTask, addTaskCal, saveTask, deleteTask } = tasksSelectors.taskForm
const { listDate, listDesc, listName, listUser, listEdit, listCompany, listDelete } = tasksSelectors.viewTasks

Cypress.Commands.add('validationTaskTester', () => {
    cy.get(addTask).click()
    cy.get(saveTask).click()
    const individualRequiredTester = (selector) => {
        cy.get(selector)
            .should('have.class', 'required')
            .and('have.class', 'error')
            .should('have.css', 'border-color')
            .and('eq', 'rgb(205, 43, 30)')
    }

    individualRequiredTester(taskName)
    individualRequiredTester(taskDescription)
    individualRequiredTester(taskDueDate)
})

Cypress.Commands.add('addTask', (newTask, taskName) => {
    cy.intercept({
        url: '/api/task/SaveTask',
        method: 'POST',
    }).as('saveTask')
    cy.get(addTask).click()
    cy.fillForm(taskForm, newTask)
    cy.wait(2000)
    cy.get(saveTask)
        .click()
    cy.wait('@saveTask')
    cy.get(listName)
        .contains(taskName)
})

Cypress.Commands.add('addTaskCalendar', (newTask) => {
    cy.fillForm(taskFormCal, newTask)
    cy.wait(2000)
    cy.get(addTaskCal)
        .click()
})

Cypress.Commands.add('deleteTask', (taskID) => {
    const individualTaskSelector = `.task-item-row[data-activityid="${taskID}"]`

    cy.get(listName)
        .click()
    // cy.get(`${individualTaskSelector} ${listDelete}`).click()
    cy.get(deleteTask)
        .click()
    cy.get('.swal2-actions > :nth-child(1)').click()
    cy.wait(5000)
    cy.noTasks()

})

Cypress.Commands.add('noTasks', () => {
    cy.get(tasksSelectors.noTasksCallToAction).should('be.visible')
})

Cypress.Commands.add('deleteTaskAPI', (taskID, globalUserId, subscriberId) => {
    cy.request({
        method: 'GET',
        url: `/api/task/DeleteTask/?taskId=${taskID}&globalUserId=${globalUserId}&subscriberId=${subscriberId}`,
    })
})

Cypress.Commands.add('addTaskAPIUsers', ({ subscriberId, globalUserId, taskName, taskDescription = '', dueDate, globalCompanyID = '', invitesArray = [] }) => {
    cy.request({
        url: '/api/task/SaveTask',
        method: 'POST',
        body: {
            'task': {
                'SubscriberId': subscriberId,
                'UserIdGlobal': globalUserId,
                'OwnerUserIdGlobal': globalUserId,
                'UpdateUserIdGlobal': globalUserId,
                'TaskName': taskName,
                'Description': taskDescription,
                'DueDate': dueDate,
                'CompanyIdGlobal': globalCompanyID,
                'DealIds': null,
            },
            "Invites": invitesArray,
        },
    })
})
