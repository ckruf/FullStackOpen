import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const SingleUserView = ({ userId }) => {
  const users = useSelector((state) => state.allUsers);

  if (!userId) {
    return null;
  }

  const user = users.find(user => user.id === userId)

  if (!user) {
    return (
      <h2>user not found :(</h2>
    )
  }
  
  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {
          user.blogs.map(blog => 
          <li key={blog.id}><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></li>
          )
        }
      </ul>
    </div>
  )
}

export default SingleUserView;