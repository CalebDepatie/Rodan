import { ipcRenderer } from 'electron'
import { useEffect, useState } from 'react'
import { useFileStorage } from './storage'

// useCache will automatically cache the data returned from network request,
// and have this readily available the next time the app or page loads

function useCache(endpoint:string, args?:{[key:string]: any}) {

  const regex = /[":{,}]/ig
  const arg_string = JSON.stringify(args ?? "").replaceAll(regex, "").trim()

  const save_path = endpoint + "-" + arg_string

  const { value: fileVal, write: fileWrite } = useFileStorage(save_path, {})

  // reload
  const signal = async () => {
    const data = await ipcRenderer.invoke(endpoint, args)

    fileWrite(data)
  }

  // initialization
  useEffect(() => {
    signal()
  }, [endpoint, args])

  return [
    localVal,
    signal,
  ]
}

export default useCache
