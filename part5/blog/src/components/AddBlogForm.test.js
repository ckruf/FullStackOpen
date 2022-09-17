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
    // TODO - add class to inputs for title, author, url in AddBlogFrom component,
    // so we can select the inputs in this test
});