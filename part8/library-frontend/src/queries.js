import { gql } from "@apollo/client";

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
query {
  allBooks {
    title
    published
    author {
      name
    }
    genres
  }
}
`

export const GENRE_BOOKS = gql`
query filteredGenreBooks($genre: String!) {
  allBooks(genre: $genre) {
    title
    published
    author {
      name
    }
    genres
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