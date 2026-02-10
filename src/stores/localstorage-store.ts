import { get, writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";

type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

export function createLocalStorageStore<T extends JSONValue>(
  key: string,
  initial: T
): {
  store: Writable<T>;
  set: (value: T) => void;
  get: () => T;
  update: (fn: (current: T) => T) => void;
  toggle: () => void;
} {
  const stored = browser ? localStorage.getItem(key) : null;
  let value: T;
  if (stored !== null) {
    try {
      value = JSON.parse(stored) as T;
    } catch {
      value = initial;
    }
  } else {
    value = initial;
  }

  const store = writable<T>(value);

  if (browser) {
    store.subscribe((v) => localStorage.setItem(key, JSON.stringify(v)));
  }

  function setValue(v: T) {
    store.set(v);
  }

  function getValue() {
    return get(store);
  }

  function updateValue(fn: (current: T) => T) {
    store.update(fn);
  }

  function toggle() {
    store.update((v) => (typeof v === "boolean" ? (!v as T) : v));
  }

  return { store, set: setValue, get: getValue, update: updateValue, toggle };
}
