// const atomCount = atom(0)
// const [count, setCount] = useAtom(atomCount)

// const dataAtom = atom(() => fetch("./data.json").then((res) => res.json()));

import { useSyncExternalStore } from "react";

interface Atom<AtomType> {
  get: () => AtomType;
  set: (newValue: AtomType) => void;
  subscribe: (callback: (newValue: AtomType) => void) => () => void;
  _subscribers: () => number;
}

type AtomGetter<AtomType> = (
  get: <Target>(a: Atom<Target>) => Target
) => AtomType;

export function atom<AtomType extends unknown>(
  initialValue: AtomType | AtomGetter<AtomType>
): Atom<AtomType> {
  let value: AtomType =
    typeof initialValue === "function" ? (null as AtomType) : initialValue;

  const subscribers = new Set<(newValue: AtomType) => void>();
  const subscribed = new Set<Atom<any>>();

  function get<Target>(atom: Atom<Target>) {
    if ('get' in atom && 'subscribe' in atom) {
      let currentValue = atom.get();

      if (!subscribed.has(atom)) {
        subscribed.add(atom)

        atom.subscribe(function (newValue) {
          if (currentValue === newValue) {
            return;
          }

          currentValue = newValue
          calculateValue();
        })
      }

      return currentValue;
    }
    throw new Error("not an atom");
  }

  async function calculateValue() {
    try {
      const newValue =
        typeof initialValue === "function" ? (initialValue as AtomGetter<AtomType>)(get) : value;

      value = (null as AtomType)
      value = await newValue

      subscribers.forEach((callback) => callback(value));
    } catch (error) {
      console.error(error);
    }
  }

  calculateValue();

  return {
    get: () => value,
    set: (newValue) => {
      value = newValue;
      calculateValue();
    },
    subscribe: (callback) => {
      subscribers.add(callback);
      return () => {
        subscribers.delete(callback);
      };
    },
    _subscribers: () => subscribers.size,
  }
}

export function useAtom<AtomType>(atom: Atom<AtomType>): [AtomType, (newValue: AtomType) => void] {
  const state = useSyncExternalStore(atom.subscribe, atom.get);

  return [state, atom.set];
}

export function useAtomValue<AtomType>(atom: Atom<AtomType>) {
  return useSyncExternalStore(atom.subscribe, atom.get);
}