export * from "./react";
export * from "./vanilla";
import { proxyWithComputed } from "./utils/proxyWithComputed";
import { derive as proxyWithDerive } from "./utils/derive";

type Fn = (...args: any[]) => any;
type State = Record<string, any>;
type Computed = Record<string, (() => any) | { get: () => any; set?: Fn }>;
type GetFn = <T>(s: T) => T;
type GetCompleted<C> = {
  [k in keyof C]: C[k] extends (...args: any[]) => infer R
    ? R
    : C[k] extends { get: (...args: any[]) => infer R }
    ? R
    : C[k];
};

type GetDerive<C> = {
  [k in keyof C]: C[k] extends (...args: any[]) => infer R ? R : C[k];
};

type DerFn = <T>(p: T) => T;

type Options = {
  sync: boolean;
};
type M<S, C, D, P = S & GetCompleted<C>> = {
  state: S;
  computed?: C & ThisType<P>;
  derive?: D & ThisType<S>;
  options?: Partial<Options>;
};

export function defineStore<
  S extends State,
  C,
  D extends Record<string, (get: GetFn) => any>
>(
  model: M<S, C, D>
): { s: S; cm: C; de: D } & S & GetCompleted<C> & GetDerive<D> {
  const { state = {}, computed = {}, derive = {}, options = {} } = model;
  const p = proxyWithComputed(state, computed);

  const d = proxyWithDerive(derive, { proxy: p, sync: options?.sync });

  return d as any;
}

// const storeA = defineStore({
//   state: { msg: "a" },
//   computed: {
//     hello() {
//       return "hello " + this.msg;
//     },
//   },
// });
// storeA.msg;
// storeA.hello;

// const state: { c: number } = { c: 1 };
// const store = defineStore({
//   state,
//   computed: {
//     d() {
//       return this.c * 2;
//     },
//     q: {
//       get() {
//         return this.c * 2;
//       },
//       set(n: number) {
//         this.c = n >> 2;
//       },
//     },
//   },
//   derive: {
//     e(get) {
//       return get(storeA).hello + this.c ;
//     },
//   },
// });

// store.q;
// store.c;
// store.cm;
// store.d;
// store.de;
// store.s;
// store.e;
