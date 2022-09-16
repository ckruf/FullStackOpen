import axios from "axios";
const baseUrl = "http://localhost:3003/api/blogs";

let token = null;

const setToken = newToken => {
    token = `bearer ${newToken}`
};

const getAll = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
}

const addNew = async (newBlog) => {
    const config = {
        headers: {Authorization: token}
    };
    const response = await axios.post(baseUrl, newBlog, config);
    return response.data;
}

const updateLikes = async (id, newLikeCount) => {
    const config = {
        headers: {Authorization: token}
    };
    const response = await axios.patch(`${baseUrl}/${id}`, {likes: newLikeCount}, config);
    return response.data;
}

const deleteById = async (id) => {
    const config = {
        headers: {Authorization: token}
    };
    const response = await axios.delete(`${baseUrl}/${id}`, config);
    return response.data;
}

export default {setToken, getAll, addNew, updateLikes, deleteById};