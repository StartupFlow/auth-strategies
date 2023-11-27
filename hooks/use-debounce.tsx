import { useEffect, useMemo, useRef } from "react";

/**
 * Debounce a callback function
 * @param callback
 * @param delay
 * @returns
 */
export const useDebounce = <
  Callback extends (...arfs: Parameters<Callback>) => ReturnType<Callback>
>(
  callback: Callback,
  delay: number
) => {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });
  return useMemo(
    () =>
      debounce(
        (...args: Parameters<Callback>) => callbackRef.current(...args),
        delay
      ),
    [delay]
  );
};

/**
 * Debounce implementation
 * @param fn
 * @param delay
 * @returns
 */
function debounce<Callback extends (...args: Parameters<Callback>) => void>(
  fn: Callback,
  delay: number
) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<Callback>) => {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
