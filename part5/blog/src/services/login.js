import axios from "axios";

const baseUrl = "http://localhost:3003/api/login";

const requestLogin = async (userCredentials) => {
    const response = await axios.post(baseUrl, userCredentials);
    return response.data;
};

export default requestLogin;