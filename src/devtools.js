import React, { useState, useEffect } from 'react';

export function LightStoreDevTools({ store }) {
  const [history, setHistory] = useState(store.devtools.getHistory());
  const [currentIndex, setCurrentIndex] = useState(history.length - 1);

  useEffect(() => {
    const updateHistory = () => {
      const newHistory = store.devtools.getHistory();
      setHistory(newHistory);
      setCurrentIndex(newHistory.length - 1);
    };
    const unsubscribe = store.subscribe(updateHistory);
    return () => unsubscribe();
  }, [store]);

  const handleRestore = (index) => {
    store.devtools.restoreState(index);
    setCurrentIndex(index);
  };

  return React.createElement('div', { style: { border: '1px solid #ccc', padding: 10, maxHeight: 300, overflowY: 'auto' } },
    React.createElement('h4', null, 'LightStore DevTools'),
    React.createElement('ul', { style: { listStyle: 'none', padding: 0 } },
      history.map(({ actionName }, i) =>
        React.createElement('li', {
          key: i,
          onClick: () => handleRestore(i),
          style: {
            cursor: 'pointer',
            fontWeight: i === currentIndex ? 'bold' : 'normal',
            backgroundColor: i === currentIndex ? '#def' : 'transparent',
            padding: '4px 8px',
            borderRadius: 4,
          },
          title: `Action: ${actionName}`
        }, `#${i} — ${actionName}`)
      )
    )
  );
}
