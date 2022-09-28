# Working with Redux
As I am now about to start work on the exercises at the end of part 7, where I am tasked with refactoring this blogs application to use redux, rather than React's useState, I thought it would be a good idea to write some notes about redux. Also helps me make a bit of a plan for the transition.

Redux separates the use and management of state from the presentational function of components. Individual components no longer need to bother with managing their individual state, all state is managed in one central Redux store, which all components have access to (at least when using react-redux library also). The store can then be modified by the components through dispatching actions to the store.

### The libraries for working with redux:
<br>

#### 1. `npm install redux`

- This is the core/basic redux library. It provides functions such as createStore. But mostly, the other libraries below are used to work with the redux store, not the core redux library itself.
- Minimal example of what the library provides us:

```
import { createStore } from 'redux'

const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    case 'ZERO':
      return 0
    default:
      return state
  }
}

const store = createStore(counterReducer)

<button  onClick={e => store.dispatch({ type: 'INCREMENT' })}>
 plus
</button>
```
<br>

#### 2. `npm install react-redux`

- As I mentioned before, one difference between using Redux and React's built-in useState is that the Redux store is centralized (contains all state) and can be accessed and modified (via actions) from any component. React Redux makes it easier to share state between components. Without it, we would have to import the store to every component, and then use the store's methods (`dispatch`, `getState`). React Redux provides us with `useSelector` and `useDispatch` hooks, which we can use to access what's in the store (useSelector, which additionally enables us to filter the content of the store right away) and also to dispatch actions to the store (surprisingly useDispatch). In order to be able to make use of these hooks, we have to wrap our app in the `<Provider>` component from React Redux.
- Minimal example of what the library provides us:

*index.js*

```
import { Provider } from 'react-redux'
...

<Provider>
  <App store={store}>
</Provider>
```
any component in different file
```
import { useSelector, useDispatch } from "react-redux";

const anecdotes = useSelector(state => state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase())));
    
const dispatch = useDispatch();
```  
<br>

#### 3. `npm install @reduxjs/toolkit`

- This library helps us reduce the amount of boilerplate code used, for example in defining reducers and the store itself. The two most important functions are probably `configureStore` and `createSlice`. The former makes it easier to, surprisingly, configure the Redux store. Its main benefit is when we have multiple reducerrs, we don't need to use the `combineReducers` function in order to create the store. The latter provides a more compact way of defining reducers.
- Minimal example of what the library provides us:

*index.js*
```
import { configureStore } from '@reduxjs/toolkit'
...
// no need to call combineReducers first
const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer
  }
})
...
```
*someReducer.js*
```
import { createSlice } from '@reduxjs/toolkit'

const initialState = [
  {
    content: 'reducer defines how redux store works',
    important: true,
    id: 1,
  }
]

const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    createNote(state, action) {
      const content = action.payload
      // redux toolkit also allows us to mutate state directly in our code,
      // and will convert that to create a new immutable object and set state to that
      state.push({
        content,
        important: false,
        id: generateId(),
      })
    },
    toggleImportanceOf(state, action) {
      const id = action.payload
      const noteToChange = state.find(n => n.id === id)
      const changedNote = { 
        ...noteToChange, 
        important: !noteToChange.important 
      }
      return state.map(note =>
        note.id !== id ? note : changedNote 
      )     
    }
  },
})

export const { createNote, toggleImportanceOf } = noteSlice.actions
export default noteSlice.reducer
```
We can then use the reducer like so in another file:
```
import { createNote } from "./someReducer.js";
import { useDispatch } from "react-redux";

const dispatch = useDispatch();

const someHandler = () => {
  dispatch(createNote("Hello, world"));
  // the above call will be equivalent to: 
  // dispatch({ type: 'notes/createNote', payload: 'Redux Toolkit is awesome!' })
  // the createNote handler in the reducer can then access note via action.payload


}
```
</br>

#### 4. `npm install redux-thunk`
- Thunks are functions which are returned by functions. Redux Thunk allows us to write action creators which return functions, rather than objects.
- This is useful, because it enables us to implement asynchronous action creators, which wait for the completion of an asynchronous operation, and after that dispatch some action which changes the store's state.
- This is useful if our actions/changes in state require us to communicate with the backend (which they typically do, if we're changing state locally, we usually also want that change to be stored to the backend). It allows us to completely separate React components from implementation of state change and backend communication.
- When using the `configureStore` function from Reduxjs Toolkit, we don't need any extra configuration to set up our store to work with thunk.
- Example:

*someReducer.js*
```
const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    createNote(state, action) {
      const content = action.payload

      state.push({
        content,
        important: false,
        id: generateId(),
      })
    },
    toggleImportanceOf(state, action) {
      const id = action.payload

      const noteToChange = state.find(n => n.id === id)

      const changedNote = { 
        ...noteToChange, 
        important: !noteToChange.important 
      }

      return state.map(note =>
        note.id !== id ? note : changedNote 
      )     
    },
    appendNote(state, action) {
      state.push(action.payload)
    },
    setNotes(state, action) {
      return action.payload
    }
  },
})

export const { createNote, toggleImportanceOf, appendNote, setNotes } = noteSlice.actions

export const initializeNotes = () => {
  return async dispatch => {
    const notes = await noteService.getAll()
    dispatch(setNotes(notes))
  }
}

export default noteSlice.reducer
```
some component in another file:
```
const addNote = (event) => {
  event.preventDefault()
  const content = event.target.note.value
  event.target.note.value = ''
  dispatch(createNote(content))
}
```
The component in the example above doesn't know or care how our state management and backend communication is implemented. All it needs to do is dispatch an action, and those things are taken care of somewhere else. This is great separation of concerns.