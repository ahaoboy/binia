import { proxy, snapshot, subscribe, useSnapshot } from "../src";
import { proxyWithComputed } from "../src";
import { vi } from "vitest";
const consoleWarn = console.warn;
beforeEach(() => {
  console.warn = vi.fn((message) => {
    if (message.startsWith("addComputed is deprecated.")) {
      return;
    }
    consoleWarn(message);
  });
});
afterEach(() => {
  console.warn = consoleWarn;
});

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

it("simple computed getters", async () => {
  const computeDouble = vi.fn((x) => x * 2);
  const state = proxyWithComputed(
    {
      text: "",
      count: 0,
    },
    {
      doubled: {
        get() {
          return computeDouble(this.count);
        },
      },
    }
  );

  const callback = vi.fn();
  subscribe(state, callback);

  expect(snapshot(state)).toMatchObject({ text: "", count: 0, doubled: 0 });
  expect(computeDouble).toBeCalledTimes(1);
  expect(callback).toBeCalledTimes(0);

  state.count += 1;
  await Promise.resolve();
  expect(snapshot(state)).toMatchObject({ text: "", count: 1, doubled: 2 });
  expect(computeDouble).toBeCalledTimes(2);
  expect(callback).toBeCalledTimes(1);

  state.text = "a";
  await Promise.resolve();
  expect(snapshot(state)).toMatchObject({ text: "a", count: 1, doubled: 2 });
  expect(computeDouble).toBeCalledTimes(2);
  expect(callback).toBeCalledTimes(2);
});

it("computed getters and setters", async () => {
  const computeDouble = vi.fn((x) => x * 2);
  const state = proxyWithComputed(
    {
      text: "",
      count: 0,
    },
    {
      doubled: {
        get() {
          return computeDouble(this.count);
        },
        set(newValue: number) {
          this.count = newValue / 2;
        },
      },
    }
  );

  expect(snapshot(state)).toMatchObject({ text: "", count: 0, doubled: 0 });
  expect(computeDouble).toBeCalledTimes(1);

  state.count += 1;
  await Promise.resolve();
  expect(snapshot(state)).toMatchObject({ text: "", count: 1, doubled: 2 });
  expect(computeDouble).toBeCalledTimes(2);

  state.doubled = 1;
  await Promise.resolve();
  expect(snapshot(state)).toMatchObject({ text: "", count: 0.5, doubled: 1 });
  expect(computeDouble).toBeCalledTimes(3);

  state.text = "a";
  await Promise.resolve();
  expect(snapshot(state)).toMatchObject({ text: "a", count: 0.5, doubled: 1 });
  expect(computeDouble).toBeCalledTimes(3);
});

it("computed setters with object and array", async () => {
  const state = proxyWithComputed(
    {
      obj: { a: 1 },
      arr: [2],
    },
    {
      object: {
        get() {
          return this.obj;
        },
        set(newValue: any) {
          this.obj = newValue;
        },
      },
      array: {
        get() {
          return this.arr;
        },
        set(newValue: any) {
          this.arr = newValue;
        },
      },
    }
  );

  expect(snapshot(state)).toMatchObject({
    obj: { a: 1 },
    arr: [2],
    object: { a: 1 },
    array: [2],
  });

  state.object = { a: 2 };
  state.array = [3];
  await Promise.resolve();
  expect(snapshot(state)).toMatchObject({
    obj: { a: 2 },
    arr: [3],
    object: { a: 2 },
    array: [3],
  });
});

// it("simple addComputed", async () => {
//   const computeDouble = vi.fn((x) => x * 2);
//   const state = proxy({
//     text: "",
//     count: 0,
//   });
//   addComputed(state, {
//     doubled: () => computeDouble(this.count),
//   });

//   const callback = vi.fn();
//   subscribe(state, callback);

//   expect(snapshot(state)).toMatchObject({ text: "", count: 0, doubled: 0 });
//   expect(computeDouble).toBeCalledTimes(1);
//   expect(callback).toBeCalledTimes(0);

//   state.count += 1;
//   await Promise.resolve();
//   expect(snapshot(state)).toMatchObject({ text: "", count: 1, doubled: 2 });
//   expect(computeDouble).toBeCalledTimes(2);
//   await Promise.resolve();
//   expect(callback).toBeCalledTimes(1);

//   state.text = "a";
//   await Promise.resolve();
//   expect(snapshot(state)).toMatchObject({ text: "a", count: 1, doubled: 2 });
//   // This can't pass with derive emulation: expect(computeDouble).toBeCalledTimes(2)
//   expect(callback).toBeCalledTimes(2);
// });

// it("async addComputed", async () => {
//   const state = proxy({ count: 0 });
//   addComputed(state, {
//     delayedCount: async () => {
//       await sleep(300);
//       return this.count + 1;
//     },
//   });

//   const Counter = () => {
//     const snap = useSnapshot(
//       state as { count: number; delayedCount: Promise<number> }
//     );
//     return (
//       <>
//         <div>
//           count: {this.count}, delayedCount: {this.delayedCount}
//         </div>
//         <button onClick={() => ++state.count}>button</button>
//       </>
//     );
//   };

//   const { getByText, findByText } = render(
//     <StrictMode>
//       <Suspense fallback="loading">
//         <Counter />
//       </Suspense>
//     </StrictMode>
//   );

//   await findByText("loading");
//   await findByText("count: 0, delayedCount: 1");

//   fireEvent.click(getByText("button"));
//   await findByText("loading");
//   await findByText("count: 1, delayedCount: 2");
// });

// it("nested emulation with addComputed", async () => {
//   const computeDouble = vi.fn((x) => x * 2);
//   const state = proxy({ text: "", math: { count: 0 } });
//   addComputed(
//     state,
//     {
//       doubled: () => computeDouble(this.math.count),
//     },
//     state.math
//   );

//   const callback = vi.fn();
//   subscribe(state, callback);

//   expect(snapshot(state)).toMatchObject({
//     text: "",
//     math: { count: 0, doubled: 0 },
//   });
//   expect(computeDouble).toBeCalledTimes(1);
//   expect(callback).toBeCalledTimes(0);

//   state.math.count += 1;
//   await Promise.resolve();
//   expect(snapshot(state)).toMatchObject({
//     text: "",
//     math: { count: 1, doubled: 2 },
//   });
//   expect(computeDouble).toBeCalledTimes(2);
//   await Promise.resolve();
//   expect(callback).toBeCalledTimes(1);

//   state.text = "a";
//   await Promise.resolve();
//   expect(snapshot(state)).toMatchObject({
//     text: "a",
//     math: { count: 1, doubled: 2 },
//   });
//   // This can't pass with derive emulation: expect(computeDouble).toBeCalledTimes(2)
//   expect(callback).toBeCalledTimes(2);
// });

// it("addComputed with array.pop (#124)", async () => {
//   const state = proxy({
//     arr: [{ n: 1 }, { n: 2 }, { n: 3 }],
//   });
//   addComputed(state, {
//     nums: () => this.arr.map((item) => item.n),
//   });

//   expect(snapshot(state)).toMatchObject({
//     arr: [{ n: 1 }, { n: 2 }, { n: 3 }],
//     nums: [1, 2, 3],
//   });

//   state.arr.pop();
//   await Promise.resolve();
//   expect(snapshot(state)).toMatchObject({
//     arr: [{ n: 1 }, { n: 2 }],
//     nums: [1, 2],
//   });
// });
