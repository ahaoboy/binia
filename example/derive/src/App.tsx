import { defineStore, derive, useSnapshot } from 'binia'
const storeA = defineStore({ state: { a: 1 } })
const storeB = defineStore({ state: { b: 1 } })
const storeC = defineStore({ state: { c: 1 } })

const storeD = derive({
  ab(get) {
    return get(storeA).a + '--' + get(storeB).b + '--' + storeC.c
  },
})

function A() {
  console.log('A')
  const { ab } = useSnapshot(storeD)
  return (
    <div>
      <h2>ab:{ab}</h2>
    </div>
  )
}

function App() {
  return (
    <div>
      <A></A>
      <button onClick={() => storeA.a++}>inc a</button>
      <button onClick={() => storeB.b++}>inc b</button>
      <button onClick={() => storeC.c++}>inc c</button>
    </div>
  )
}
export default App
