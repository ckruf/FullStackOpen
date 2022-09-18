import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import AddBlogForm from "./AddBlogForm";
import userEvent from "@testing-library/user-event";

test("<AddBlogForm /> calls passed addBlog function with correct arguments", async () => {
    const mockAddBlog = jest.fn();
    let addBlogForm = render(
        <AddBlogForm
            setNotificationMsg={jest.fn()}
            setErrorMsg={jest.fn()}
            addBlog={mockAddBlog}
        />
    );
    let user = userEvent.setup();
    
    const testBlogData = {
        title: "Blog test title",
        author: "Blog test author",
        url: "www.example.com"
    }

    const titleInput = addBlogForm.container.querySelector(".titleInput");
    const authorInput = addBlogForm.container.querySelector(".authorInput");
    const urlInput = addBlogForm.container.querySelector(".urlInput");
    const submitBtn = screen.getByText("add blog");
    
    await user.type(titleInput, "Blog test title");
    await user.type(authorInput, "Blog test author");
    await user.type(urlInput, "www.example.com");
    await user.click(submitBtn);
    // .mock.calls contains array of arrays with passed arguments, 
    // so if the given function was run twice, first with arguments "a", "b" and then
    // with arguments "c", "d" then mock.calls would be [["a", "b"], ["c", "d"]]
    expect(mockAddBlog.mock.calls).toHaveLength(1);
    expect(mockAddBlog.mock.calls[0]).toContainEqual(testBlogData);
});