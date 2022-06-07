import React from 'react'
import { connect, defineStore } from 'binia'
import type { Snapshot } from 'binia'
const store = defineStore({
  state: { count: 1 },
  computed: {
    doubled() {
      return this.count * 2
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
type Attrs = { name: string }
type Props = MapActions & MapState & Attrs

const mapActions = () => {
  return {
    inc,
    dec: () => {
      store.count--
    },
  }
}

const countConnect = connect(store, mapState, mapActions)

class A extends React.Component<Props> {
  render() {
    return (
      <div>
        <h3>name: {this.props.name}</h3>
        <h3>c:{this.props.c}</h3>
        <button onClick={this.props.inc}>inc</button>
        <button onClick={this.props.dec}>dec</button>
      </div>
    )
  }
}

function B(props: Props) {
  return (
    <div>
      <h3>name: {props.name}</h3>
      <h3>c:{props.c}</h3>
      <button onClick={props.inc}>inc</button>
      <button onClick={props.dec}>dec</button>
    </div>
  )
}

const C = countConnect(A)
const D = countConnect(B)
const E = countConnect((props: Props) => {
  return (
    <div>
      <h3>name: {props.name}</h3>
      <h3>c:{props.c}</h3>
      <button onClick={props.inc}>inc</button>
      <button onClick={props.dec}>dec</button>
    </div>
  )
})
const F = countConnect(
  class extends React.Component<Props> {
    render() {
      return (
        <div>
          <h3>name: {this.props.name}</h3>
          <h3>c:{this.props.c}</h3>
          <button onClick={this.props.inc}>inc</button>
          <button onClick={this.props.dec}>dec</button>
        </div>
      )
    }
  }
)
function App() {
  return (
    <div>
      <C name={'C'}></C>
      <D name={'B'}></D>
      <E name={'E'}></E>
      <F name={'F'}></F>
    </div>
  )
}
export default App
