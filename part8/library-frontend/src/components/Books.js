import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";


const Books = (props) => {
  const booksResult = useQuery(ALL_BOOKS, {
    skip: !props.show 
  });

  if (!props.show) {
    return null
  }

  if (booksResult.loading) {
    return (
      <>
        <h2>books</h2>
        <div>loading...</div>
      </>
    )
  }

  const books = (booksResult.data && booksResult.data.allBooks)
  ? booksResult.data.allBooks 
  : [];

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
