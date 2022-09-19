// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { backendBaseUrl } from "./testdata";


Cypress.Commands.add("clearDB", () => {
    cy.request("DELETE", `${backendBaseUrl}/api/testing/reset`);
});

Cypress.Commands.add("registerTestUser", (testUser) => {
    cy.request("POST", `${backendBaseUrl}/api/users`, testUser);
});

Cypress.Commands.add("loginTestUser", (testUser) => {
    cy.request("POST", `${backendBaseUrl}/api/login`, testUser)
    .then(response => {
        localStorage.setItem("loggedInUser", JSON.stringify(response.body));
    });
});

Cypress.Commands.add("postTestBlog", (postingUser, testBlogToAdd) => {
    cy.request("POST", `${backendBaseUrl}/api/login`, postingUser)
    .then(response => {
        return cy.request({
            url: `${backendBaseUrl}/api/blogs`,
            method: "POST",
            body: testBlogToAdd,
            headers: {
                "Authorization": `bearer ${response.body.token}`
            }
        });
    });
});


