import { useState, useRef } from "react";

export const useUndoRedo = (initialState) => {
  const [state, setState] = useState(initialState);
  const historyRef = useRef({ past: [], future: [] });

  const set = (newState) => {
    historyRef.current.past.push(state); // Save current state
    historyRef.current.future = []; // Clear redo history
    setState(newState);
  };

  const undo = () => {
    if (historyRef.current.past.length > 0) {
      historyRef.current.future.unshift(state);
      setState(historyRef.current.past.pop());
    }
  };

  const redo = () => {
    if (historyRef.current.future.length > 0) {
      historyRef.current.past.push(state);
      setState(historyRef.current.future.shift());
    }
  };

  return { state, set, undo, redo };
};