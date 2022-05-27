import React from 'react'
import { connect, defineStore } from 'binia'
import type { Snapshot } from 'binia'
const store = defineStore({
  state: { count: 1, repeat: 1 },
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
const inc = () => {
  store.count++
}
type Store = typeof store
type Snap = Snapshot<Store>
const mapState = (snap: Snap) => {
  return {
    c: snap.count,
    d: snap.quadrupled,
  }
}
type MapState = ReturnType<typeof mapState>
type MapActions = ReturnType<typeof mapActions>
type Props = { name: string }

const mapActions = (store: Store) => {
  return {
    inc,
    dec: () => {
      store.count--
    },
  }
}

class A extends React.Component<MapActions & MapState & Props> {
  render() {
    return (
      <div>
        <h2>c:{this.props.c}</h2>
        <h2>d:{this.props.d}</h2>
        <button onClick={this.props.inc}>inc</button>
        <button onClick={this.props.dec}>dec</button>
      </div>
    )
  }
}

const C = connect(store, mapState, mapActions)(A)
function App() {
  return (
    <div>
      <C name={''}></C>
      <button onClick={() => store.count++}>inc count</button>
      <button onClick={() => store.quadrupled--}>dec quadrupled</button>
      <button onClick={() => store.repeat++}> repeat</button>
    </div>
  )
}
export default App
