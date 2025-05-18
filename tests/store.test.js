import { createStore, useLightStore } from '../src/store';
import { act, renderHook } from '@testing-library/react';

describe('LightStore', () => {
  it('initializes with initial state', () => {
    const store = createStore({ count: 0 });
    expect(store.get()).toEqual({ count: 0 });
  });

  it('updates state with set()', () => {
    const store = createStore({ count: 0 });
    act(() => {
      store.set({ count: 1 }, 'increment');
    });
    expect(store.get()).toEqual({ count: 1 });
  });

it('useLightStore hook selects state', () => {
  const store = createStore({ count: 0 });
  const { result, rerender } = renderHook(() => useLightStore(store, state => state.count));

  expect(result.current).toBe(0);

  act(() => {
    store.set({ count: 2 }, 'increment');
  });

  rerender();

  expect(result.current).toBe(2);
});


  it('restores state from history', () => {
    const store = createStore({ count: 0 });

    act(() => {
      store.set({ count: 1 }, 'increment');
      store.set({ count: 2 }, 'increment');
    });
    expect(store.get().count).toBe(2);

    act(() => {
      store.devtools.restoreState(0);
      store.set(store.get());
    });

    expect(store.get().count).toBe(0);
  });
});
