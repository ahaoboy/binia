import React, { useContext, useEffect, useState, createContext } from "react";
type State = {
  user: {
    name: string;
    age: number;
  };
};
const defaultState = { user: { name: "joy", age: 18 } };
export const Context = createContext<{
  state: State;
  setState: (s: State) => void;
}>({} as any);
export const store = {
  state: defaultState,
  setState(s: State) {
    store.state = s;
    store.listeners.forEach((f) => f(s));
  },
  listeners: [] as Function[],
  subscribe(f: Function) {
    store.listeners.push(f);
    return () => {
      const i = store.listeners.indexOf(f);
      store.listeners.splice(i, 1);
    };
  },
};

const reducer = (
  state: State,
  { type, payload }: { type: string; payload: any }
) => {
  if (type === "updateUser") {
    return { ...state, user: { ...state.user, ...payload } };
  }
  return state;
};
export const connect = (C: any) => {
  return (props: any) => {
    const { state, setState } = useContext(Context);
    const [_, update] = useState({});

    useEffect(() => {
      store.subscribe(() => {
        update({});
      });
    });

    const dispatch = (action: { type: string; payload: any }) => {
      setState(reducer(state, action));
    };
    return <C {...props} dispatch={dispatch} state={state} />;
  };
};