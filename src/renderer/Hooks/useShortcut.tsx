import { useEffect } from 'react'

function useShortcut(codes:string[], callback:()=>void, depends:any[]) {
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
