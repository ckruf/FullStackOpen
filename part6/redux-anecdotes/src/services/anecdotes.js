import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
};

const postAnecdote = async (anecdoteContent) => {
    let newAnecdote = {
        content: anecdoteContent,
        votes: 0
    }
    const response = await axios.post(baseUrl, newAnecdote);
    return response.data;
}

const voteAnecdote = async (id, newVoteCount) => {
    let update = {
        votes: newVoteCount
    }
    const response = await axios.patch(`${baseUrl}/${id}`, update);
    return response.data;
}

// eslint-disable-next-line
export default { getAll, postAnecdote, voteAnecdote };