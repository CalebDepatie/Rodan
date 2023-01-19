import React, { useRef, useState } from 'react';
import path from 'path'
<<<<<<< HEAD:src/renderer/Modules/Home/home.tsx

import { Sound } from "../../Components";
=======
import { ipcRenderer } from 'electron'
import { Sound, InputText, Button } from "../Components"
>>>>>>> 8cc0118e24a2858d594566e26b8c630a20e8feab:src/renderer/Modules/home.tsx

export function Home() {
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
<<<<<<< HEAD:src/renderer/Modules/Home/home.tsx
=======

export default Home
>>>>>>> 8cc0118e24a2858d594566e26b8c630a20e8feab:src/renderer/Modules/home.tsx
