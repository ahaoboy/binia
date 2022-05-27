import { defineStore, proxyMap, proxySet, useSnapshot } from 'binia'
const set = proxySet()
const map = proxyMap()
const store = defineStore({
  state: { set, map },
})
function S() {
  console.log('S')
  const { set } = useSnapshot(store)
  return (
    <div>
      <h2>set:{[...set].join('-')}</h2>
    </div>
  )
}

function M() {
  console.log('M')
  const { map } = useSnapshot(store)
  return (
    <div>
      <h2>map:{[...map.entries()].map(([k, v]) => `${k},${v}`).join('-')}</h2>
    </div>
  )
}
function App() {
  return (
    <div>
      <S />
      <M />
      <button onClick={() => store.set.add(store.set.size)}>set</button>
      <button onClick={() => store.map.set(store.map.size, store.map.size)}>
        map
      </button>
    </div>
  )
}
export default App
