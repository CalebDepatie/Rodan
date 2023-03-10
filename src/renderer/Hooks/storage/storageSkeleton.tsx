import { useEffect, useState, useCallback } from 'react';

// -- Interfaces --
interface storageReturn<Type> {
  value: Type | null,
  write: (value: Type) => void,
  delete: (key: string) => void,
}

interface storageInterface<T> {
  getState: (key: string) => Promise<T>,
  writeStorage: (key: string, val: T) => Promise<void>,
  deleteFromStorage: (key: string) => Promise<void>,
  updateEventName: string,
}

// -- Hook --
function useStorage<Type, StorageType extends storageInterface>(storage: StorageType,
  key: string, defaultValue?: Type): localStorageReturn<Type> {

  const [localState, updateState] = useState<Type | null>()

  // initialization
  useEffect(() => {
    const fn = async () => {
      const data = await storage.getState(key)
      updateState(data == {} ? defaultValue : data!)
    }
    fn()
  }, [])

  const onStorageChange = useCallback((event: any | StorageEvent) => {
    if (!!event && event.type === storage.updateEventName) {
      if (event.detail.key === key) {
        updateState(event.detail.value)
      }
    } else {
      if (event.key === key) {
        updateState(event.newValue)
      }
    }
  }, [updateState, key])

  useEffect(() => {
    const listener = (e: Event) => {
      onStorageChange(e)
    };

    window.addEventListener(storage.updateEventName, listener);
    window.addEventListener('storage', listener);

    if (storage.getState(key) === null && defaultValue !== null) {
      storage.writeStorage(key, defaultValue);
    }

    return () => {
      window.removeEventListener(storage.updateEventName, listener);
      window.removeEventListener('storage', listener);
    };
  }, [key, defaultValue, onStorageChange]);

  const writeState = useCallback(
    async (value: Type) => {
      await storage.writeStorage(key, value)

      window.dispatchEvent(new CustomEvent(
        storage.updateEventName,
        {
          detail: { key, value },
        }
      ))
    },
  [key])

  const deleteState = useCallback(
    async () => {
      await storage.deleteFromStorage(key)

      window.dispatchEvent(new CustomEvent(
        storage.updateEventName,
        {
          detail: { key, value: null},
        }
      ))
    },
  [key])

  const state: Type | null = localState ?? defaultValue;

  return {
    value: state,
    write: writeState,
    delete: deleteState,
  }
}

export { useStorage }
export type { storageInterface, storageReturn }
