import { proxy, subscribe } from "../../src";

export const store = proxy({
  counter: {
    a: { b: 1 },
    b: 1,
  },
});

export const incA = () => {
  store.counter.a.b = Promise.resolve(1);
};
export const incB = () => {
  store.counter.b++;
};
export const incAB = () => {
  store.counter.a.b++;
  store.counter.b++;
};
subscribe(store, (op) => {
  console.log("op", op);
});
