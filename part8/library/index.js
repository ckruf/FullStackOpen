const { ApolloServer, UserInputError, gql, AuthenticationError } = require('apollo-server')
const mongoose = require("mongoose");
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "SUPER_SECRET_JWT_KEY";

const MONGODB_URI = "mongodb://localhost:27017";

console.log("connecting to ", MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB: ", error.message);
  })

const typeDefs = gql`
  type Author {
    name: String!
    born: Int
    id: ID!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type AuthorWithBookCount {
    name: String!
    born: Int
    bookCount: Int
  }

  type User {
    username: String!
    favouriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type userRecommendations {
    books: [Book!]!
    favouriteGenre: String!
  }

  type Query {
    authorCount: Int!
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [AuthorWithBookCount!]!
    me: User
    distinctGenres: [String!]!
    userRecommended: userRecommendations
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favouriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    // even though these functions are async, so they return a promise, 
    // Apollo resolves the promise for us.
    authorCount: async () => Author.collection.countDocuments(),
    bookCount: async () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      const allBooks = await Book.find({}).populate("author");
      if (args.author) {
        // dumb solution to filter in JS rather than in mongo, but after the monstrosity
        // that is the allAuthors query, fuck it
        return allBooks.filter(b => b.author.name === args.author);
      }
      else if (args.genre) {
        return allBooks.filter(b => b.genres.includes(args.genre));
      }
      else {
        return allBooks;
      }
    },
    allAuthors: async () => {
      // TODO add functionality for bookCount
      const aggregationResult = await Book.aggregate([
        {
          $group:
          {
            _id: "$author",
            bookCount: {$sum: 1}
          }
        },
        {
          $lookup:
          {
            from: "authors",
            localField: "_id",
            foreignField: "_id",
            as: "author_details"
          }
        },
        {
          $project:
          {
            _id: 0
          }
        },
        {
          $unwind: "$author_details"
        }
      ]);

      const authors = aggregationResult.map(result => {
        return {
          bookCount: result.bookCount,
          name: result.author_details.name,
          born: result.author_details.born,
          id: result.author_details._id 
        }
      })

      return authors;
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
    distinctGenres: async (root, args) => {
      return Book.distinct("genres");
    },
    userRecommended: async (root, args, context) => {
      const favouriteGenre = context.currentUser.favouriteGenre;
      const books = await Book.find({genres: favouriteGenre}).populate("author");
      return { books, favouriteGenre }
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }
      // check if we have author of book in db and if not, create 
      const potentialAuthor = await Author.findOne({name: args.author});
      if (!potentialAuthor) {
        let newAuthor = new Author({
          name: args.author
        });
        newAuthor = await newAuthor.save();
        args.author = newAuthor
      } else {
        args.author = potentialAuthor;
      }
      // save book
      const book = new Book({ ...args });
      try {
        await book.save();
      } catch (error) {
        console.error("error while saving book")
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      return book
      
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }
      return Author.findOneAndUpdate({name: args.name}, { born: args.setBornTo }, {returnDocument: "after"});
    },

    createUser: async (root, args) => {
      const potentialUser = await User.findOne({ username: args.username });

      if (potentialUser) {
        throw new UserInputError("user with given username already exists");
      }

      const user = new User({ username: args.username, favouriteGenre: args.favouriteGenre });

      try {
        return user.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        });
      }
    },

    login: async (root, args) => {
      const user = await User.findOne({username: args.username});

      if (!user || args.password !== "secret") {
        throw new UserInputError("wrong credentials");
      }

      const userTokenData = {
        username: user.username,
        id: user._id
      };

      return { value: jwt.sign(userTokenData, JWT_SECRET) };
    }

  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith("bearer")) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})