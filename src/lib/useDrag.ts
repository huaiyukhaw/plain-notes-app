import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

export const useDrag = (
  callback: (event: DragEvent) => void,
  node?: Document
) => {
  // implement the callback ref pattern
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // handle what happens on drag
  const handleDrag = useCallback((event: DragEvent) => {
    callbackRef.current(event);
  }, []);

  useEffect(() => {
    // target is either the provided node or the document
    const targetNode = node ?? document;
    // attach the event listener
    targetNode && targetNode.addEventListener("dragstart", handleDrag);

    // remove the event listener
    return () =>
      targetNode && targetNode.removeEventListener("dragstart", handleDrag);
  }, [handleDrag, node]);
};
