import { useRef, useDebugValue } from 'react'

function useSound(audiofile:string): Audio {
  useDebugValue("loaded file: " + audiofile);
  
  const audio = useRef(new Audio(audiofile))

  return audio.current
}

export default useSound
