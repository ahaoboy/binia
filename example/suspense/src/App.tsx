import { Suspense } from 'react'
import { defineStore, useSnapshot } from 'binia'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  console.log('error', error, resetErrorBoundary)
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

const myErrorHandler = (error: Error, info: { componentStack: string }) => {
  console.log('myErrorHandler', error, info)
  // Do something with the error
  // E.g. log to an error logging client here
}

type State = {
  count: number | Promise<number>
}
const store = defineStore({
  state: { count: 1 } as State,
  computed: {
    doubled() {
      const c = this.count
      return c * 2
    },
  },
})
// actions
const incAsync = async () => {
  const c = await store.count
  store.count = new Promise((resolve, reject) =>
    setTimeout(() => {
      if (Math.random() < 0.5) {
        reject(new Error('random error'))
      } else {
        resolve(c)
      }
    }, 1000)
  )
}

function C() {
  const snap = useSnapshot(store)
  return (
    <div>
      <h3>count: {snap.count}</h3>
      <h3>double: {snap.doubled}</h3>
    </div>
  )
}

function D() {
  return <div>loading</div>
}
function App() {
  const onReset = () => {
    store.count = 1
  }
  return (
    <div>
      <Suspense fallback={<D></D>}>
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={onReset}
          onError={myErrorHandler}>
          <C />
        </ErrorBoundary>
      </Suspense>
      <button onClick={incAsync}>incAsync</button>
    </div>
  )
}
export default App
