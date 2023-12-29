import { atom, useAtom } from "../src";

const atomCounter = atom(0);

const Counter = () => {
  const [count, setCount] = useAtom(atomCounter);

  return (
    <div>
      <h1>Counter</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Click</button>
    </div>
  );
};