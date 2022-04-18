import React, { useRef, RefObject } from 'react';

// class required to leverage ref
class Sound extends React.Component<{soundFile:any}, {}> {
  audio: RefObject<any>;

  constructor(props:{soundFile:any}) {
    super(props);

    this.audio = React.createRef();
  }

  play() {
    this.audio.current.play();
  };

  render() {
    return (
      <audio ref={this.audio} src={this.props.soundFile}/>
    );
  }
};

export default Sound;
