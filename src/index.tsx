export * from "./react";
export * from "./vanilla";
import { proxyWithComputed } from "./utils/proxyWithComputed";
import { derive as proxyWithDerive } from "./utils/derive";
export * from "./utils/derive";

type Fn = (...args: any[]) => any;
type State = Record<string, any>;
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
>(model: M<S, C, D>): S & GetCompleted<C> & GetDerive<D> {
  const { state = {}, computed = {}, derive = {}, options = {} } = model;
  const p = proxyWithComputed(state, computed);
  const d = proxyWithDerive(derive, { proxy: p, sync: options?.sync });
  return d as any;
}
