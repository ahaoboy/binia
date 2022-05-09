import { defineStore, devtools, useSnapshot } from '../../dist'

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

devtools(store, { name: 'demo', enabled: true })

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
      <button onClick={() => store.count++}>inc count</button>
      <button onClick={() => store.quadrupled--}>dec count</button>
    </div>
  )
}
export default App
