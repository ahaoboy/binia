import type { ComponentType } from 'react'
import React, {
  useCallback,
  useDebugValue,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import {
  affectedToPathList,
  createProxy as createProxyToCompare,
  isChanged,
} from 'proxy-compare'
import * as useSyncExternalStoreExports from 'use-sync-external-store/shim'
import type { Snapshot } from './type'
import { snapshot, subscribe } from './vanilla'

const { useSyncExternalStore } = useSyncExternalStoreExports
const useAffectedDebugValue = (
  state: object,
  affected: WeakMap<object, unknown>
) => {
  const pathList = useRef<(string | number | symbol)[][]>()
  useEffect(() => {
    pathList.current = affectedToPathList(state, affected)
  })
  useDebugValue(pathList.current)
}

type Options = {
  sync?: boolean
}

/**
 * useSnapshot
 *
 * Create a local snapshot that catches changes. This hook actually returns a wrapped snapshot in a proxy for
 * render optimization instead of a plain object compared to `snapshot()` method.
 * Rule of thumb: read from snapshots, mutate the source.
 * The component will only re-render when the parts of the state you access have changed, it is render-optimized.
 *
 * @example A
 * function Counter() {
 *   const snap = useSnapshot(state)
 *   return (
 *     <div>
 *       {snap.count}
 *       <button onClick={() => ++state.count}>+1</button>
 *     </div>
 *   )
 * }
 *
 * [Notes]
 * Every object inside your proxy also becomes a proxy (if you don't use "ref"), so you can also use them to create
 * the local snapshot as seen on example B.
 *
 * @example B
 * function ProfileName() {
 *   const snap = useSnapshot(state.profile)
 *   return (
 *     <div>
 *       {snap.name}
 *     </div>
 *   )
 * }
 *
 * Beware that you still can replace the child proxy with something else so it will break your snapshot. You can see
 * above what happens with the original proxy when you replace the child proxy.
 *
 * > console.log(state)
 * { profile: { name: "binia" } }
 * > childState = state.profile
 * > console.log(childState)
 * { name: "binia" }
 * > state.profile.name = "react"
 * > console.log(childState)
 * { name: "react" }
 * > state.profile = { name: "new name" }
 * > console.log(childState)
 * { name: "react" }
 * > console.log(state)
 * { profile: { name: "new name" } }
 *
 * `useSnapshot()` depends on the original reference of the child proxy so if you replace it with a new one, the component
 * that is subscribed to the old proxy won't receive new updates because it is still subscribed to the old one.
 *
 * In this case we recommend the example C or D. On both examples you don't need to worry with re-render,
 * because it is render-optimized.
 *
 * @example C
 * const snap = useSnapshot(state)
 * return (
 *   <div>
 *     {snap.profile.name}
 *   </div>
 * )
 *
 * @example D
 * const { profile } = useSnapshot(state)
 * return (
 *   <div>
 *     {profile.name}
 *   </div>
 * )
 */
export function useSnapshot<T extends object>(
  proxyObject: T,
  options?: Options
): Snapshot<T> {
  const notifyInSync = options?.sync
  const lastSnapshot = useRef<Snapshot<T>>()
  const lastAffected = useRef<WeakMap<object, unknown>>()
  let inRender = true
  const currSnapshot = useSyncExternalStore(
    useCallback(
      (callback) => {
        const unsub = subscribe(proxyObject, callback, notifyInSync)
        callback() // Note: do we really need this?
        return unsub
      },
      [proxyObject, notifyInSync]
    ),
    () => {
      const nextSnapshot = snapshot(proxyObject)
      try {
        if (
          !inRender &&
          lastSnapshot.current &&
          lastAffected.current &&
          !isChanged(
            lastSnapshot.current,
            nextSnapshot,
            lastAffected.current,
            new WeakMap()
          )
        ) {
          // not changed
          return lastSnapshot.current
        }
      } catch (e) {
        // ignore if a promise or something is thrown
      }
      return nextSnapshot
    },
    () => snapshot(proxyObject)
  )
  inRender = false
  const currAffected = new WeakMap()
  useEffect(() => {
    lastSnapshot.current = currSnapshot
    lastAffected.current = currAffected
  })
  if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAffectedDebugValue(currSnapshot, currAffected)
  }
  const proxyCache = useMemo(() => new WeakMap(), []) // per-hook proxyCache
  return createProxyToCompare(currSnapshot, currAffected, proxyCache)
}

function withProxy<
  Store extends object,
  P extends object,
  S extends object,
  A extends object
>(
  store: Store,
  C: ComponentType<P>,
  mapState?: (snap: Snapshot<Store>, props: Omit<P, keyof (S & A)>) => S,
  mapActions?: (store: Store, props: Omit<P, keyof (S & A)>) => A
) {
  return function WrappedComponent(props: Omit<P, keyof (S & A)>) {
    const snap = useSnapshot(store)
    const state = mapState?.(snap, props) ?? {}
    const actions = mapActions?.(store, props) ?? {}
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // redux-react also ignore this type
    return <C {...props} {...state} {...actions} />
  }
}
export function connect<
  Store extends object,
  S extends object = {},
  A extends object = {}
>(
  store: Store,
  mapState?: (snap: Snapshot<Store>, props?: any) => S,
  mapActions?: (store: Store, props?: any) => A
) {
  return <P extends object>(C: ComponentType<P>) =>
    withProxy(store, C, mapState, mapActions)
}
