import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

export const useKeyPress = (
  keys: string[],
  callback: (event: KeyboardEvent) => void,
  combinedKey?: "ctrlKey" | "shiftKey" | "altKey" | "metaKey",
  node?: Document
) => {
  // implement the callback ref pattern
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // handle what happens on key press
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      // check if one of the key is part of the ones we want
      const condition = keys.some((key) => event.key === key);
      if (combinedKey) {
        if (condition && event[combinedKey]) {
          event.preventDefault();
          event.stopPropagation();
          callbackRef.current(event);
        }
      } else {
        if (condition) {
          event.preventDefault();
          event.stopPropagation();
          callbackRef.current(event);
        }
      }
    },
    [keys]
  );

  useEffect(() => {
    // target is either the provided node or the document
    const targetNode = node ?? document;
    // attach the event listener
    targetNode && targetNode.addEventListener("keydown", handleKeyPress);

    // remove the event listener
    return () =>
      targetNode && targetNode.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress, node]);
};
