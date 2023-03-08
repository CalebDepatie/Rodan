import { useEffect, useState, useCallback } from 'react';
import { useStorage } from "./storageSkeleton";
import type { storageInterface, storageReturn } from "./storageSkeleton"

// -- Storage Wrappers --
function tryParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

class localStorageC<T> implements storageInterface<T> {
  updateEventName = "local_storage_changed";

  getState = (key: string) => {
    const el = localStorage.getItem(key)
    return tryParse(el)
  };

  writeStorage = (key: string, val: T) => {
    localStorage.setItem(key,
      typeof val === 'object' ? JSON.stringify(val) : `${val}`)
  };

  deleteFromStorage = (key: string) => {
    localStorage.removeItem(key)
  };
}

// -- Hook --

function useLocalStorage<Type>(key: string, defaultValue?: Type): storageReturn<Type> {
  const storage = new localStorageC<Type>();
  return useStorage<localStorageC<Type>>(storage, key, defaultValue);
}

export default useLocalStorage
