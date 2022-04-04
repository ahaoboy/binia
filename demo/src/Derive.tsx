import { proxy, useSnapshot, proxyWithComputed ,derive} from "../../dist";

const p = proxy({ a: 1 });

console.log(
  Object.getPrototypeOf(p) === Array.prototype, // true
  Reflect.getPrototypeOf(p) === Array.prototype, // true
  p.__proto__ === Array.prototype, // true
  Array.prototype.isPrototypeOf(p), // true
  p instanceof Array // true
);

// create a base proxy
const storeA = proxy({
  count: 1,
})

// create a derived proxy
const storeB = derive({
  doubled: (get) => get(storeA).count * 2,
})


function App() {
  const { doubled } = useSnapshot(storeB);
  // const { a } = useSnapshot(storeA);
  return (
    <div>
      <h2>
        {/* a:{a} */}
        doubled:{doubled}
      </h2>
      <button onClick={() => storeA.count++}>incA</button>
    </div>
  );
}
export default App;
