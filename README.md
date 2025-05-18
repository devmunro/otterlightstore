![image](https://github.com/user-attachments/assets/665bf2f5-878a-4922-845e-58ee63aa5497)


otterlightstore
===============

A lightweight state management library for React using useSyncExternalStore. Provides simple APIs for managing global state with support for async states, object/array updates, and built-in devtools history.

Features
--------

*   Simple, minimalistic API
    
*   React hooks with selector support
    
*   Async state handling built-in
    
*   Helpers for toggling booleans, updating arrays/objects
    
*   Devtools history & state restore
    
*   No dependencies except React
    

Installation
------------

`npm install otterlightstore   `

or

`yarn add otterlightstore   `

Usage
-----


### 1a\. Initialize Starter Store File
Run this once to create a ready-to-use otter-store.js file in your current folder:

`npx otterlightstore-init`

This file includes:

*A basic store with example initial state
*Setup for your React components to use the store
*Example usage of helpers like toggling booleans and updating arrays

or

### 1b\. Create your store

```js
import { createStore } from "otterlightstore";

const initialState = {
  count: 0,
  todos: [],
  loading: false,
};

export const store = createStore(initialState);
```

### 2\. Use the store in your components

```js
import React from "react";
import { store } from "./store";

function Counter() {
  const count = store.useLightStore((state) => state.count);

  const increment = () => {
    store.set({ count: count + 1 }, "increment");
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

### 3\. Async state example

```js
async function fetchData() {
  await store.asyncState("data", async () => {
    const response = await fetch("https://api.example.com/data");
    return response.json();
  });
}
```

### 4\. Using helpers

```js
store.toggleBoolean("isOpen");
store.updateArray("todos", (arr) => [...arr, { id: 1, text: "Learn otterlightstore" }]);
store.deleteFromArray("todos", (todo) => todo.id === 1);
store.updateObject("user", { name: "Alice" });
store.deleteFromObject("user", "age");   
````

API Reference
-------------

### createStore(initialState, options)

Creates a new store instance.

*   initialState — Object, initial state
    
*   options — Object, supports { enableLogging: boolean }
    

Returns:

*   get() — current state
    
*   set(partialState | updaterFn, actionName) — update state
    
*   useLightStore(selector) — React hook for subscription and selection
    
*   asyncState(key, asyncFn) — async state helper
    
*   toggleBoolean(key) — toggle boolean state
    
*   updateArray(key, updaterFn) — update array state
    
*   deleteFromArray(key, predicate) — delete from array
    
*   updateObject(key, partialUpdate) — partial object update
    
*   deleteFromObject(key, prop) — delete object prop
    
*   devtools — history and restore functions
    

Devtools
--------

Store keeps a history (max 50). Use:

`const history = store.devtools.getHistory();  store.devtools.restoreState(0);   `
