import { useState } from "react";
const state = { c: 1 };
export default () => {
  const [, update] = useState(0);
  const forceUpdate = () => update((c) => c + 1);

  return (
    <div>
      <h1>c:{state.c}</h1>
      <button
        onClick={() => {
          state.c++;
        }}
      >
        add
      </button>
      <button onClick={forceUpdate}>update</button>
    </div>
  );
};
