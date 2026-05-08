# ColmeIA Technical Assessment - Test Analyst Role

This repository stores the technical assessment code for the Test Analyst role at ColmeIA. The goal of this assessment is to use Cypress to explore the given application and identify abnormalities. Automated test scenarios were implemented using Cypress + JavaScript, ranging from basic smoke checks to critical flow validations, and all bugs found are documented inline with their expected vs. actual behavior.


## Tech Stack

- [Cypress](https://www.cypress.io/)
- JavaScript

## Setup

For running this project you will first need to install Node (you can find it here https://nodejs.org/en/download). In this page you will also find the tutorial on how to install it according to your operational system.

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
