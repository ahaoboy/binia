import { proxy, useSnapshot, proxyWithComputed ,derive} from "../../src";
// create a base proxy
const state = proxy({
  count: 1,
})

// create a derived proxy
const derived = derive({
  doubled: (get) => get(state).count * 2,
})

// alternatively, attach derived properties to an existing proxy
derive({
  tripled: (get) => get(state).count * 3,
}, {
  proxy: state,
})


const storeA = proxy({ a: 1 });
const storeB =  
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
