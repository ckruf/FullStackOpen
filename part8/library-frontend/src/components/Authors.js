import { useState } from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { ALL_AUTHORS, SET_BIRTHYEAR } from "../queries";

const Authors = (props) => {
  const [selectedAuthor, setSelectedAuthor] = useState(document.getElementById(""));
  const [birthYearInput, setBirthYearInput] = useState("");

  const authorsResult = useQuery(ALL_AUTHORS, {
    skip: !props.show
  });

  const [ setBirthYear ] = useMutation(SET_BIRTHYEAR, {
    refetchQueries: [ {query: ALL_AUTHORS} ],
    onError: (error) => {
      if (error.graphQLErrors[0] && error.graphQLErrors[0].message) {
        props.setErrorMsg(error.graphQLErrors[0].message);
      } else {
        props.setErrorMsg(JSON.stringify(error));
      }
      setTimeout(() => {
        props.setErrorMsg(null)
      }, 8000)
    }
  })
  
  if (!props.show) {
    return null
  }

  if (authorsResult.loading) {
    return (
      <>
        <h2>authors</h2>
        <div>loading...</div>
      </>
    )
  }

  const authors = (authorsResult.data && authorsResult.data.allAuthors)
  ? authorsResult.data.allAuthors
  : [];

  const handleSetYear = async (event) => {
    event.preventDefault();
    setBirthYear({variables: { name: selectedAuthor, year: parseInt(birthYearInput)}});
    setBirthYearInput("");
    setSelectedAuthor(null);
  }

  const changeOption = (e) => {
    setSelectedAuthor(e.target.value);
  }

  
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      {props.token ? 
        (<form onSubmit={handleSetYear}>
        <select name="authorSelect" onChange={changeOption}>
            <option>Choose author</option>
            {authors.map(a => (<option key={a.name} value={a.name}>{a.name}</option>))}
        </select>
        <label htmlFor="birthyear">born</label>
        <input  type="text" name="birthyear" onChange={({ target }) => setBirthYearInput(target.value)} />
        <input type="submit" value="submit" />
        </form>)
      : (<div>You must be logged in to edit author birthyear.</div>)
      }
    </div>
  )
}

export default Authors
