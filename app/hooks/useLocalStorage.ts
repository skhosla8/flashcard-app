"use client";
import { useState, useEffect } from 'react';

function useLocalStorage(key: string, defaultValue: any) {
    // Use lazy initialization to read from localStorage only once when the component mounts
    const [value, setValue] = useState(() => {
        if (typeof window !== 'undefined') {
            const storedValue = localStorage.getItem(key);

            if (storedValue !== 'undefined' || storedValue !== null) {
                // @ts-ignore
                return JSON.parse(storedValue)
            } else {
                return defaultValue;
            }
        }
    });

    // Use useEffect to synchronize localStorage whenever the state value changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(value));
        }

    }, [key, value]); // Dependencies: runs whenever 'key' or 'value' changes

    return [value, setValue];
}

export default useLocalStorage;