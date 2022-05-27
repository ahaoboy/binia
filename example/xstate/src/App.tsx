import { defineStore, useSnapshot } from 'binia'
import { createMachine, interpret } from 'xstate'

export const store = defineStore({
  state: {
    a: 0,
    b: 0,
  },
})
export interface ToggleContext {
  a: number
  b: number
}

export const toggleMachine = createMachine<ToggleContext>({
  id: 'toggle',
  initial: 'inactive',
  context: store,
  states: {
    inactive: {
      on: { TOGGLE: 'active' },
      entry: (ctx) => {
        ctx.b++
      },
    },
    active: {
      entry: (ctx) => {
        ctx.a++
      },
      on: { TOGGLE: 'inactive' },
    },
  },
})
const service = interpret(toggleMachine)
service.onTransition((state) => {
  console.log('onTransition', state, state.value)
})
service.start()

function A() {
  console.log('A')
  const { a } = useSnapshot(store)
  return <h1>a:{a}</h1>
}
function B() {
  console.log('B')
  const { b } = useSnapshot(store)
  return <h1>b:{b}</h1>
}
function App() {
  console.log('app')
  return (
    <>
      <A></A>
      <B></B>
      <button
        onClick={() => {
          service.send('TOGGLE')
        }}>
        TOGGLE
      </button>
    </>
  )
}

export default App
