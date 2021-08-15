import React, { useRef } from 'react';

import { Sound } from "../Components";

function Home() {
  let radioWaveMonster = useRef<any>(null);

	return (
	<div className="home">
      <div className="container">
        <div className="row align-items-center my-5">
          <div className="col-lg-5">
            <h1 className="font-weight-light">Rodan Initiative</h1>
            <p>
              Project Singular Point is a project to be able to access other projects, especially data, from one app. The Rodan Initiative is the C&C application itself. The name of this project and it's derivitives are inspired by the show "Godzilla Singular Point".
            </p>
          </div>
          <div className="col-lg-7">
            <Sound ref={radioWaveMonster} soundFile={"RODAN RODAN RADIO WAVE MONSTER.mp3"} />
            <img src="icon.png" className="img-fluid rounded mb-4 mb-lg-0"
              onClick={() => {
                radioWaveMonster.current!.play()
              }}/>
          </div>
        </div>
      </div>
    </div>
	);
}

export default Home;
