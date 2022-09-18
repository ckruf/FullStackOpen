const backendBaseUrl = "http://localhost:3003";
const frontendBaseUrl = "http://localhost:3000";

const testUser = {
    "username": "testuser",
    "password": "secret",
    "name": "Benjamin Franklin"
};

const testBlogToAdd = {
    title: "Using Cypress for E2E testing",
    author: "Christian Kruf",
    url: "www.ckruf.com/qw65e4dq6wed"
};

export default { backendBaseUrl, frontendBaseUrl, testUser, testBlogToAdd };