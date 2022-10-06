import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import ErrorNotification from './components/ErrorNotification'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import { useApolloClient, useSubscription } from '@apollo/client'
import { BOOK_ADDED } from './queries'

const App = () => {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [currentFilter, setCurrentFilter] = useState("all");

  // need this to clear cache on logout
  const client = useApolloClient();

  useEffect(() => {
    const userTokenInStorage = localStorage.getItem("library-user-token");
    if (userTokenInStorage) {
      setToken(userTokenInStorage);
    }
  }, []);

  // TODO - updating cache
  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log(subscriptionData);
    }
  })

  const handleLogout = () => {
    setToken(null);
    localStorage.clear();

    // we must clear Apollo client cache, because it might have
    // cached results of queries that unauthorized users should not have access to
    client.resetStore();
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {
          token 
            ?  <button onClick={() => setPage('add')}>add book</button> 
            : null
        }
        {
          token
            ? <button onClick={() => setPage("recommendations")}>recommendations</button>
            : null
        }
        {
          token 
            ? <button onClick={handleLogout}>logout</button> 
            : <button onClick={() => setPage("login")}>login</button>
        }
      </div>

      <ErrorNotification
        errorMsg={errorMsg} 
      />

      <Authors
        show={page === 'authors'}
        setErrorMsg={setErrorMsg}
        token={token} 
      />

      <Books
       show={page === 'books'}
       currentFilter={currentFilter}
       setCurrentFilter={setCurrentFilter}
      />

      <NewBook 
        show={page === 'add'}
        setErrorMsg={setErrorMsg}
        currentFilter={currentFilter}
      />

      <LoginForm 
        show={page === "login"}
        setErrorMsg={setErrorMsg} 
        setToken={setToken} 
        setPage={setPage}
      />

      <Recommendations
        show={page === "recommendations"}
      />
    </div>
  )
}

export default App
