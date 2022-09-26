import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    addVote(state, action) {
      const id = action.payload;
      return state
      .map(anecdote => {
        if (anecdote.id === id) {
          return { ...anecdote, votes: anecdote.votes + 1 };
        }
        return anecdote;
      })
      .sort((a, b) => b.votes - a.votes);
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      const anecdotes = action.payload;
      return anecdotes.sort((a, b) => b.votes - a.votes);
    }
  }
})

export const { addVote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions; 

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  }
};

export const createAnecdote = anecdoteContent => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.postAnecdote(anecdoteContent);
    dispatch(appendAnecdote(newAnecdote));
  }
};

export const vote = (id, newVoteCount) => {
  return async dispatch => {
    const _ = await anecdoteService.voteAnecdote(id, newVoteCount);
    dispatch(addVote(id));
  }
}

export default anecdoteSlice.reducer;