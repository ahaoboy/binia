import { useState } from "react";
import { useSyncExternalStore } from 'use-sync-external-store/shim'

const store = {
  currentState: { data: 0 },
  listeners: [],
  reducer(action) {
    switch (action.type) {
      case "ADD":
        return { data: store.currentState.data + 1 };
      default:
        return store.state;
    }
  },
  subscribe(l) {
    store.listeners.push(l);
  },
  getSnapshot() {
    return store.currentState;
  },
  dispatch(action) {
    store.currentState = store.reducer(action);
    store.listeners.forEach((l) => l());
    return action;
  },
};

function App() {
  const state = useSyncExternalStore(
    store.subscribe,
    () => store.getSnapshot().data
  );

  return (
    <div className="p-100">
      <div>count:{state}</div>
      <div>
        <button onClick={() => store.dispatch({ type: "ADD" })}>add+</button>
      </div>
    </div>
  );
}

export default App;
