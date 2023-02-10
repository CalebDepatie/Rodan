import React, { useState } from 'react'
import { ipcRenderer } from 'electron'
import { InputText, Button, Card } from '../../Components'
import { useShortcut } from '../../Hooks'

let submitted = false

export function Login(props:{}) {
  const [ pass, setPass ] = useState<string>('')
  const [ isSubmitted, setIsSubmitted ] = useState(submitted)

  const submit = async () => {
    const res = await ipcRenderer.invoke('ssh-open', {password:pass})
    submitted = true
    setIsSubmitted(submitted)
  }

  useShortcut(["Enter", "NumpadEnter"], submit, [pass])

  return (
    <Card title="Login">

      {!isSubmitted ? <>
        <InputText type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
        <Button type="submit" label="Submit" onClick={submit} />
        </>
        : <>
          Logged In
        </>
      }
    </Card>
  )
}
