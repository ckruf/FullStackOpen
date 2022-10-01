import { useSelector } from "react-redux";
import AddCommentForm from "./AddCommentForm";

const CommentSection = ({ blogId }) => {
  const comments = useSelector((state) => {
    const blog = state.blogs.find(blog => blog.id === blogId);
    if (blog && blog.comments) {
      return blog.comments;
    } else {
      return [];
    }
  })

  return (
    <div>
        <h3>comments</h3>
        
        {
          comments.length < 1 ?
          (
            <>
              <p>There are no comments yet, why don&apos;t you write one?</p>
              <AddCommentForm blogId={blogId} />
            </>
          )
          : 
          (
            <>
              <AddCommentForm blogId={blogId} />
              <ul>
                {comments.map(comment => (
                  <li key={comment.id}>{comment.content}</li>
                ))}
              </ul>
            </>
          )
          
        }
    </div>
  )
}

export default CommentSection;