import memoize from '../proxy-memoize'
import { proxy, snapshot } from '../vanilla'

/**
 * proxyWithComputed
 *
 * This is to create a proxy with initial object and additional object,
 * which specifies getters for computed values with dependency tracking.
 * It also accepts optional setters for computed values.
 *
 * [Notes]
 * This comes with a cost and overlaps with useSnapshot.
 * Do not try to optimize too early. It can worsen the performance.
 * Measurement and comparison will be very important.
 *
 * @example
 * import { proxyWithComputed } from 'binia'
 * const state = proxyWithComputed({
 *   count: 1,
 * }, {
 *   doubled: snap => snap.count * 2, // getter only
 *   tripled: {
 *     get: snap => snap.count * 3,
 *     set: (state, newValue) => { state.count = newValue / 3 }
 *   }, // with optional setter
 * })
 */
export function proxyWithComputed<T extends object, U extends object>(
  initialObject: T,
  computedFns: {
    [K in keyof U]:
      | (() => U[K])
      | {
          get: () => U[K]
          set?: (newValue: U[K]) => void
        }
  },
  options?: { size: number }
) {
  ;(Object.keys(computedFns) as (keyof U)[]).forEach((key) => {
    if (Object.getOwnPropertyDescriptor(initialObject, key)) {
      throw new Error('object property already defined')
    }
    const computedFn = computedFns[key]
    const { get, set } = (
      typeof computedFn === 'function' ? { get: computedFn } : computedFn
    ) as {
      get: () => U[typeof key]
      set?: (newValue: U[typeof key]) => void
    }
    const desc: PropertyDescriptor = {}
    const memoizedGet = memoize(get, { size: options?.size ?? 2 })
    desc.get = () => memoizedGet(snapshot(proxyObject))

    if (set) {
      desc.set = (newValue) => set.call(proxyObject, newValue)
    }
    Object.defineProperty(initialObject, key, desc)
  })
  const proxyObject = proxy(initialObject) as T & U
  return proxyObject
}
