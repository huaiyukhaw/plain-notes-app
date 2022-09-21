import { useEffect } from "react";

// Updates the height of a <textarea> when the value changes.
export const useAutosizeTextArea = (
  textAreaRef: HTMLTextAreaElement | null,
  value: string,
  refresh?: boolean
) => {
  useEffect(() => {
    if (textAreaRef) {
      textAreaRef.style.height = "0px";
      textAreaRef.style.height = textAreaRef.scrollHeight + "px";
    }
  }, [textAreaRef, value, refresh]);
};
