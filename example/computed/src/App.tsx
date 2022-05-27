import { defineStore, useSnapshot } from 'binia'
const storeA = defineStore({
  state: { h: 'hello', w: 'world' },
  computed: {
    hw() {
      return this.h + ' ' + this.w
    },
  },
})
const store = defineStore({
  state: { count: 1 },
  computed: {
    doubled() {
      return this.count * 2
    },
    quadrupled: {
      get() {
        return this.doubled * 2
      },
      set(v: number) {
        this.count = v >> 2
      },
    },
  },
  derive: {
    helloCount(get) {
      return 'hello: ' + get(this).count + get(storeA).hw
    },
    helloDouble(get) {
      return 'hello: ' + get(this as any).doubled + get(storeA).hw
    },
  },
})

function A() {
  console.log('A')
  const { helloCount } = useSnapshot(store)
  return (
    <div>
      <h2>helloCount:{helloCount}</h2>
    </div>
  )
}
function B() {
  console.log('B')
  const { count, doubled, quadrupled } = useSnapshot(store)
  return (
    <div>
      <h2>count:{count}</h2>
      <h2>doubled:{doubled}</h2>
      <h2>quadrupled:{quadrupled}</h2>
    </div>
  )
}
function C() {
  console.log('C')
  const { helloDouble } = useSnapshot(store)
  return (
    <div>
      <h2>helloDouble:{helloDouble}</h2>
    </div>
  )
}
function D() {
  console.log('D')
  const { helloCount } = useSnapshot(store)
  return (
    <div>
      <h2>helloCount:{helloCount}</h2>
    </div>
  )
}

function App() {
  return (
    <div>
      <A></A>
      <B></B>
      <C></C>
      <D></D>
      <button onClick={() => store.count++}>inc count</button>
      <button onClick={() => store.quadrupled--}>dec quadrupled</button>
      <button onClick={() => (storeA.w = 'world ' + store.doubled)}>
        world
      </button>
    </div>
  )
}
export default App
