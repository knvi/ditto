interface Atom<AtomType> {
    get: () => AtomType;
    set: (newValue: AtomType) => void;
    subscribe: (callback: (newValue: AtomType) => void) => () => void;
    _subscribers: () => number;
}
type AtomGetter<AtomType> = (get: <Target>(a: Atom<Target>) => Target) => AtomType;
export declare function atom<AtomType extends unknown>(initialValue: AtomType | AtomGetter<AtomType>): Atom<AtomType>;
export declare function useAtom<AtomType>(atom: Atom<AtomType>): [AtomType, (newValue: AtomType) => void];
export declare function useAtomValue<AtomType>(atom: Atom<AtomType>): AtomType;
export {};
