import { useState, useContext, createContext } from "react";
import "./App.css";
import { connect, store, Context } from "../../src";

function App() {
  return (
    <Context.Provider value={store}>
      <A />
      <B />
      <C />
    </Context.Provider>
  );
}
const A = () => {
  console.log("A");
  return (
    <div>
      A: <User />
    </div>
  );
};
const B = () => {
  console.log("B");
  return (
    <div>
      B: <UserEditor />
    </div>
  );
};
const C = () => {
  console.log("C", Math.random());
  return <div>C</div>;
};
const User = connect(({ dispatch, state }) => {
  console.log("User", Math.random());
  return <div>name:{state.user.name}</div>;
});
const UserEditor = connect(({ dispatch, state }) => {
  console.log("UserEditor", Math.random());
  return (
    <>
      <input
        value={state.user.name}
        onChange={(e) => {
          dispatch({ type: "updateUser", payload: { name: e.target.value } });
        }}
      ></input>
    </>
  );
});
export default App;
