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
        this.count = v >> 2;
      },
    },
  },
  derive: {
    hello(get) {
      // work but type is error
      console.log("doubled", (this as any).doubled);
      return "hello" + get(storeA).w ;
    },
  },
});
function A() {
  console.log("A");
  const { hello } = useSnapshot(store);
  return (
    <div>
      <h2>hello:{hello}</h2>
    </div>
  );
}
function B() {
  console.log("B");
  const { count, doubled, quadrupled } = useSnapshot(store);
  return (
    <div>
      <h2>count:{count}</h2>
      <h2>doubled:{doubled}</h2>
      <h2>quadrupled:{quadrupled}</h2>
    </div>
  );
}
function App() {
  return (
    <div>
      <A></A>
      <B></B>
      <button onClick={() => store.count++}>inc count</button>
      <button onClick={() => store.quadrupled--}>dec quadrupled</button>
      <button onClick={() => (storeA.w = "world " + store.doubled)}>
        world
      </button>
    </div>
  );
}
export default App;
