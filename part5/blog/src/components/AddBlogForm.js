import { useState } from "react";
import Input from "./Input";
import { InputStateSetter } from "../common";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import { addBlog } from "../reducers/blogsReducer";

const AddBlogForm = () => {
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogAuthor, setNewBlogAuthor] = useState("");
  const [newBlogUrl, setNewBlogUrl] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleBlogSubmit = async (event) => {
    event.preventDefault();
    try {
      const newBlog = {
        title: newBlogTitle,
        author: newBlogAuthor,
        url: newBlogUrl,
      };
      dispatch(addBlog(newBlog, user));
      dispatch(
        setNotification(
          `New blog added: ${newBlogTitle} by ${newBlogAuthor}`,
          "success",
          5
        )
      );
      setNewBlogTitle("");
      setNewBlogAuthor("");
      setNewBlogUrl("");
    } catch (error) {
      console.error("Got an error while adding blog:");
      console.error(error);
      if (error.response.data.error) {
        dispatch(setNotification(error.response.data.error, "error", 8));
      } else {
        dispatch(setNotification("Adding blog failed", "error", 8));
      }
    }
  };

  return (
    <form onSubmit={handleBlogSubmit}>
      <div>
        title:{" "}
        <Input
          className="titleInput"
          type="text"
          value={newBlogTitle}
          onChangeHandler={InputStateSetter(setNewBlogTitle)}
        />
      </div>
      <div>
        author:{" "}
        <Input
          className="authorInput"
          type="text"
          value={newBlogAuthor}
          onChangeHandler={InputStateSetter(setNewBlogAuthor)}
        />
      </div>
      <div>
        url:{" "}
        <Input
          className="urlInput"
          type="text"
          value={newBlogUrl}
          onChangeHandler={InputStateSetter(setNewBlogUrl)}
        />
      </div>
      <div>
        <button id="submitBlogBtn" type="submit">
          add blog
        </button>
      </div>
    </form>
  );
};

export default AddBlogForm;
