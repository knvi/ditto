"use strict";
// const atomCount = atom(0)
// const [count, setCount] = useAtom(atomCount)
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAtomValue = exports.useAtom = exports.atom = void 0;
const tslib_1 = require("tslib");
// const dataAtom = atom(() => fetch("./data.json").then((res) => res.json()));
const react_1 = require("react");
function atom(initialValue) {
    let value = typeof initialValue === "function" ? null : initialValue;
    const subscribers = new Set();
    const subscribed = new Set();
    function get(atom) {
        let currentValue = atom.get();
        if (!subscribed.has(atom)) {
            subscribed.add(atom);
            atom.subscribe(function (newValue) {
                if (currentValue === newValue) {
                    return;
                }
                currentValue = newValue;
                calculateValue();
            });
        }
        return currentValue;
    }
    function calculateValue() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const newValue = typeof initialValue === "function" ? initialValue(get) : value;
            value = null;
            value = yield newValue;
            subscribers.forEach((callback) => callback(value));
        });
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
    };
}
exports.atom = atom;
function useAtom(atom) {
    const state = (0, react_1.useSyncExternalStore)(atom.subscribe, atom.get);
    return [state, atom.set];
}
exports.useAtom = useAtom;
function useAtomValue(atom) {
    return (0, react_1.useSyncExternalStore)(atom.subscribe, atom.get);
}
exports.useAtomValue = useAtomValue;
const atomCount = atom(0);
const atomCount2 = atom(atomCount);
//# sourceMappingURL=index.js.map