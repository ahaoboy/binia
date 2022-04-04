import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './Cmp4'
// import { proxy, subscribe } from "../../src";

// const s = proxy({a:[]});
// const p = s.a
// console.log('1',Object.isExtensible(p)); // "called"

// console.log(
//   Object.getPrototypeOf(p) === Array.prototype, // true
//   Reflect.getPrototypeOf(p) === Array.prototype, // true
//   p.__proto__ === Array.prototype, // true
//   Array.prototype.isPrototypeOf(p), // true
//   p instanceof Array // true
// );

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
