import { useSnapshot, defineStore } from "../../dist";
const storeA = defineStore({ state: { w: "world" } });
const store = defineStore({
  state: { count: 1 },
  computed: {
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
  },
  derive: {
    hello(get) {
      return "hello" + get(storeA).w;
    },
  },
});

function App() {
  const { count, doubled, quadrupled, hello } = useSnapshot(store);
  return (
    <div>
      <h2>hello:{hello}</h2>
      <h2>count:{count}</h2>
      <h2>doubled:{doubled}</h2>
      <h2>quadrupled:{quadrupled}</h2>
      <button onClick={() => store.count++}>inc count</button>
      <button onClick={() => store.quadrupled--}>dec quadrupled</button>
      <button onClick={() => (storeA.w = "world " + count)}>world</button>
    </div>
  );
}
export default App;
