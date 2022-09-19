import { frontendBaseUrl, testUser } from "../support/testdata";

describe("Logging in via login form", function() {
    beforeEach(function() {
        cy.clearDB();
        cy.registerTestUser(testUser);
        cy.visit(frontendBaseUrl);
    });

    it("succeeds with correct credentials, logout and create new blog buttons shown", function() {
        cy.get(".usernameInput").type(testUser.username);
        console.log(testUser.password);
        cy.get(".passwordInput").type(testUser.password);
        cy.get(".loginButton").click();
        cy.wait(500).then(() => {
            expect(JSON.parse(localStorage.getItem("loggedInUser"))).to.have.property("token");
        });
        cy.contains(`${testUser.username} is logged in`);
        cy.contains("Logout");
        cy.contains("create new blog");
    });

    it("fails with incorrect credentials", function() {
        cy.get(".usernameInput").type(testUser.username);
        cy.get(".passwordInput").type("wrongpassword");
        cy.get(".loginButton").click();
        cy.contains("login");
        cy.contains("password");
        cy.get(".error")
        .should("contain", "invalid username or password")
        .and("have.css", "color", "rgb(255, 0, 0)")
    });
});