import { useSyncExternalStore, useRef } from "react";

function shallowEqual(objA, objB) {
  if (objA === objB) return true;
  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  )
    return false;
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  for (let key of keysA) {
    if (objA[key] !== objB[key]) return false;
  }
  return true;
}

export function createStore(initialState = {}, options = {}) {
  let state = initialState;
  const listeners = new Set();
  let isNotifying = false;
  const { enableLogging = false } = options;

  const devtoolsHistory = [];
  const maxHistoryLength = 50;
  devtoolsHistory.push({
    prevState: null,
    nextState: initialState,
    actionName: "init",
  });
  let currentIndex = 0;

  const get = () => state;

  const set = (partial, actionName = "set") => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    const prevState = state;
    state = { ...state, ...nextState };

    // Log
    if (enableLogging) {
      console.groupCollapsed(`LightStore action: ${actionName}`);
      console.log("Previous state:", prevState);
      console.log("Next state:", state);
      console.groupEnd();
    }

    if (currentIndex < devtoolsHistory.length - 1) {
      devtoolsHistory.splice(currentIndex + 1, devtoolsHistory.length - currentIndex - 1);

    }
    devtoolsHistory.push({ prevState, nextState: state, actionName });
    currentIndex++;

    if (devtoolsHistory.length > maxHistoryLength) {
      devtoolsHistory.shift();
      currentIndex--;
    }

    if (!isNotifying) {
      isNotifying = true;
      Promise.resolve().then(() => {
        listeners.forEach((listener) => listener(prevState, state));
        isNotifying = false;
      });
    }
  };

  const restoreState = (index) => {
    if (index < 0 || index >= devtoolsHistory.length) return;
    state = devtoolsHistory[index].nextState;
    currentIndex = index;
    listeners.forEach((listener) => listener(state, state));
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };


  // min async helper
  const asyncState = async (key, asyncFn) => {
    set(
      { [key]: { loading: true, data: null, error: null } },
      `asyncState:${key}:loading`
    );
    try {
      const data = await asyncFn();
      set(
        { [key]: { loading: false, data, error: null } },
        `asyncState:${key}:success`
      );
    } catch (error) {
      set(
        { [key]: { loading: false, data: null, error } },
        `asyncState:${key}:error`
      );
    }
  };
  //helpers
  function toggleBoolean(key) {
    set((prev) => ({ [key]: !prev[key] }), `toggleBoolean:${key}`);
  }

  function updateArray(key, updaterFn) {
    set((prev) => {
      const arr = Array.isArray(prev[key]) ? prev[key] : [];
      return { [key]: updaterFn(arr) };
    }, `updateArray:${key}`);
  }

  function deleteFromArray(key, predicate) {
    set((prev) => {
      const arr = Array.isArray(prev[key]) ? prev[key] : [];
      const newArr = arr.filter((item) =>
        typeof predicate === "function" ? !predicate(item) : item !== predicate
      );
      return { [key]: newArr };
    }, `deleteFromArray:${key}`);
  }

  function updateObject(key, partialUpdate) {
    set(
      (prev) => ({
        [key]: { ...(prev[key] || {}), ...partialUpdate },
      }),
      `updateObject:${key}`
    );
  }

  function deleteFromObject(key, prop) {
    set((prev) => {
      if (!prev[key] || typeof prev[key] !== "object") return {};
      const { [prop]: _, ...rest } = prev[key];
      return { [key]: rest };
    }, `deleteFromObject:${key}`);
  }

  const devtools = {
    getHistory: () => [...devtoolsHistory],
    clearHistory: () => {
      devtoolsHistory.splice(0, devtoolsHistory.length);
      currentIndex = -1;
    },
    getState: get,
    restoreState,
  };

  return {
    get,
    set,
    subscribe,
    asyncState,
    toggleBoolean,
    updateArray,
    deleteFromArray,
    updateObject,
    deleteFromObject,
    devtools,
    options,
  };
}


export function useLightStore(store, selector = s => s) {
  const lastSelectedRef = useRef();

  return useSyncExternalStore(
    store.subscribe,
    () => {
      const selected = selector(store.get());
      if (shallowEqual(lastSelectedRef.current, selected)) {
        return lastSelectedRef.current;
      }
      lastSelectedRef.current = selected;
      return selected;
    },
    () => selector(store.get())
  );
}