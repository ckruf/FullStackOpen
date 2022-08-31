const Blog = require("../models/blog");

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

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map(blog => blog.toJSON());
};

module.exports = {
    initialBlogs,
    singleBlogComplete,
    singleBlogMissingLikes,
    singleBlogMissingTitle,
    singleBlogMissingUrl,
    blogsInDb
};