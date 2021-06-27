import produce from 'immer';
import warning from 'warning';
import * as React from 'react';

const initialState: string[] = [];

export type ACTION_TYPE = { type: 'toggle'; payload: string };

const reducer = produce(function reducer(
  state: typeof initialState,
  action: ACTION_TYPE,
) {
  switch (action.type) {
    case 'toggle':
      const isExpanded = state.includes(action.payload);
      if (isExpanded) {
        return state.filter((key) => key !== action.payload);
      }

      state.push(action.payload);
      break;
    default:
      warning(false, `不支持的action type: ${action.type}`);
  }
});

function toggleMenu(dispatch: React.Dispatch<ACTION_TYPE>, key: string) {
  dispatch({ type: 'toggle', payload: key });
}

function useMenuExpand() {
  return React.useReducer(reducer, initialState);
}

export default useMenuExpand;
export { toggleMenu };
