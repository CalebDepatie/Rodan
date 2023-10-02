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

    <Card>
      <img src="assets/icon.png" style={{width:"230px", height:"230px"}}
              onClick={() => {
                radioWaveMonster.play()
              }}/>
    </Card>
  </div>
	)
}
