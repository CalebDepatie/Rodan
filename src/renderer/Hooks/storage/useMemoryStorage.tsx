import { useEffect, useState, useCallback } from 'react'
import { useStorage } from "./storageSkeleton"
import type { storageInterface, storageReturn } from "./storageSkeleton"

// -- Storage Wrappers --
function tryParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

let memory = new Map<string, string>();

class memoryStorage<T> implements storageInterface<T> {
  updateEventName = "memory_storage_changed";

  getState = async (key: string) => {
    const el = memory.get(key)
    return tryParse(el)
  };

  writeStorage = async (key: string, val: T) => {
    memory.set(key, (typeof val === 'object' ? JSON.stringify(val) : `${val}`))
  };

  deleteFromStorage = async (key: string) => {
    memory.delete(key)
  };
}

// -- Hook --

function useMemoryStorage<Type>(key: string, defaultValue?: Type): storageReturn<Type> {
  const storage = new memoryStorage<Type>();
  return useStorage<memoryStorage<Type>>(storage, key, defaultValue);
}

export default useMemoryStorage
