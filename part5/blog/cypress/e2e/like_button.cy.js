import { frontendBaseUrl } from "../support/testdata";

/*
Steps:
1) click expand button .expandBtn (there is only one blog, so no ambiguity)
2) parse current like count from .likeCount span
3) click like button .likeBtn (ditto)
4) parse updated like count and verify it has incremented
*/

it("Clicking like button increments like count by one", function() {
    cy.clearDB();
    cy.registerTestUser();
    cy.postTestBlog();
    cy.loginTestUser();
    cy.visit(frontendBaseUrl);
    cy.get(".expandBtn").click();
    cy.get(".likeCount").then((span) => {
        const likesBefore = parseInt(span.text());

        cy.get(".likeBtn").click();
        const likesAfter = parseInt(span.text());

        expect(likesAfter).to.eq(likesBefore + 1);
    })
})