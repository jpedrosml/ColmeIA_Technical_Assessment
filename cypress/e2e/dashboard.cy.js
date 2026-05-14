describe('Dashboard Page', () => {
    beforeEach(() => {
        cy.login('qa@test.com','123456')
        cy.contains('Seu login está incorreto, quer continuar?').should('be.visible')
        cy.contains('Continuar').should('be.visible').click()
        cy.url().should('include', '/dashboard')
    })
    /**
    * TESTS RELATED TO DASHBOARD NAVIGATION, SUBMENU RENDERING AND ROUTING.
    */

    context('When navigating and routing', () => {
        it('should display a dropdown menu when clicking on the user profile button', () => {
            cy.contains('Candidato').should('be.visible').click()

            /*
            !!!!!!!!!!!!!!!!!!!!!!!!!! BUG !!!!!!!!!!!!!!!!!!!!!!!!!!

            This is actually a fail because the end user is likely expecting a dropdown or some options, but nothing happens.

            Thus,

            Expected behavior: a dropdown appears displaying some options when clicking on "Candidato".

            Actual result: nothing happens.

            */
        })

        it('should display campaign submenu options when clicking the campaign navigation button', () => {
            /*The issue in this interaction is discussed below
            */
            cy.get('[routerlink="/dashboard/campanha"]').should('be.visible').click()
            cy.contains('Bancos de dados').should('be.visible')
            cy.contains('Colmeia Forms').should('be.visible')

        })

        it('should close the submenu when clicking the campaign button again', () => {

            cy.get('[routerlink="/dashboard/campanha"]').should('be.visible').click()
            cy.contains('Bancos de dados').should('be.visible')
            cy.contains('Colmeia Forms').should('be.visible')

            cy.get('[routerlink="/dashboard/campanha"]').click()
            /* 
            !!!!!!!!!!!!!!!!!!!!!!!!!! BUG !!!!!!!!!!!!!!!!!!!!!!!!!!
            
            There is an issue with this whole interaction. When clicking on the Speaker/Alto-falante button, it is safe to expect
            that a submenu will appear (which it does). However, it is common in scenarios like this to click the same button again and the
            submenu disappear; this does not happen here. The button is tied to a route rather than a toggle state (notice that when you click
            on it, it goes from /dashboard to dashboard/campanha), so clicking it again has no effects.

            Thus,

            Expected behavior: clicking the button again will close the submenu.

            Actual behavior: nothing happens. The submenu retains its expanded state and the only way to collapse it is via back arrow button.

                */
            cy.url().should('not.include', '/dashboard/campanha')
            cy.contains('Bancos de dados').should('not.be.visible')
            cy.contains('Colmeia Forms').should('not.be.visible')
        })

        it('should be possible to interact with the submenu items', () => {
            cy.get('[routerlink="/dashboard/campanha"]').should('be.visible').click()
            cy.contains('Bancos de dados').should('be.visible').click()
            cy.url().should('include', '/dashboard/campanha/bancos-de-dados')

            cy.contains('Colmeia Forms').should('be.visible').click()
            cy.url().should('include', '/dashboard/campanha/colmeia-forms')
        })
    })

    /**
    * TESTS RELATED TO ITEM CREATION, FORM VALIDATION, GENERAL CRUD BEHAVIOR.
    */

    context('When managing the database items', () => {
        it('should display the item creation modal when clicking the "Criar" button', () => {
            cy.navigateToBancoDeDados()
            cy.contains('button', 'Criar').should('be.visible').click()
            cy.get('input[placeholder="Nome do item"]').should('be.visible')
        })

        it('should display a validation message when attempting to save without an input', () => {
            cy.navigateToBancoDeDados()
            cy.contains('button', 'Criar').should('be.visible').click()
            cy.get('input[placeholder="Nome do item"]').should('be.visible')

            cy.contains('button', 'Salvar').should('be.visible').click()

            cy.contains('O nome do item é obrigatório').should('be.visible')
        })

        it('should not create an empty item when saving twice without input', () => {
            cy.navigateToBancoDeDados()
            cy.contains('button', 'Criar').should('be.visible').click()
            cy.get('input[placeholder="Nome do item"]').should('be.visible')

            cy.contains('button', 'Salvar').should('be.visible').click()
            cy.contains('O nome do item é obrigatório').should('be.visible')
            cy.contains('button', 'Salvar').should('be.visible').click()

            /*
            !!!!!!!!!!!!!!!!!!!!!!!!!! BUG !!!!!!!!!!!!!!!!!!!!!!!!!!

            There is an issue here. If one clicks  "Salvar" a second time after the validation message appears,
            an empty item will be created in the list.

            Thus, 

            Expected behavior: the validation should persist no matter how many clicks are done and prevent any item from being created.

            Actual behavior: the second click bypasses the validation and adds an empty item.
            */
            cy.contains('O nome do item é obrigatório').should('be.visible')
        })

        it('should be possible to create a new data base item', () => {
            const itemName = 'Test item'
            const currentDate = new Date().toISOString().split('T')[0]

            cy.navigateToBancoDeDados()
            cy.createItem(itemName)
            cy.contains(itemName).should('be.visible')
            cy.get('table').contains(currentDate).should('be.visible')
        })

        it('should allow the creation of multiple database items', () => {
            const firstItem = 'Test item'
            const secondItem = 'Test item 2'
            const currentDate = new Date().toISOString().split('T')[0]

            cy.navigateToBancoDeDados()

            cy.createItem(firstItem) //creates the first item
            cy.get('table').contains(firstItem).should('be.visible')

            cy.createItem(secondItem) //creates the second item
            cy.get('table').contains(secondItem).should('be.visible')

            cy.get('table').contains(firstItem).should('be.visible')
            cy.get('table').contains(secondItem).should('be.visible')
            cy.get('table').contains(currentDate).should('be.visible')
        })

        it('should delete an item successfully', () => {
            const itemName = 'Test item'

            cy.navigateToBancoDeDados()
            cy.createItem(itemName)
            cy.contains(itemName).should('be.visible')

            cy.get('button[title="Apagar"]').should('be.visible').click()
            cy.contains(itemName).should('not.exist')

            /*
            !!!!!!!!!!!!!!!!!!!!!!!!!! BUG !!!!!!!!!!!!!!!!!!!!!!!!!!
            
            Had I commented line below this TC would not have failed. The reason why is when you delete an item (as long as there
            is a single item in the list), the message "Nenhum banco de dados encontrado" should appear right after the deletion. This does not
            happen unless transitioning between pages or reloading it.

            Thus,

            Expected behavior: the item is sucessfully deleted (which actually happens) and the message "Nenhum banco de dados encontrado" appears.

            Actual behavior: the item is deleted, but the expected message is not displayed.
            
            */
            cy.contains('Nenhum banco de dados encontrado')
        })

        it('should delete only the targeted item when multiple items exist', () => {
            const itemOne = 'Test item one'
            const itemTwo = 'Test item two'

            cy.navigateToBancoDeDados()

            cy.createItem(itemOne)
            cy.contains(itemOne).should('be.visible')

            cy.createItem(itemTwo)
            cy.contains(itemTwo).should('be.visible')

            cy.contains(itemOne).parent().find('button[title="Apagar"]').click() //delete the first item only

            cy.contains(itemOne).should('not.exist')
            cy.contains(itemTwo).should('be.visible')
        })

    })

    /**
    * TESTS RELATED TO PERSISTENCE AFTER CERTAIN ACTIONS.
    */

    context('When dealing with persistence and states', () => {
        it('should persist the created database item after the user reloads the page', () => {
            const itemName = 'Test item'
            const currentDate = new Date().toISOString().split('T')[0]

            cy.navigateToBancoDeDados()
            cy.createItem(itemName)
            cy.get('table').contains(itemName).should('be.visible')

            cy.reload()

            /*
            !!!!!!!!!!!!!!!!!!!!!!!!!! BUG !!!!!!!!!!!!!!!!!!!!!!!!!!

            Although this is a technical assessment, I thought it would be valid to bring up this scenario to test the persistence
            after reloading the page. This test will fail.

            Thus,

            Expected behavior: the user should be able to see the previously added item in the list after reloading the page.

            Actual behavior: the list of items appears empty.
            */

            cy.get('table').contains(itemName).should('be.visible')
            cy.get('table').contains(currentDate).should('be.visible')
        })

        it('should persist items when navigating between submenu pages', () => {
            const itemName = 'Test item'
            const currentDate = new Date().toISOString().split('T')[0]

            cy.navigateToBancoDeDados()
            cy.createItem(itemName)
            cy.contains(itemName).should('be.visible')

            cy.contains('Colmeia Forms').should('be.visible').click()  // navigating to the other submenu item
            cy.url().should('include', '/colmeia-forms')
            cy.contains('Bancos de dados').should('be.visible').click()
            cy.url().should('include', '/bancos-de-dados')

            /*
            !!!!!!!!!!!!!!!!!!!!!!!!!! BUG !!!!!!!!!!!!!!!!!!!!!!!!!!
            
            This was discussed in the previous failed tc, as the persistence does not seem to work. Transitioning between
            the submenu items should retain their creation, but this does not happen here.

            Expected behavior: the created item remains in the list after navigating away and returning.

            Actual behavior: the item list appears empty.
            */
            cy.contains(itemName).should('be.visible')
            cy.get('table').contains(currentDate).should('be.visible')
        })
    })

    /**
    * TESTS RELATED TO LIST SYNC, SEARCH OPTION AND REFRESH BEHAVIOR.
    */

    context('When searching and syncing,', () => {
        it('should refresh the list and maintain items when clicking the refresh button', () => {
            const itemName = 'Test item'
            const currentDate = new Date().toISOString().split('T')[0]

            cy.navigateToBancoDeDados()
            cy.createItem(itemName)
            cy.contains(itemName).should('be.visible')

            cy.get('button[data-variant="icon"] svg path[d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"]').parent().parent().click()

            /*
            !!!!!!!!!!!!!!!!!!!!!!!!!! BUG !!!!!!!!!!!!!!!!!!!!!!!!!!

            From my understanding, this refresh button is supposed to sync/refresh the newly added items in the list
            but instead it wipes the displayed items entirely. I could not find a proper selector as well, that explains the gigantic path. This fails.


            Expected behavior: the list refreshes and the previously created items remain visible.

            Actual behavior: all items disappear after clicking the refresh button.
            */
            cy.contains(itemName).should('be.visible')
            cy.get('table').contains(currentDate).should('be.visible')
        })

        it('should display the correct item when searching by name', () => {
            const items = ['Africa', 'Brazil', 'Germany', 'Denmark']

            cy.navigateToBancoDeDados()

            items.forEach(item => { //used to create all the items instead of doing it one by one
                cy.createItem(item)
                cy.contains(item).should('be.visible')
            })

            items.forEach(item => { //performs individual searches 
                cy.get('input[placeholder="Pesquisar"]').should('be.visible').clear().type(item)

                cy.contains(item).should('be.visible')
                items.filter(other => other !== item).forEach(other => {
                cy.contains(other).should('not.exist')
                })

                cy.get('input[placeholder="Pesquisar"]').clear()
            })
        })
    })

    /**
    * TESTS RELATED TO ARCHIVE FUNCTIONALITY.
    */

    context('When archiving items from database', () => {
        it('should archive an item and remove it from the active list', () => {
            const itemName = 'Test item'

            cy.navigateToBancoDeDados()
            cy.createItem(itemName)
            cy.contains(itemName).should('be.visible')

            cy.contains(itemName).parent().find('button[title="Arquivar"]').click()

            cy.contains(itemName).should('not.exist')
        })

        it('should display archived item in the archived section', () => {
            const itemName = 'Test item'

            cy.navigateToBancoDeDados()
            cy.createItem(itemName)
            cy.contains(itemName).should('be.visible')

            cy.contains(itemName).parent().find('button[title="Arquivar"]').click()
            cy.contains(itemName).should('not.exist')

            cy.get('button[data-variant="icon"] svg.text-red-300').parent().click()

            /*
            !!!!!!!!!!!!!!!!!!!!!!!!!! BUG !!!!!!!!!!!!!!!!!!!!!!!!!!

            There is an issue here. When an item is created, the system gives you the options to delete or hide/archive. If you archive it,
            there is an option that allows you to see the archived items. But they do not appear at all.

            Thus,

            Expected behavior: archived items should appear in the archived section of the page.

            Actual behavior: no items can be seen after archiving them.
            */
            cy.contains(itemName).should('be.visible')
        })

        it('should only archive the targeted item when multiple items exist', () => {
            const itemOne = 'Test item one'
            const itemTwo = 'Test item two'

            cy.navigateToBancoDeDados()

            cy.createItem(itemOne)
            cy.contains(itemOne).should('be.visible')

            cy.createItem(itemTwo)
            cy.contains(itemTwo).should('be.visible')

            cy.contains(itemOne).parent().find('button[title="Arquivar"]').click()

            cy.contains(itemOne).should('not.exist')
            cy.contains(itemTwo).should('be.visible')
        })
    })

    /**
    * TESTS RELATED TO PAGE RENDERING.
    */
   
    context('When interacting with submenu options', () => {
        it('should display content when navigating to Bancos de Dados', () => {
            cy.navigateToBancoDeDados()
            cy.url().should('include', '/dashboard/campanha/bancos-de-dados')

            cy.get('ng-component').should('not.be.empty')
        })

        it('should display content when navigating to Colmeia Forms', () => {
            cy.get('[routerlink="/dashboard/campanha"]').should('be.visible').click()
            cy.contains('Colmeia Forms').should('be.visible').click()
            cy.url().should('include', '/dashboard/campanha/colmeia-forms')

            /* 
            !!!!!!!!!!!!!!!!!!!!!!!!!! BUG !!!!!!!!!!!!!!!!!!!!!!!!!!

            The submenu item Colmeia Forms does not render as expected. The page is completely blank with no content,
            no nothing being displayed to the end user. While inspecting the element is possible to observe that the router is present,
            but what it actually renders is an empty ng-component (possibly indicating the lack of implementation or some loading issue).

            Thus,

            Expected behavior: the page displays the intended content normally.

            Actual behavior: the page is blank.
            */
            cy.get('ng-component').should('not.be.empty')
        })
    })

})