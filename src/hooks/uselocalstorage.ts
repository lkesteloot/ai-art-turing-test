
import { useState, useEffect } from "react";

/**
 * Hook that works like `useState()` but stores the value in local storage.
 */
export function useLocalStorage<T>(storageKey: string, initialValue: T | (() => T)): [T, (newValue: T) => void] {
    const [value, setValue] = useState<T>(() => {
        const valueString = typeof window === "undefined"
            ? null
            : window.localStorage.getItem(storageKey);
        return valueString === null
            ? initialValue instanceof Function ? initialValue() : initialValue
            : JSON.parse(valueString);
    });

    useEffect(() => {
        window.localStorage.setItem(storageKey, JSON.stringify(value));
    }, [value]);

    return [value, setValue];
}
