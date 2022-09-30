import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeUsers } from "../reducers/allUsersReducer";
import UsersTable from "../components/UsersTable";


const UsersView = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.allUsers);

  useEffect(() => {
    dispatch(initializeUsers());
  }, [dispatch]);

  return (
    <div>
      <h2>Users</h2>
      <UsersTable users={users} />
    </div>
  )
}

export default UsersView;