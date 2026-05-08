describe('Login Page', () => {
    beforeEach(() => {
        cy.visit('https://teste-colmeia-qa.colmeia-corp.com/')
    })

    it('should not login when invalid credenials are entered', () => {
        cy.login('test@test.com','123456') // there is a command created for the login steps. please check support/commands.js
        cy.contains('Usuário ou senha inválidos').should('be.visible')
    })

    it('should display an error when leaving blank fields', () => {
        cy.get('button[type="submit"]').should('be.visible').click()
        /* Perhaps it's safe to say that this specific interaction should be
        returning "Este campo é obrigatório" instead of "Usuário ou senha inválidos"
        
        Thus,

        Expected behavior: the application should display a specific validation message in this scenario,
        such as "Este campo é obrigatório" before attempting auth.

        Actual behavior: the application returns "Usuário ou senha inválidos", even when both fields are empty,
        which does not make sense.

        .*/
        //cy.contains('Usuário ou senha inválidos').should('be.visible')
        cy.contains('Este campo é obrigatório').should('be.visible')

    })

    it('should validate invalid and empty email input states', () => {
        cy.get('#email').should('be.visible').type('#')
        cy.contains('Email inválido').should('be.visible')
        cy.get('#email').should('be.visible').type('{backspace}')
        cy.contains('Este campo é obrigatório').should('be.visible')
    })

    it('should validate email without "@"', () => {
        cy.get('#email').should('be.visible').type('invalidemail.com')
        cy.contains('Email inválido').should('be.visible')
    })

    it('should validate email without domain', () => {
        cy.get('#email').should('be.visible').type('invalidemail@')
        cy.contains('Email inválido').should('be.visible')
    })
  
    it('should validate whitespace-only email input', () => {
        cy.get('#email').should('be.visible').type(' ')
        cy.contains('Este campo é obrigatório').should('be.visible')
    })

    it('should display error messages when transitioning between input fields without anything being entered', () => {
        cy.get('#email').should('be.visible').click()
        cy.get('#password').should('be.visible').click()
        cy.contains('Este campo é obrigatório').should('be.visible')
    })

    it('should display error messages when attempting to login with the email or password only', () => {
        cy.get('#email').should('be.visible').type('qa@test.com')
        cy.get('button[type="submit"]').should('be.visible').click()
        cy.contains('Usuário ou senha inválidos')
        cy.get('#email').clear()    
        cy.get('#password').should('be.visible').type('123456')
        cy.get('button[type="submit"]').should('be.visible').click()
        cy.contains('Usuário ou senha inválidos').should('be.visible')
    })

    it('should have password field masked', () => {
        cy.get('#password').should('be.visible').type('123456')
        cy.get('#password').should('have.attr', 'type', 'password')
    })

    it('should handle SQL injection', () => {
        cy.login("' OR '1'='1","' OR '1'='1")
        cy.contains('Usuário ou senha inválidos').should('be.visible')
    })

    it('should handle XSS', () => {
        cy.login('<script>alert("xss")</script>','<script>alert("xss")</script>')
        cy.contains('Usuário ou senha inválidos').should('be.visible')
    })

    it('should login successfully when valid credentials are entered', () => {
        cy.login('qa@test.com','123456')
        /* This is another bug. When entering valid credentials, the end user obviously expects to be redirected
        to the main page/dashboard/whatever of the application, but this does not happen here. Instead, a box appears
        stating that the login is incorrect and asking if the user wants to continue. If they do continue, they are
        redirected to the main dashboard regardless.

        Thus,

        Expected behavior: the user is able to login without any issues and is taken to the main dashboard.

        Actual behavior: the application returns "Seu login está incorreto, quer continuar?", despite the valid credentials. If the
        user clicks on the button, they are redirected to the main dashboard.

            
        */
        //cy.contains('Seu login está incorreto, quer continuar?').should('be.visible')
        //cy.contains('Continuar').should('be.visible').click()
        cy.url().should('include', '/dashboard')
    })

    it('should trigger an authentication error when attemping to return to the previous page after logged in', () => {
        cy.login('qa@test.com','123456')
        cy.contains('Seu login está incorreto, quer continuar?').should('be.visible')
        cy.contains('Continuar').should('be.visible').click()
        cy.url().should('include', '/dashboard')
        /*Here lies another issue. Once logged in and on the dashboard, returning to the previous page will not trigger
        any auth issues. The user returns to the previous page as if they had not logged in in the first place.

        Thus,

        Expected behavior: the user is unable to return to the previous page without auth confirmation.

        Actual behavior: the user returns to the previous page as if they had not logged in the first place
        
        */
        cy.go('back')
        cy.url().should('not.eq', 'https://teste-colmeia-qa.colmeia-corp.com/')
    })

    it('should not be able to access the dashboard without being logged in', () => {
        cy.visit('https://teste-colmeia-qa.colmeia-corp.com/dashboard')
        /* Same issue discussed in the previous test, but more interesting. It is possible to go directly to the dashboard
        even without being logged in. In this case, the test should have been written as "should('not.include')" but it would fail.

        Thus,

        Expected behavior: the user is not able to go directly to the dashboard without logging in.

        Actual behavior: the user is able to go to the dashboard even without logging in.
        
        */
        cy.url().should('not.include','/dashboard')
    })

    it('should not expose credentials in the URL field', () => {
        cy.login('qa@test.com','123456')
        cy.url().should('not.include', 'password')
        cy.url().should('not.include', '123456')
    })

    it('should redirect the user when clicking on "Esqueceu sua senha?"', () => {
        cy.contains('Esqueceu sua senha?').should('be.visible').click()
        /* The "Esqueceu sua senha?" option does nothing when clicked. There are no redirects, modals or network requests in the console.
            Inspecting the element, the issue lies in the fact that is an <a> tag with no href and no event handler.

            Expected behavior: the user is redirected to a password recovery page or a modal is displayed.

            Actual behavior: nothing happens.
        */
        cy.url().should('not.eq', 'https://teste-colmeia-qa.colmeia-corp.com/')
    })
})