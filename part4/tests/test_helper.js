const Blog = require("../models/blog");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
      },
      {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
      },
      {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
      },
      {
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
      },
      {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
      },
      {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
      }  
];

const singleBlogComplete = {
    title: "How Docker enabled devs to focus on important stuff",
    author: "Christian Kruf",
    url: "https://www.ckruf.com/oaijdwoja51qwd",
    likes: 10
};

const altSingleBlogComplete = {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
};

const singleBlogMissingLikes = {
    title: "How Docker enabled devs to focus on important stuff",
    author: "Christian Kruf",
    url: "https://www.ckruf.com/oaijdwoja51qwd",
};

const singleBlogMissingTitle = {
    author: "Christian Kruf",
    url: "https://www.ckruf.com/oaijdwoja51qwd",
    likes: 10
};

const singleBlogMissingUrl = {
    title: "How Docker enabled devs to focus on important stuff",
    author: "Christian Kruf",
    likes: 10
};

// user whose username complies with reqs (3 char minimum username and password)
const userCompliant = {
  username: "testuser",
  name: "John Doe",
  password: "supersecret123"
};

const alternativeUserCompliant = {
  username: "testuser2",
  name: "Jane Doe",
  password: "gigasecret321"
}

const userShortPassword = {
  username: "testuser3",
  name: "John Smith",
  password: "js"
}

const userShortUsername = {
  username: "tu",
  name: "Andy Anderson",
  password: "password"
}

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map(blog => blog.toJSON());
};

const blogCountInDb = async () => {
  const blogCount = await Blog.countDocuments();
  return blogCount;
}

const randomBlogInDb = async () => {
  const randomBlog = await Blog.findOne();
  return randomBlog;
}

const getBlogByIdInDb = async (id) => await Blog.findById(id);

const nonExistingId = async () => {
  const blog = new Blog({
    title: "willremovethissoon",
    author:"doesntmatter",
    url: "wwww.yourmom.com",
    likes: 1000
   });
  
  await blog.save();
  await blog.remove();
  
  return blog._id.toString();

}

const saveUserToDb = async (user) => {
  const saltRounds = 5;
  const passwordHash = await bcrypt.hash(user.password, saltRounds);
  const userCompliantHashed = new User({
    username: user.username,
    name: user.name,
    passwordHash
  });
  const savedUser = await userCompliantHashed.save();
  return savedUser._id.toString();
}

const getUserToken = async (user) => {
  const userInDb = await User.findOne({username: user.username});
  const userInfoToken = {
    username: userInDb.username,
    id: userInDb._id
  }
  return jwt.sign(userInfoToken, config.JWT_SECRET);
}

const getInvalidUserToken = () => {
  const userInfoToken = {
    username: "randomusername",
    id: new mongoose.Types.ObjectId()
  }

  return jwt.sign(userInfoToken, "supersecretrandomstring");
}

const getUserTokenWrongSecret = async (user) => {
  const userInDb = await User.findOne({username: user.username});
  const userInfoToken = {
    username: userInDb.username,
    id: userInDb._id
  }

  return jwt.sign(userInfoToken, "wrongsecret");
}

const getUserIdFromUsername = async (username) => {
  const user = await User.findOne({username: username});
  return user._id;
}

module.exports = {
    initialBlogs,
    singleBlogComplete,
    altSingleBlogComplete,
    singleBlogMissingLikes,
    singleBlogMissingTitle,
    singleBlogMissingUrl,
    blogsInDb,
    blogCountInDb,
    randomBlogInDb,
    getBlogByIdInDb,
    nonExistingId,
    userCompliant,
    alternativeUserCompliant,
    userShortPassword,
    userShortUsername,
    saveUserToDb,
    getUserToken,
    getInvalidUserToken,
    getUserIdFromUsername,
    getUserTokenWrongSecret
};