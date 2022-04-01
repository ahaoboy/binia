import { useSnapshot, defineStore } from "../../src";

const store = defineStore(
  { count: 1 },
  {
    doubled() {
      return this.count * 2;
    },
    quadrupled: {
      get() {
        return this.doubled * 2;
      },
      set(v: number) {
        console.log("v", v);
        this.count = v >> 2;
      },
    },
  }
);

function App() {
  const { count, doubled, quadrupled } = useSnapshot(store);
  return (
    <div>
      <h2>count:{count}</h2>
      <h2>doubled:{doubled}</h2>
      <h2>quadrupled:{quadrupled}</h2>
      <button onClick={() => store.count++}>inc count</button>
      <button onClick={() => store.quadrupled--}>dec quadrupled</button>
    </div>
  );
}
export default App;
