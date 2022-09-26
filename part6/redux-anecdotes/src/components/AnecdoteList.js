import { useSelector, useDispatch } from "react-redux";
import { vote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
    const anecdotes = useSelector(state => 
        state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase())));
    
        const dispatch = useDispatch();

    const voteBtnHandler = (id, voteCount, anecdoteContent) => () => {
        console.log(`voteBtnHandler called with ${id} and ${anecdoteContent}`);
        dispatch(vote(id, voteCount + 1));
        dispatch(setNotification(`You voted for '${anecdoteContent}'`, 5));
    }

    return (
        <>
        {anecdotes.map(anecdote => 
            <div key={anecdote.id}>
                <div>
                    {anecdote.content}
                </div>
                <div>
                    has {anecdote.votes}
                    <button onClick={voteBtnHandler(anecdote.id, anecdote.votes, anecdote.content)}>
                        vote
                    </button>
                </div>
            </div>
            )}
        </>
    )
}

export default AnecdoteList;