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
    username: "testuser",
  },
};

const testUser = {
  username: "ckruf",
};

const matchingTestUser = {
  username: "testuser",
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
    );
  });

  test("shows blog author and title in non-expanded view", async () => {
    screen.getByText(testBlog.author, { exact: false });
    screen.getByText(testBlog.title, { exact: false });
  });

  test("does not show likes, url and user in non-expanded view", () => {
    const likes = screen.queryByText("likes", { exact: false });
    const postedBy = screen.queryByText("posted by", { exact: false });
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
    await screen.findByText("likes", { exact: false });
    await screen.findByText("posted by", { exact: false });
    const urlDiv = singleBlog.container.querySelector(".blogLink");

    expect(urlDiv).toBeDefined();
  });
});

// the below tests require different setup, than BeforeEach in above 'describe' block,
// that's why they're separate
describe("<SingleBlog /> like button - DEPENDENT ON BUTTON FOR EXPANDED VIEW - ", () => {
  let singleBlog;
  let mockLikeBtnHandler;
  let user;
  let likeBtn;
  let expandBtn;

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
    expandBtn = singleBlog.container.querySelector(".expandBtn");
  });

  test("calls likeBtnHandler twice when button is clicked twice", async () => {
    // expandBtn must also be working for test to pass
    await user.click(expandBtn);
    await user.click(likeBtn);
    await user.click(likeBtn);
    // .mock.calls contains array of arrays with passed arguments,
    // so if the given function was run twice, first with arguments "a", "b" and then
    // with arguments "c", "d" then mock.calls would be [["a", "b"], ["c", "d"]]
    expect(mockLikeBtnHandler.mock.calls).toHaveLength(2);
  });

  test("calls likeBtnHandler with the correct arguments", async () => {
    // expandBtn must also be working for test to pass
    await user.click(expandBtn);
    let likeCount = testBlog.likes;
    await user.click(likeBtn);
    // called with two arguments
    expect(mockLikeBtnHandler.mock.calls[0]).toHaveLength(2);
    expect(mockLikeBtnHandler.mock.calls[0]).toContain(testBlog.id);
    expect(mockLikeBtnHandler.mock.calls[0]).toContain(likeCount + 1);
  });
});

// same comment as above applies - different setup requires test to be separate
test("<SingleBlog /> renders remove button when user is poster of blog (DEPENDEDNT ON BUTTON FOR EXPANDED VIEW", async () => {
  let singleBlog = render(
    <SingleBlog
      blog={testBlog}
      user={matchingTestUser}
      removeBtnHandler={jest.fn()}
      likeBtnHandler={jest.fn()}
    />
  );
  let user = userEvent.setup();
  // expandBtn must also be working for test to pass
  const expandBtn = singleBlog.container.querySelector(".expandBtn");
  await user.click(expandBtn);
  const removeBtn = singleBlog.container.querySelector(".removeBtn");
  expect(removeBtn).toBeDefined();
});

test("<SingleBlog /> does not render remove button when user is not poster of blog (DEPENDENT ON BUTTON FOR EXPANDED VIEW", async () => {
  let singleBlog = render(
    <SingleBlog
      blog={testBlog}
      user={testUser}
      removeBtnHandler={jest.fn()}
      likeBtnHandler={jest.fn()}
    />
  );
  let user = userEvent.setup();
  // expandBtn must also be working for test to pass
  const expandBtn = singleBlog.container.querySelector(".expandBtn");
  await user.click(expandBtn);
  const removeBtn = singleBlog.container.querySelector(".removeBtn");
  expect(removeBtn).toBeNull();
});

test("<SingleBlog /> calls removeBtnHandler with correct arguments (DEPENDENT ON BUTTON FOR EXPANDED VIEW)", async () => {
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
  // expandBtn must also be working for test to pass
  const expandBtn = singleBlog.container.querySelector(".expandBtn");
  await user.click(expandBtn);
  let removeBtn = singleBlog.container.querySelector(".removeBtn");
  await user.click(removeBtn);
  // called with three arguments
  expect(mockRemoveBtnHandler.mock.calls[0]).toHaveLength(3);
  expect(mockRemoveBtnHandler.mock.calls[0]).toContain(testBlog.id);
  expect(mockRemoveBtnHandler.mock.calls[0]).toContain(testBlog.author);
  expect(mockRemoveBtnHandler.mock.calls[0]).toContain(testBlog.title);
});
