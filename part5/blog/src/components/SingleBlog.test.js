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
};


const testUser = {
    username: "ckruf"
};

const matchingTestUser = {
    username: "testuser"
};

describe("<SingleBlog />", () => {
    let singleBlog;

    beforeEach(() => {
        singleBlog = render(
            <SingleBlog
                blog={testBlog}
                user={testUser}
                likeBtnHandler={jest.fn()}
                removeBtnHandler={jest.fn()}
            />
        )
    })

    test("shows blog author and title in non-expanded view", async () => {
        screen.getByText(testBlog.author, { exact: false });
        screen.getByText(testBlog.title), { exact: false };

    });
    
    test("does not show likes, url and user in non-expanded view", () => {
        const likes = screen.queryByText("likes");
        const postedBy = screen.queryByText("posted by");
        const urlDiv = singleBlog.container.querySelector(".blogLink"); 

        expect(likes).toBeNull();
        expect(postedBy).toBeNull();
        expect(urlDiv).toBeNull();
    });

    test("button for expanded view works; likes, url and user are shown", async () => {
        const user = userEvent.setup();
        const expandBtn = singleBlog.container.querySelector(".expandBtn");
        await user.click(expandBtn);
        
        // findByText causes exception if nothing is found, so no need
        // to explicitly check for null
        const likes = await screen.findByText("likes");
        const postedBy = await screen.findByText("posted by");
        const urlDiv = singleBlog.container.querySelector(".blogLink"); 

        expect(urlDiv).toBeDefined();
    });
})

// the below tests require different setup, than BeforeEach in above 'describe' block,
// that's why they're separate

describe("<SingleBlog /> like button", () => {
    let singleBlog;
    let mockLikeBtnHandler;
    let user;
    let likeBtn;

    beforeEach(() => {
        mockLikeBtnHandler = jest.fn();
        singleBlog = render(
            <SingleBlog
                blog={testBlog}
                user={testUser}
                likeBtnHandler={mockLikeBtnHandler}
                removeBtnHandler={jest.fn()}
            />
        );
        user = userEvent.setup();
        likeBtn = singleBlog.container.querySelector(".likeBtn");
    });

    test("calls likeBtnHandler twice when button is clicked twice", async () => {
        await user.click(likeBtn);
        await user.click(likeBtn);
        expect(mockLikeBtnHandler.mock.calls).toHaveLength(2);
    });

    test("<SingleBlog /> calls likeBtnHandler with the correct arguments", async () => {
        let likeCount = testBlog.likes;
        await user.click(likeBtn);
        // called with two arguments
        expect(mockLikeBtnHandler.mock.calls[0].toHaveLength(2));
        expect(mockLikeBtnHandler.mock.calls[0]).toContain(testBlog.id);
        expect(mockLikeBtnHandler.mock.calls[0]).toContain(likeCount + 1);
    });

})


test("<SingleBlog /> renders remove button when user is poster of blog", () => {
    let singleBlog = render(
        <SingleBlog
            blog={testBlog}
            user={matchingTestUser}
            removeBtnHandler={jest.fn()}
            likeBtnHandler={jest.fn()}
        />
    );
    const removeBtn = singleBlog.container.querySelector(".removeBtn");
    expect(removeBtn).toBeDefined();
});

test("<SingleBlog /> does not render remove button when user is not poster of blog", () => {
    let singleBlog = render(
        <SingleBlog
            blog={testBlog}
            user={testUser}
            removeBtnHandler={jest.fn()}
            likeBtnHandler={jest.fn()}
        />
    );
    const removeBtn = singleBlog.container.querySelector(".removeBtn");
    expect(removeBtn).toBeUndefined();
});

test("<SingleBlog /> calls removeBtnHandler with correct arguments", async () => {
    let mockRemoveBtnHandler = jest.fn();
    let user = userEvent.setup();
    let singleBlog = render(
        <SingleBlog
            blog={testBlog}
            user={matchingTestUser}
            removeBtnHandler={mockRemoveBtnHandler} 
            likeBtnHandler={jest.fn()}
        />
    );
    let removeBtn = singleBlog.container.querySelector(".removeBtn");
    await user.click(removeBtn);
    // called with three arguments
    expect(mockRemoveBtnHandler.mock.calls[0]).toHaveLength(3);
    expect(mockRemoveBtnHandler.mock.calls[0]).toContain(testBlog.id);
    expect(mockRemoveBtnHandler.mock.calls[0]).toContain(testblog.author);
    expect(mockRemoveBtnHandler.mock.calls[0]).toContain(testblog.title);
});
