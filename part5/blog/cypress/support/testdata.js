const backendBaseUrl = "http://localhost:3003";
const frontendBaseUrl = "http://localhost:3000";

const testUser = {
    "username": "testuser",
    "password": "secret",
    "name": "Benjamin Franklin"
};

const altTestUser = {
    "username": "anothertester",
    "password": "alsosecret",
    "name": "Thomas Jefferson"
}

const testBlogToAdd = {
    title: "Using Cypress for E2E testing",
    author: "Christian Kruf",
    url: "www.ckruf.com/qw65e4dq6wed"
};

const testBlogsVaryingLikes = [
    {
        title: "Cypress' working with variables is very limited",
        author: "Christian Kruf",
        url: "www.ckruf.com/we5fw6efwe",
        likes: 3
    },
    {
        title: "Cypress does not support async/await",
        author: "Christian Kruf",
        url: "www.ckruf.com/ef56wef4",
        likes: 7
    },
    {
        title: "I hate that I find Cypress kinda cool",
        author: "Christian Kruf",
        url: "www.ckurf.com/we56f1w65e",
        likes:1
    }
]

export default {
    backendBaseUrl,
    frontendBaseUrl,
    testUser,
    testBlogToAdd,
    altTestUser,
    testBlogsVaryingLikes
};