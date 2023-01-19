import React, { useState } from 'react'
import { ipcRenderer } from 'electron'
import { InputText, Button, Card } from '../../Components'

export function Login(props:{}) {
  const [ pass, setPass ] = useState<string>('')

  const submit = async () => {
    ipcRenderer.invoke('ssh-open', {password:pass})
  }

  return (
    <Card title="Login">

      <InputText type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
      <Button label="Submit" onClick={submit} />
    </Card>
  )
}
