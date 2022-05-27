import React from 'react'
import { defineStore, useSnapshot } from 'binia'
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
// actions
const inc = () => store.count++
const dec = () => store.quadrupled--

function C() {
  console.log('C')
  const { count, doubled, quadrupled } = useSnapshot(store)
  return (
    <div>
      <h2>react version:{React.version}</h2>
      <h2>count:{count}</h2>
      <h2>doubled:{doubled}</h2>
      <h2>quadrupled:{quadrupled}</h2>
    </div>
  )
}

const state2 = defineStore({
  state: {
    firstName: 'Alec',
    lastName: 'Baldwin',
  },
  computed: {
    fullName: {
      get() {
        return this.firstName + ' ' + this.lastName
      },
      set(newValue: string) {
        ;[this.firstName, this.lastName] = newValue.split(' ')
      },
    },
  },
})

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
