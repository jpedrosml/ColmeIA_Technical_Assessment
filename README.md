# ColmeIA Technical Assessment - Test Analyst Role

This repository stores the technical assessment code for the Test Analyst role at ColmeIA. The goal of this assessment is to use Cypress to explore the given application and identify abnormalities. Automated test scenarios were implemented using Cypress + JavaScript, ranging from basic smoke checks to critical flow validations, and all bugs found are documented inline with their expected vs. actual behavior.


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
- There are some buttons that have no identifiers, which ended up compromising the testing process. Both were targeted using positional selectors relative to nearby elements, and were also documented inline when they happened.

