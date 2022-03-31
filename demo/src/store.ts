import { proxy } from "../../src";

export const store = proxy({
  counter: {
    a: 0,
    b: 1,
  },
});

export const incA = () => {
  store.counter.a++;
};
export const incB = () => {
  store.counter.b++;
};
export const incAB = () => {
  store.counter.a++;
  store.counter.b++;
};
