import { store, incA, incB, incAB } from "./store";
import { useSnapshot } from "../../src";

function A() {
  console.log("A");
  const {
    counter: { a },
  } = useSnapshot(store);
  return <h1>A:{a}</h1>;
}
function B() {
  console.log("B");
  const {
    counter: { b },
  } = useSnapshot(store);
  return <h1>A:{b}</h1>;
}
function C() {
  console.log("C");
  return (
    <>
      <button onClick={incA}>incA</button>
      <button onClick={incB}>incB</button>
      <button onClick={incAB}>incAB</button>
    </>
  );
}

function App() {
  console.log("app");
  return (
    <>
      <A />
      <B />
      <C />
    </>
  );
}

export default App;
