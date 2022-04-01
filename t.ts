import { createProxy } from "proxy-compare";

const s = { a: 1 };

const w = new WeakMap();
const p1 = createProxy(s, w);
const p2 = createProxy(s, w);
console.log(p1 === p2);
