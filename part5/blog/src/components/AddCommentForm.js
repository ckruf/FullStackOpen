import { useState } from "react";
import { useDispatch } from "react-redux";
import { handleBlogComment } from "../reducers/blogsReducer";
import { setNotification } from "../reducers/notificationReducer";
import { InputStateSetter } from "../common";

const AddCommentForm = ({ blogId }) => {
  const [commentText, setCommentText] = useState("");
  const dispatch = useDispatch();

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    try {
      dispatch(handleBlogComment(blogId, commentText));
      setCommentText("");
    } catch (error) {
      console.error("Error while commenting blog");
      console.error(error);
      if (error.response.data.error) {
        dispatch(setNotification(error.response.data.error, "error", 8));
      } else {
        dispatch(setNotification("Commenting blog failed", "error", 8));
      }
    }
    
  }

  return (
    <div>
      <form onSubmit={handleCommentSubmit}>
        <input
          placeholder="Add your insight"
          className="commentInput"
          type="text"
          value={commentText}
          onChange={InputStateSetter(setCommentText)}
          minLength={4}
        />
        <button type="submit">add comment</button>
      </form>
    </div>
  )
}

export default AddCommentForm;