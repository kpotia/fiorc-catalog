import { useState, useEffect, useCallback, useRef } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Flag to check if we are in browser
  const isClient = typeof window !== 'undefined';

  // Read value from localStorage has fallback
  const readValue = useCallback((): T => {
    if (!isClient) {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue, isClient]);

  // Set up state
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Keep track of the latest readValue to avoid unnecessary recreation or updates
  const readValueRef = useRef(readValue);
  readValueRef.current = readValue;

  // Set value function that handles both values and functional updates
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          
          // Dispatch a local event so this tab also hears it if needed, or other hooks on same page
          window.dispatchEvent(new Event('local-storage-update'));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Synchronization between tabs / windows & local updates
  useEffect(() => {
    if (!isClient) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        setStoredValue(readValueRef.current());
      }
    };

    const handleLocalUpdate = () => {
      setStoredValue(readValueRef.current());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage-update', handleLocalUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage-update', handleLocalUpdate);
    };
  }, [key, isClient]);

  // Server Side Render first hydration sync
  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [storedValue, setValue];
}
