import { useEffect, useState, useCallback } from 'react';

// -- New Event --
const LOCAL_STORAGE_CHANGED_EVENT_NAME = "local_storage_changed"

// -- Storage Wrappers --
function writeStorage<T>(key: string, value: T) {
  localStorage.setItem(key,
    typeof value === 'object' ? JSON.stringify(value) : `${value}`)

  window.dispatchEvent(new CustomEvent(
    LOCAL_STORAGE_CHANGED_EVENT_NAME,
    {
      detail: { key, value },
    }
  ))
}

function deleteFromStorage(key: string) {
  localStorage.removeItem(key)

  window.dispatchEvent(new CustomEvent(
    LOCAL_STORAGE_CHANGED_EVENT_NAME,
    {
      detail: { key, value: null},
    }
  ))
}

// -- Return Interface --
interface localStorageReturn<Type> {
  state: Type | null,
  write: (value: Type) => void,
  delete: (key: string) => void,
}

// -- Hook --

function tryParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function useLocalStorage<Type>(key: string, defaultValue?: Type): localStorageReturn<Type> {
  const [localState, updateState] = useState<Type | null>(
    localStorage.getItem(key) === null
      ? defaultValue
      : tryParse(localStorage.getItem(key)!)
  )

  const onLocalStorageChange = useCallback((event: any | StorageEvent) => {
    if (!!event && event.type === LOCAL_STORAGE_CHANGED_EVENT_NAME) {
      if (event.detail.key === key) {
        updateState(event.detail.value)
      }
    } else {
      if (event.key === key) {
        updateState(event.newValue === null ? null : tryParse(event.newValue))
      }
    }
  }, [updateState, key])

  useEffect(() => {
    const listener = (e: Event) => {
      onLocalStorageChange(e)
    };

    window.addEventListener(LOCAL_STORAGE_CHANGED_EVENT_NAME, listener);
    window.addEventListener('storage', listener);

    if (localStorage.getItem(key) === null && defaultValue !== null) {
      writeStorage(key, defaultValue);
    }

    return () => {
      window.removeEventListener(LOCAL_STORAGE_CHANGED_EVENT_NAME, listener);
      window.removeEventListener('storage', listener);
    };
  }, [key, defaultValue, onLocalStorageChange]);

  const writeState = useCallback(
    (value: Type) => writeStorage(key, value),
  [key])

  const deleteState = useCallback(
    () => deleteFromStorage(key),
  [key])

  const state: TValue | null = localState ?? defaultValue;

  return {
    value: state,
    write: writeState,
    delete: deleteState,
  }
}

export default useLocalStorage
