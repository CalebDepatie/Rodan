import React, { useState } from 'react'
import { ipcRenderer } from 'electron'
import { toast } from 'react-toastify'
import { InputText, Button, Card } from '../../Components'
import { useShortcut } from '../../Hooks'

let submitted = false

export function Login(props:{}) {
  const [ pass, setPass ] = useState<string>('')
  const [ isSubmitted, setIsSubmitted ] = useState(submitted)

  const submit = async () => {
    const res = await ipcRenderer.invoke('ssh-open', {password:pass});
    if (res.error != null) {
      toast.error("Could not connect: " + res.error.message)
      return;
    }
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
