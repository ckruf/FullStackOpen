import { Link } from "react-router-dom";

const UsersTable = ({ users }) => {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>username</th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {
            users.map(user => 
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`}>{user.username}</Link>
                </td>
                <td>
                  {user.blogs.length}
                </td>
              </tr>  
            )
          }
        </tbody>
      </table>
    </>
  )
}

export default UsersTable;