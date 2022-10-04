import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { 
  ALL_AUTHORS,
  ALL_BOOKS, 
  CREATE_BOOK, 
  DISTINCT_GENRES, 
  GENRE_BOOKS, 
  USER_RECOMMENDED 
} from '../queries'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [ createBook ] = useMutation(CREATE_BOOK, {
    refetchQueries: [ 
      { query: ALL_AUTHORS},
      { query: ALL_BOOKS},
      { query: DISTINCT_GENRES },
      { query: GENRE_BOOKS, variables: { genre: props.currentFilter } },
      { query: USER_RECOMMENDED }
     ],
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

  const submit = async (event) => {
    event.preventDefault()
    createBook({ variables: {title, author, genres, published: parseInt(published)}})

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <h2>Add a new book</h2>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
