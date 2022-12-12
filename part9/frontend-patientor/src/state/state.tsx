import React, { createContext, useContext, useReducer } from "react";
import { Patient, Gender } from "../types";

import { Action } from "./reducer";

export type State = {
  patients: { [id: string]: Patient };
};

const initialState: State = {
  patients: {
    "d2773336-f723-11e9-8f0b-362b9e155667":
    {
      id: "d2773336-f723-11e9-8f0b-362b9e155667",
      name: "John McClane",
      dateOfBirth: "1986-07-09",
      gender: Gender.Male,
      occupation: "Fucking your mom"
    }
  }
};

export const StateContext = createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => initialState
]);

type StateProviderProps = {
  reducer: React.Reducer<State, Action>;
  children: React.ReactElement;
};

export const StateProvider = ({
  reducer,
  children
}: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};
export const useStateValue = () => useContext(StateContext);
