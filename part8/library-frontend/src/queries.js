import { gql } from "@apollo/client";

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    published
    author {
      name
    }
    genres
  }
`

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    born
    bookCount
  }
}
`

export const ALL_BOOKS = gql`

${BOOK_DETAILS}

query {
  allBooks {
    ...BookDetails
  }  
}
`

export const GENRE_BOOKS = gql`

${BOOK_DETAILS}

query filteredGenreBooks($genre: String!) {
  allBooks(genre: $genre) {
    ...BookDetails
  }
}
`

export const USER_RECOMMENDED = gql`
query {
  userRecommended {
    books {
      title
      published
      author {
        name
        born
      }
      genres
    }
    favouriteGenre
  }
}
`

export const DISTINCT_GENRES = gql`
query {
  distinctGenres
}
`

export const CREATE_BOOK = gql`
mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
  addBook(
    title: $title
    author: $author
    published: $published
    genres: $genres
  ) {
    title
    published
    author {
      name
    }
    genres
  }
}
`

export const SET_BIRTHYEAR = gql`
mutation setBirthyear($name: String!, $year: Int!) {
  editAuthor(
    name: $name
    setBornTo: $year
  ) {
    name
    born
  }
}
`

export const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  login(
    username: $username
    password: $password
  ) {
    value
  }
}
`

export const BOOK_ADDED = gql`

${BOOK_DETAILS}

subscription {
  bookAdded {
    ...BookDetails
  }
}
`