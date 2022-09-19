import { frontendBaseUrl, testBlogToAdd, testUser, altTestUser } from "../support/testdata";

/*
Prep steps:
1) clearDB
2) registerTestUser
3) postTestBlog
4) loginTestUser

Test 1 - user who posted blog can delete it - steps:
1) click expand button .expandBtn (there is only one blog, so no ambiguity)
2) assert that removeBtn is in the DOM (.removeBtn)
3) click removeBtn
4) confirm window.confirm dialog
5) assert that blog is not in the DOM anymore (either no elements with .singleBlog and/or blog title not on page anymore)

Test 2 - user who did not post blog can not delete it - steps:
0) make sure test blog was posted by different author that logged in
1) click expans button .expandBtn
2) assert that removeBtn is NOT in the DOM (.removeBtn)
*/

describe("Removing blog", function() {
    beforeEach(function() {
        cy.clearDB();
    });

    it("is possible for user who posted the blog", function() {
        cy.registerTestUser(testUser);
        cy.postTestBlog(testUser, testBlogToAdd)
        .then(blogId => {
            cy.loginTestUser(testUser);
            cy.visit(frontendBaseUrl);
            // confirm the blog is shown on the page before deleting
            cy.contains(testBlogToAdd.title);

            cy
            .get(`#${blogId}`)
            .children(".basicInfo")
            .children(".expandBtn")
            .click();
            
            cy
            .get(`#${blogId}`)
            .children(".blogRemover")
            .children(".removeBtn")
            .click();

            cy.on('window:confirm', () => true);
            // confirm the blog is not shown on the page after deleting 
            cy.contains(testBlogToAdd.title).should("not.exist");
        });   
    });

    it("is not possible for user who did not post the blog", function() {
        cy.registerTestUser(testUser);
        cy.registerTestUser(altTestUser);
        // post blog as testUser
        cy.postTestBlog(testUser, testBlogToAdd)
        .then(blogId => {
            // login as altTestUser - should not be able to delete the blog
            cy.loginTestUser(altTestUser);
            cy.visit(frontendBaseUrl);

            cy
            .get(`#${blogId}`)
            .children(".basicInfo")
            .children(".expandBtn")
            .click();

            cy
            .get(`#${blogId}`)
            .children(".blogRemover")
            .should("not.exist");
        })
        
    });
});