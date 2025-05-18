import {
  createStore,
  toggleBoolean,
  updateArray,
  deleteFromArray,
  updateObject,
  deleteFromObject,
} from "otterlightstore";

// 1. Define your app's starting data here
//    This object holds all the pieces of data your app will use and update
const initialState = {
  //These are examples which you can change or remove
  count: 0, // A simple number we can increase/decrease
  isOn: false, // A simple Boolean (True or False only)
  items: ["apple", "banana"], // Simple list, to add a remove
  user: { name: "Alice", age: 25 }, // This could store user info later
};

// 2. Create the store with your initial data
const yourStore = createStore(initialState);

// 3. Export the store so other parts of your app can use it
export { toggleBoolean, updateArray, deleteFromArray, updateObject, deleteFromObject };
