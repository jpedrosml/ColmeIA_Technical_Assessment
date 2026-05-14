/**
 * Reducing the number of lines with the custom command to login
 */

Cypress.Commands.add('login', (email, password) => {
    cy.visit('https://teste-colmeia-qa.colmeia-corp.com/')
    cy.get('#email').type(email)
    cy.get('#password').type(password)
    cy.get('button[type="submit"]').click()
})

/**
 * Reducing the number of lines with the custom command to navigate to the database
 */

Cypress.Commands.add('navigateToBancoDeDados', () => {
    cy.get('[routerlink="/dashboard/campanha"]').should('be.visible').click()
    cy.contains('Bancos de dados').should('be.visible').click()
})

/**
 * Reducing the number of lines with the custom command to create items.
 */

Cypress.Commands.add('createItem', (itemName) => {
    cy.contains('button', 'Criar').should('be.visible').click()
    cy.get('input[placeholder="Nome do item"]').should('be.visible').type(itemName)
    cy.contains('button', 'Salvar').should('be.visible').click()
})