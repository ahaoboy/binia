import { defineStore, useSnapshot } from 'binia'
const work = (n: number) => {
  const now = +new Date()
  while (+new Date() - now < 1000);
  return n
}
const store = defineStore({
  state: { count: 0, cache: [0] },
  computed: {
    ans() {
      return work(this.count)
    },
  },
  options: {
    computedCacheSize: 5,
  },
})
const pushCache = (n: number) => {
  if (store.cache.includes(n)) return
  store.cache.push(n)
  if (store.cache.length > 5) store.cache.shift()
}
const inc = () => {
  store.count++
  pushCache(store.count)
}
const dec = () => {
  store.count--
  pushCache(store.count)
}

function A() {
  console.log('A')
  const { ans, cache } = useSnapshot(store)
  return (
    <div>
      <h2>cache:[{cache.toString()}]</h2>
      <h2>ans:{ans}</h2>
    </div>
  )
}

function App() {
  return (
    <div>
      <A></A>
      <button onClick={inc}>inc count</button>
      <button onClick={dec}>dec count</button>
    </div>
  )
}
export default App
