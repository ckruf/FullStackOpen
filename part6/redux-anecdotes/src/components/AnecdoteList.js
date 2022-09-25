import { useSelector, useDispatch } from "react-redux";
import { vote } from "../reducers/anecdoteReducer";
import { showNotification, clearNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state.anecdotes);
    const dispatch = useDispatch();

    const voteBtnHandler = (id, anecdoteContent) => () => {
        console.log(`voteBtnHandler called with ${id} and ${anecdoteContent}`);
        dispatch(vote(id));
        dispatch(showNotification(`You voted for '${anecdoteContent}'`));
        setTimeout(() => {
            dispatch(clearNotification());
        }, 5000)
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
                    <button onClick={voteBtnHandler(anecdote.id, anecdote.content)}>
                        vote
                    </button>
                </div>
            </div>
            )}
        </>
    )
}

export default AnecdoteList;