import { useRef } from "react";

export const useUndoRedo = (initialState) => {
  const historyRef = useRef({ past: [structuredClone(initialState)], future: [] });

  const setNewState = (newState) => {
    historyRef.current.past.push(structuredClone(newState)); // Save (copy of) current state
    historyRef.current.future = []; // Clear redo history
  };

  const undo = () => {
    if (historyRef.current.past.length > 1) {
        historyRef.current.future.unshift(historyRef.current.past.pop());
        return structuredClone(historyRef.current.past.at(-1));
    }
  };

  const redo = () => {
    if (historyRef.current.future.length > 0) {
      //historyRef.current.past.push(state);
      historyRef.current.past.push(historyRef.current.future.shift());
      return structuredClone(historyRef.current.past.at(-1));
    }
  };

  return { setNewState, undo, redo };
};