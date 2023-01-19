import React, { useRef, useState } from 'react';
import path from 'path'
import { ipcRenderer } from 'electron'
import { Sound, InputText, Button } from "../../Components"

export const Home = () => {
  let radioWaveMonster = useRef<any>(null);
  const [ pass, setPass ] = useState<string>('')

  const submit = async () => {
    ipcRenderer.invoke('ssh-open', {password:pass})
  }

	return (
	<div className="r-home">
    <i className="fa fa-hard-hat"/>
    This page is under construction

    <InputText type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
    <Button label="Submit" onClick={submit} />
  </div>
	)
}
