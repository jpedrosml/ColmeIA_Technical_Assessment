# ColmeIA Technical Assessment - Test Analyst Role

This repository stores the technical assessment code for the Test Analyst role at ColmeIA. The goal of this assessment is to use Cypress to explore the given application and identify abnormalities. Automated test scenarios were implemented using Cypress + JavaScript, ranging from basic smoke checks to critical flow validations, and all bugs found are documented inline with their expected vs. actual behavior. You can find the report written in Portuguese, along with some evidences [here](https://docs.google.com/document/d/19oYvkHU52yY7yX2_BKWtwzLZerNqac0iLqvQcJBGqMY/edit?usp=sharing).


## Tech Stack

- [Cypress](https://www.cypress.io/)
- JavaScript

## Setup

For running this project you will first need to install Node (you can find it here https://nodejs.org/en/download). In this page you will also find the tutorial on how to install it according to your operational system. Once installed:

1. Clone the repository and navigate to the project folder
2. Install dependencies:

```bash
npm install
```

3. Open Cypress:

```bash
npx cypress open
```

Or run headlessly:

```bash
npx cypress run
```

4. Select **E2E Testing**, and choose your preferred browser.
   - `login.cy.js` (/cypress/e2e/) covers the login page flows and validations
   - `dashboard.cy.js` (/cypress/e2e/) covers the dashboard, navigation, and database item management


## Coverage

### Login Page (`login.cy.js`)
- Invalid credentials login attempt (expected: error message of some sort);
- Blank input fieflds (expected: specific validation messages);
- Invalid character in email field and empty state transitions (expected: adequate validation messages for each state);
- Email without "@" symbol (expected: invalid email message);
- Email without domain (.com and such) (expected: invalid email message);
- Whitespaces on email input (expected: required field message);
- Field transition without input (clicking from email to password field, and vice versa) (expected: required field message);
- Login attempt with email only and password only (expected: appropriate error messages for each scenario);
- Password field masking (expected: input type to be password, in other words, the masking dots are expected);
- SQL injection strings in both fields (expected: immediate rejection);
- XSS strings in both fields (expected: immediate rejection);;
- "Esqueceu sua senha?" appropriate behavior (expected: redirect to password recovery page or modal, which never happens by the way);
- Successful login with valid credentials (expected: redirect to dashboard/main page);
- Back button behavior after login (expected: session protection preventing return to login page);
- Direct dashboard access without authentication (expected: redirect to login page).

### Dashboard Page (`dashboard.cy.js`)
- "Candidato" profile button behavior (expected: dropdown or common profile options ex: settings, customize etc);
- Campaign submenu expansion on button click (expected: submenu to expand correctly);
- Campaign submenu toggle on second click (expected: submenu to collapse);
- Submenu item navigatio (expected: proper routing and rendering);
- Bancos de Dados page proper rendering (expected: table, search option and action buttons to be present and functional);
- Colmeia Forms page content rendering (expected: page content to be displayed);
- Item creation modal display (expected: modal with name input);
- Empty form submission validation (expected: validation that blocks empty tries);
- Empty item creation bypass on double save (expected: validation should be retained);
- Successful item creation with name and date (expected: immediate show up in the list);
- Item remains after page reload (expected: created items to remain in the list upon such actions);
- Item remains after navigating between submenu pages (expected: created items to remain in the list upon such actions);
- Multiple item creation (expected: all items to appear in the list);
- Refresh button (expected: list to sync and retain already existing items);
- Single item deletion (expected: item to be removed);
- Single deletion when multiple items exist (expected: only the selected item should be removed);
- Search functionality with multiple items (expected: only the input to be displayed);
- Single item archiving (expected: item to be removed from database list and appear in archived section);
- Archived item visibility in archived section (expected: archived items to be listed);
- Single item archiving when multiple items exist (expected: only the selected item to be archived).
  
## Some bugs found

### Login Page
- Submitting blank credentials returns "Usuário ou senha inválidos" instead of a field validation message;
- Valid credentials trigger a suspicious confirmation dialog before allowing access;
- "Esqueceu sua senha?" link is completely unresponsive, with no redirects or modals;
- Dashboard is publicly accessible without authentication;
- Returning to the login page after being authenticated does not trigger any session protection.

### Dashboard Page 
- Clicking "Candidato" does nothing (a dropdown or profile options are normally expected from such interaction);
- Campaign submenu button does not toggle (once expanded, clicking it again has no effect);
- Created items are not persisted (wiped list upon reloading);
- Created items are not persisted (wiped list upon navigation);
- Refresh button wipes the item list rather thab syncing it;
- Saving an empty form twice bypasses validation and creates an empty item;
- "Nenhum banco de dados encontrado" message does not appear after deleting the last item;
- Archived items do not appear in the archived section;
- Colmeia Forms page renders completely blank (route exists but it appears unimplemented).

### Some additional thoughts

- The email provided some credentials, but due to a bug in the application, valid credentials trigger a confirmation dialog before granting access. Likewise, it is possible to access the dashboard without login;
- There are some buttons that have no identifiers, which ended up compromising the testing process. Both were targeted using positional selectors relative to nearby elements, and were also documented inline when they happened;
- "Colmeia Forms" submenu option could not be tested since it does not render anything.


