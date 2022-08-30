const dummy = (blogs) => 1;

// when given list of blog objects, return total likes of all blog objects in list
const totalLikes = (blogs) => {
    const reducer = (sum, item) => sum + item.likes;

    return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0);
};

// when given list of blog objects, return blog object with most likes
const favoriteBlog = (blogs) => {
    const reducer = (mostLikedBlog, currentBlog) => {
        // if blog we are currently iterating over has more likes than
        // blog which is currently most liked, set current blog as most liked blog
        return currentBlog.likes > mostLikedBlog.likes
        ? currentBlog
        : mostLikedBlog 
    }

    return blogs.length === 0
    ? {}
    // start with object which has -1 likes, so function 
    // works even with list with single blog with 0 likes
    : blogs.reduce(reducer, {likes: -1})
};

// when given list of blogs, return name of author with most blogs 
// and the number of blogs they have, for example {author: "Robert C. Martin", blogs: 3}
const mostBlogs = (blogs) => {

    if (blogs.length === 0) {
        return {};
    }

    let counterObject = {}

    for (const blog of blogs) {
        if (counterObject[blog.author]) {
            counterObject[blog.author] += 1;
        }
        else {
            counterObject[blog.author] = 1;
        }
    }

    let resultObject = {
        blogs: -1
    };

    for (const author in counterObject) {
        if (counterObject[author] > resultObject.blogs) {
            resultObject.author = author;
            resultObject.blogs = counterObject[author];
        }
    }
    
    return resultObject; 
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return {};
    }

    let counterObject = {}

    for (const blog of blogs) {
        if (counterObject[blog.author]) {
            counterObject[blog.author] += blog.likes;
        }
        else {
            counterObject[blog.author] = blog.likes;
        }
    }

    let resultObject = {
        likes: -1
    };

    for (const author in counterObject) {
        if (counterObject[author] > resultObject.likes) {
            resultObject.author = author;
            resultObject.likes = counterObject[author];
        }
    }

    return resultObject; 
}



module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
};
