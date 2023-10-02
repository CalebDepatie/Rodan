import { ipcRenderer } from 'electron'
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

// the one thing to keep in mind for file storage, is that each key is a file
// this is primarily to simplify caching, which this is for
class fileStorage<T> implements storageInterface<T> {
  updateEventName = "file_storage_changed";

  getState = async (key: string) => {
    return await ipcRenderer.invoke('file-get', {key: key})
  };

  writeStorage = async (key: string, val: T) => {
    await ipcRenderer.invoke('file-save', {key: key, value: val})
  };

  deleteFromStorage = async (key: string) => {
    await ipcRenderer.invoke('file-del', {key: key})
  };
}

// -- Hook --

function useFileStorage<Type>(key: string, defaultValue?: Type): storageReturn<Type> {
  const storage = new fileStorage<Type>();
  return useStorage<fileStorage<Type>>(storage, key, defaultValue);
}

export default useFileStorage
