import { useQuery } from "@apollo/client";
import { useState } from "react";
import { ALL_BOOKS, DISTINCT_GENRES, GENRE_BOOKS } from "../queries";
import { bookToTableRow } from "../helper";


const Books = (props) => {
  const [filtered, setFiltered] = useState(false);

  const allBooksResult = useQuery(ALL_BOOKS, {
    skip: !props.show || filtered
  });

  const filteredBooksResult = useQuery(GENRE_BOOKS, {
    skip: !props.show || !filtered,
    variables: { genre: props.currentFilter }
  });

  const distinctGenresResult = useQuery(DISTINCT_GENRES, {
    skip: !props.show
  });

  const handleFilterBtn = (genre) => {
    setFiltered(true);
    props.setCurrentFilter(genre);
  }

  const handleAllGenreBtn = () => {
    setFiltered(false);
    props.setCurrentFilter(null);
  }

  if (!props.show) {
    return null
  }

  if (allBooksResult.loading) {
    return (
      <>
        <h2>books</h2>
        <div>loading...</div>
      </>
    )
  }

  const allBooks = (allBooksResult.data && allBooksResult.data.allBooks)
  ? allBooksResult.data.allBooks 
  : [];

  const filteredBooks = (filteredBooksResult.data && filteredBooksResult.data.allBooks)
  ? filteredBooksResult.data.allBooks
  : [];

  const distinctGenres = (distinctGenresResult.data && distinctGenresResult.data.distinctGenres)
  ? distinctGenresResult.data.distinctGenres
  : []

  return (
    <div>
      <h2>books</h2>

      <table>
        <thead>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {filtered ? filteredBooks.map(bookToTableRow) : allBooks.map(bookToTableRow)}
        </tbody>
      </table>
      <div>
        {distinctGenres.map(g => (
          <button key={g} onClick={() => handleFilterBtn(g)}>{g}</button>
        ))}
        <button onClick={handleAllGenreBtn}>all genres</button>
      </div>
    </div>
  )
}

export default Books
