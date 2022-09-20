import { frontendBaseUrl, testUser } from "../support/testdata";

describe("Blogs are shown in order of likes", function() {
    beforeEach(function() {
        cy.clearDB();
        cy.registerTestUser(testUser);
        cy.postBlogsVariousLikes(testUser);
        cy.loginTestUser(testUser);
        cy.visit(frontendBaseUrl);

    });

    it("when page is initially loaded", function() {
        // loop over all blogs and expand them by clicking button
        // in order to see like info
        cy
        .get("#blogs")
        .children()
        .each(($el, index, list) => {
            // click expand btn on current blog in iteration
            $el
            .children(".basicInfo")
            .children(".expandBtn")
            .click();
        });

        // loop over all blogs and compare the likes of ith elements
        // with (i + 1)th element 
        cy
        .get("#blogs")
        .children()
        .each(($el, index, list) => {
            if (index < list.length - 1) {

                cy
                .wrap($el)
                .children(".extendedInfo")
                .children(".blogLikes")
                .children(".likeCount")
                .then((span) => {
                    let likeCountCurrent = parseInt(span.text());
                    
                    cy
                    .wrap(list[index + 1])
                    .children(".extendedInfo")
                    .children(".blogLikes")
                    .children(".likeCount")
                    .then((span) => {
                        let likeCountNext = parseInt(span.text());
                        // current blog needs to have more or equal likes to next blog,
                        // if this is true for all, they're in order
                        expect(likeCountCurrent).to.be.at.least(likeCountNext);
                    })
               })
            }
        })
    });

    it("when like button is pressed and the order changes", function () {
        // loop over all blogs and expand them by clicking button
        // in order to see like info
        cy
        .get("#blogs")
        .children()
        .each(($el, index, list) => {
            // click expand btn on current blog in iteration
            $el
            .children(".basicInfo")
            .children(".expandBtn")
            .click();
        });

        cy
        .get("#blogs")
        .children()
        .each(($el, index, list) => {
            if (index === list.length - 1) {
                for (let i = 0; i < 15; i++) {                    
                    cy
                    .wrap($el)
                    .children(".extendedInfo")
                    .children(".blogLikes")
                    .children(".likeBtn")
                    .click()
                    .then(_ => {
                        cy.wait(500);
                    });
                }
            }
        });

        // loop over all blogs and compare the likes of ith elements
        // with (i + 1)th element 
        cy
        .get("#blogs")
        .children()
        .each(($el, index, list) => {
            if (index < list.length - 1) {

                cy
                .wrap($el)
                .children(".extendedInfo")
                .children(".blogLikes")
                .children(".likeCount")
                .then((span) => {
                    let likeCountCurrent = parseInt(span.text());
                    
                    cy
                    .wrap(list[index + 1])
                    .children(".extendedInfo")
                    .children(".blogLikes")
                    .children(".likeCount")
                    .then((span) => {
                        let likeCountNext = parseInt(span.text());
                        // current blog needs to have more or equal likes to next blog,
                        // if this is true for all, they're in order
                        expect(likeCountCurrent).to.be.at.least(likeCountNext);
                    });
               });
            }
        });
    });
});