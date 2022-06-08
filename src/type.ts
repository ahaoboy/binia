export type AsRef = { $$biniaRef: true }

export type AnyFunction = (...args: any[]) => any
export type Snapshot<T> = T extends AnyFunction
  ? T
  : T extends AsRef
  ? T
  : T extends Promise<infer V>
  ? Snapshot<V>
  : {
      readonly [K in keyof T]: Snapshot<T[K]>
    }
export type SnapshotComputed<T> = T extends AnyFunction
  ? T
  : T extends AsRef
  ? T
  : T extends Promise<infer V>
  ? Snapshot<V>
  : {
      [K in keyof T]: Snapshot<T[K]>
    }
