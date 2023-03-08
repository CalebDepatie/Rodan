import { useRef } from 'react'

function useSound(audiofile:string): Audio {
  const audio = useRef(new Audio(audiofile))

  return audio.current
}

export default useSound
