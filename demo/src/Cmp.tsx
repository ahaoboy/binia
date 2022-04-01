import { proxy, useSnapshot, proxyWithComputed, defineStore } from "../../src";

const storeA = proxy({ a: 1 });
const storeB = defineStore(
  { b: 1, a: storeA.a },
  {
    c() {
      return this.a + this.b;
    },
  }
);
function App() {
  const { c } = useSnapshot(storeB);
  // const { a } = useSnapshot(storeA);
  return (
    <div>
      <h2>
        {/* a:{a} */}
        c:{c}
      </h2>
      {/* don't render */}
      <button onClick={() => storeA.a++}>incA</button>
      {/* render */}
      <button onClick={() => storeB.b++}>incB</button>
    </div>
  );
}
export default App;
