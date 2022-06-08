import { defineStore, devtools, useSnapshot } from 'binia'

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
})

devtools(store, { name: 'binia-dev', enabled: true })

// actions
const inc = () => store.count++
const dec = () => store.quadrupled--

function C() {
  console.log('C')
  const { count, doubled, quadrupled } = useSnapshot(store)
  return (
    <div>
      <h2>count:{count}</h2>
      <h2>doubled:{doubled}</h2>
      <h2>quadrupled:{quadrupled}</h2>
    </div>
  )
}

function App() {
  return (
    <div>
      <C />
      <button onClick={inc}>inc count</button>
      <button onClick={dec}>dec count</button>
    </div>
  )
}
export default App
