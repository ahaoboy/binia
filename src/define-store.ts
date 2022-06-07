import { derive as proxyWithDerive } from './utils/derive'
import { proxyWithComputed } from './utils/proxyWithComputed'
import type { Snapshot } from './vanilla'

type State = Record<string, any>
type GetFn = <T>(s: T) => Snapshot<T>
type GetCompleted<C> = {
  [k in keyof C]: C[k] extends (...args: any[]) => infer R
    ? R
    : C[k] extends { get: (...args: any[]) => infer R }
    ? R
    : never
}

type GetDerive<C> = {
  [k in keyof C]: C[k] extends (...args: any[]) => infer R ? R : never
}

type Options = {
  sync: boolean
  computedCacheSize: number
}
type Model<S, C, D, P = S & GetCompleted<C>> = {
  state: S
  computed?: C & ThisType<P>
  derive?: D & ThisType<S>
  options?: Partial<Options>
}

type DefDerive = Record<string, (get: GetFn) => unknown>
export function defineStore<
  S extends State,
  C = {},
  D extends DefDerive = DefDerive
>(
  model: Model<S, C, D>
): S & GetCompleted<C> & (DefDerive extends D ? {} : Snapshot<GetDerive<D>>) {
  const { state = {}, computed = {}, derive = {}, options = {} } = model
  const p = proxyWithComputed(state, computed, {
    size: options.computedCacheSize ?? 2,
  })
  const d = proxyWithDerive(derive, { proxy: p, sync: !!options?.sync })
  return d as any
}
