import React, { useRef } from 'react';
import path from 'path'
import { Sound, Card } from "../../Components"
import { Login } from "./login"

import "./home.scss"

export const Home = () => {
  let radioWaveMonster = useRef<any>(null);

	return (
	<div className="r-home">
    <Login />

    <Card>
      <Sound ref={radioWaveMonster} soundFile="assets/RODAN RODAN RADIO WAVE MONSTER.mp3" />
      <img src="assets/icon.png" style={{width:"230px", height:"230px"}}
              onClick={() => {
                radioWaveMonster.current!.play()
              }}/>
    </Card>
  </div>
	)
}
