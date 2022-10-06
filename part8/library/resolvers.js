const { UserInputError, AuthenticationError } = require("apollo-server-express");
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const config = require("./config");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

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
      else if (args.genre && args.genre !== "all") {
        return allBooks.filter(b => b.genres.includes(args.genre));
      }
      else {
        return allBooks;
      }
    },
    allAuthors: async () => {
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

      pubsub.publish("BOOK_ADDED", { bookAdded: book });

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

      return { value: jwt.sign(userTokenData, config.JWT_SECRET) };
    }

  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED")
    }
  }
}

module.exports = resolvers;