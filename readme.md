inspired by [valtio](https://github.com/pmndrs/valtio)
## Demo


- [count](https://stackblitz.com/github/ahaoboy/binia/tree/main/example/count?title=binia-count&file=src/App.tsx&terminal=dev)
- [computed](https://stackblitz.com/github/ahaoboy/binia/tree/main/example/computed?title=binia-computed&file=src/App.tsx&terminal=dev)
- [computed cache size](https://stackblitz.com/github/ahaoboy/binia/tree/main/example/computed-computed-cache?title=binia-computed-cache&file=src/App.tsx&terminal=dev)
- [derive](https://stackblitz.com/github/ahaoboy/binia/tree/main/example/derive?title=binia-derive&file=src/App.tsx&terminal=dev)
- [xstate](https://stackblitz.com/github/ahaoboy/binia/tree/main/example/xstate?title=binia-xstate&file=src/App.tsx&terminal=dev)
- [set/map](https://stackblitz.com/github/ahaoboy/binia/tree/main/example/set-map?title=binia-set-map&file=src/App.tsx&terminal=dev)
- [connect-class](https://stackblitz.com/github/ahaoboy/binia/tree/main/example/connect-class?title=binia-connect-class&file=src/App.tsx&terminal=dev)
- [react18](https://stackblitz.com/github/ahaoboy/binia/tree/main/example/react18?title=binia-react18&file=src/App.tsx&terminal=dev)
- [devtool](https://stackblitz.com/github/ahaoboy/binia/tree/main/example/devtool?title=binia-devtool&file=src/App.tsx&terminal=dev)
- [suspense](https://stackblitz.com/github/ahaoboy/binia/tree/main/example/suspense?title=binia-suspense&file=src/App.tsx&terminal=dev)

## install

```sh
npm i binia
```

## Api

### defineStore

定义 store, computed 属性也支持 setter, 注意由于使用 this 访问属性, 所以不能使用箭头函数

```ts
import { defineStore } from "binia";
const store = defineStore({
  state: { count: 1 },
  computed: {
    doubled() {
      return this.count * 2;
    },
    quadrupled: {
      get() {
        return this.doubled * 2;
      },
      set(v: number) {
        this.count = v >> 2;
      },
    },
  },
});

const state2 = defineStore({
  state: {
    firstName: "Alec",
    lastName: "Baldwin",
  },
  computed: {
    fullName: {
      get() {
        return this.firstName + " " + this.lastName;
      },
      set(newValue: string) {
        [this.firstName, this.lastName] = newValue.split(" ");
      },
    },
  },
});
```
#### options
computedCacheSize: 自定义computed的缓存大小, 默认2 [demo](https://stackblitz.com/edit/vitejs-vite-vfha75&file=src/App.tsx&terminal=dev)

### useSnapshot

在组件中使用 store 中的数据, useSnapshot 返回只读对象, 通过拦截 getter 收集组件中具体使用了那些属性, 只有被用到的属性发生变化后才会更新组件, 不需要使用 Context 或者 Provider 等 api

```tsx
function C() {
  const { count, doubled, quadrupled } = useSnapshot(store);
  return (
    <div>
      <h2>count:{count}</h2>
      <h2>doubled:{doubled}</h2>
      <h2>quadrupled:{quadrupled}</h2>
    </div>
  );
}
```

### action

action 就是一个简单的修改 store 的普通函数

```ts
const inc = () => store.count++;

const decAsync = async (v = 1) => {
  await sleep(1000);
  store.count -= v;
};
```

### derive

用 derive 函数定义一个派生自多个 store 的新 store, 每个属性都是一个参数为 get 的函数, 访问时的属性值为函数返回值, 通过 get 函数收集依赖, 下面的案例中 storeC.c 变化后属性 ab 是不会变化的, 只有 storeA.a 或者 storeB.b 变化后 ab 才会更新, 对应的组件也会重新 render

```ts
const storeA = defineStore({ state: { a: 1 } });
const storeB = defineStore({ state: { b: 1 } });
const storeC = defineStore({ state: { c: 1 } });

const storeD = derive({
  ab(get) {
    return get(storeA).a + '--' + get(storeB).b + '--' + storeC.c;
  },
});

```
### connect
可以在class组件中使用

```tsx
const inc = () => {
  store.count++;
};
type Store = typeof store;
type Snap = Snapshot<Store>;
const mapState = (snap: Snap) => {
  return {
    c: snap.count,
    d: snap.quadrupled,
  };
};
type MapState = ReturnType<typeof mapState>;
type MapActions = ReturnType<typeof mapActions>;
type Props = { name: string };

const mapActions = (store: Store) => {
  return {
    inc,
    dec: () => {
      store.count--;
    },
  };
};

class A extends React.Component<MapActions & MapState & Props> {
  render() {
    return (
      <div>
        <h2>c:{this.props.c}</h2>
        <h2>d:{this.props.d}</h2>
        <button onClick={this.props.inc}>inc</button>
        <button onClick={this.props.dec}>dec</button>
      </div>
    );
  }
}

const C = connect(store, mapState, mapActions)(A);
```
### devtools
安装Redux DevTools 插件, 然后调用devtools函数开启
```ts
import { devtools, defineStore } from 'binia';

const store = defineStore({
  state: { count: 1 },
  computed: {
    doubled() {
      return this.count * 2;
    },
    quadrupled: {
      get() {
        return this.doubled * 2;
      },
      set(v: number) {
        this.count = v >> 2;
      },
    },
  },
});
devtools(store, { name: 'demo',enabled: true })

```

## TS 支持

### 自定义类型

有些时候自动类型推导会无法推导 union 等类型, 需要手动标注类型

```ts
const state: { mode: "dev" | "prod" } = { mode: "dev" };
const store = defineStore({ state });

// 或者使用as
const store = defineStore({ state: { mode: "dev" as "dev" | "prod" } });
```

### 在 derive 中访问 computed

由于 ts 的限制, 目前并不能在 derive 函数中访问自己的 computed 属性, 功能上支持, 只是类型推导上无法支持, 可以使用 as 规避, 或者使用 derive 函数创建新 store

```ts
const storeA = defineStore({
  state: { h: "hello", w: "world" },
  computed: {
    hw() {
      return this.h + " " + this.w;
    },
  },
});
const storeB = defineStore({
  state: { count: 1 },
  computed: {
    doubled() {
      return this.count * 2;
    },
  },
  derive: {
    helloCount(get) {
      return "hello: " + get(this).count + get(storeA).hw;
    },
    helloDouble(get) {
        // 使用as语法规避
      return 'hello: ' + get(this as unknown as { doubled: number }).doubled + get(storeA).hw
    },
  },
});


const storeC = derive({
  helloCount(get) {
    return 'hello: ' + get(store).count + get(storeA).hw;
  },
  helloDouble(get) {
    return 'hello: ' + get(store).doubled + get(storeA).hw;
  },
})
```


