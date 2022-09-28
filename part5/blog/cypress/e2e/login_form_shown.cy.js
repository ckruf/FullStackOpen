import { frontendBaseUrl } from "../support/testdata";

it("Login form is shown on homepage when unauthenticated", function () {
  cy.clearDB();
  cy.visit(frontendBaseUrl);
  cy.contains("username");
  cy.contains("password");
  cy.get(".usernameInput");
  cy.get(".passwordInput");
});
