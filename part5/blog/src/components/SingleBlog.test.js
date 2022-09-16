import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import SingleBlog from "./SingleBlog";
import userEvent from "@testing-library/user-event";

const testBlog = {
    id: "63242832f9baa64f8a548b74",
    author: "Christian Kruf",
    title: "I don't get React",
    url: "www.ckruf.com/65sef4654fe16wfe",
    likes: 25,
    user: {
        name: "John Doe",
        username: "testuser"
    }
}

const testUser = {
    username: "ckruf"
}

describe("<SingleBlog />", () => {
    let singleBlog;

    beforeEach(() => {
        singleBlog = render(
            <SingleBlog blog={testBlog} user={testUser} />
        )
    })

    test("shows blog author and title in non-expanded view", async () => {
        await screen.findByText(testBlog.author);
        await screen.findByText(testBlog.title);

    });
    
    test("does not show likes, url and user in non-expanded view", () => {
        const likes = screen.queryByText("likes");
        const postedBy = screen.queryByText("posted by");
        const urlDiv = singleBlog.querySelector(".blogLink"); 

        expect(likes).toBeNull();
        expect(postedBy).toBeNull();
        expect(urlDiv).toBeNull();
    });

    test("button for expanded view works; likes, url and user are shown", async () => {
        const user = userEvent.setup();
        const expandBtn = singleBlog.querySelector(".expandBtn");
        await user.click(expandBtn);
        
        // findByText causes exception if nothing is found, so no need
        // to explicitly check for null
        const likes = await screen.findByText("likes");
        const postedBy = await screen.findByText("posted by");
        const urlDiv = singleBlog.querySelector(".blogLink"); 

        expect(urlDiv).toBeDefined();
    });
})

test("<SingleBlog /> calls likeBtnHandler twice when button is clicked twice", async () => {
    const mockLikeBtnHandler = jest.fn();
    const singleBlog = render(
        <SingleBlog blog={testBlog} user={testUser} likeBtnHandler={mockLikeBtnHandler} />
    );

});

test("<SingleBlog /> calls likeBtnHandler with the correct arguments", () => {

});

test("<SingleBlog /> renders remove button when user is poster of blog", () => {

});

test("<SingleBlog /> does not render remove button when user is not poster of blog", () => {

});

test("<SingleBlog /> calls removeBtnHandler with correct arguments", () => {

});
