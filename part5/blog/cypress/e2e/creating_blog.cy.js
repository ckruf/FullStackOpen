import { frontendBaseUrl, testBlogToAdd, testUser } from "../support/testdata";

/*
Steps:
1) press create new blog button (#createBlogBtn)
2) fill out inputs:
2.1) .titleInput
2.2) .authorInput
2.3) .urlInput
3) press add blog button (#submitBlogBtn)
4) test that success notification is displayed  (.successNotification)
5) test that add blog form is hidden (div #shownWhenVisible has style display: none
6) test that blog gets added to list of blogs (element containing blog title can be found on page)
*/

it("Blog can be added when user is authenticated", function() {
    cy.clearDB();
    cy.registerTestUser(testUser);
    cy.loginTestUser(testUser);
    cy.visit(frontendBaseUrl);
    cy.get("#createBlogBtn").click();
    cy.get(".titleInput").type(testBlogToAdd.title);
    cy.get(".authorInput").type(testBlogToAdd.author);
    cy.get(".urlInput").type(testBlogToAdd.url);
    cy.get("#submitBlogBtn").click();
    cy.get(".successNotification")
    .should("contain", "New blog added")
    .and("have.css", "color", "rgb(0, 128, 0)");
    // add blog form gets hidden after submission
    cy.get("#shownWhenVisible")
    .should("have.css", "display", "none");
    cy.contains(testBlogToAdd.title);
});