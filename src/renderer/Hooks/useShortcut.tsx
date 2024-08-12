import { useDebugValue, useEffect } from 'react'

function useShortcut(codes:string[], callback:()=>void, depends:any[]) {
  useDebugValue("Handling shortcut: " + codes.join(", "))
  
  useEffect(() => {

    const listener = (evt:any) => {
      if (codes.some((val) => val == evt.code)) {
        evt.preventDefault()
        callback()
      }
    }

    document.addEventListener("keydown", listener)

    return () => {
      document.removeEventListener("keydown", listener)
    }
  }, depends)
}

export default useShortcut
