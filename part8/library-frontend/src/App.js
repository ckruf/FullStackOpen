import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import ErrorNotification from './components/ErrorNotification'

const App = () => {
  const [page, setPage] = useState('authors');

  const [errorMsg, setErrorMsg] = useState(null);

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <ErrorNotification errorMsg={errorMsg} />

      <Authors show={page === 'authors'} setErrorMsg={setErrorMsg} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} setErrorMsg={setErrorMsg} />
    </div>
  )
}

export default App
