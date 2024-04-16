import React, { useRef } from 'react';
import path from 'path'
import { Card } from "../../Components"
import { Login } from "./login"
import { ClimateClock } from './climate_clock';
import { FinanceCard } from "../Finances"
import { useSound, useMemoryStorage } from "../../Hooks"

import "./home.scss"

export const Home = () => {
  const { value: loggedIn } = useMemoryStorage("login", false)
  const radioWaveMonster = useSound("assets/RODAN RODAN RADIO WAVE MONSTER.mp3")

	return (
	<div className="r-home">
    <Login />

    {
      (loggedIn) ?
      <>
        <FinanceCard />
      </>
      : null
    }
    
    <ClimateClock />

    <Card style={{padding:"0", margin:"20px"}}>
      <img src="assets/icon.png" className="r-card" style={{padding:"0", width:"260px", height:"260px"}}
              onClick={() => {
                radioWaveMonster.play()
              }}/>
    </Card>
  </div>
	)
}
