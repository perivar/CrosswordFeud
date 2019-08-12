import { useRef } from 'react';

export const useFocus = () => {
  const htmlElRef = useRef<HTMLElement>();
  const setFocus = () => {
    const currentEl = htmlElRef.current;
    currentEl && currentEl.focus();
  };
  return [setFocus, htmlElRef] as const;
};
