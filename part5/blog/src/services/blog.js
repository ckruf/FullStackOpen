import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = newToken => {
    token = `bearer ${newToken}`
};

const getAll = () => {
    const response = await axios.get(baseUrl);
    return response.data;
}

const addNew = (newBlog) => {
    const config = {
        headers: {Authorization: token}
    };
    const response = await axios.post(baseUrl, newBlog, config);
    return response.data;
}

export default {setToken, getAll, addNew};