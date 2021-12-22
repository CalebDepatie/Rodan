import React from 'react';

import { version } from '../../package.json';

import { Tooltip } from './tooltip';

function Footer(props: any) {
	return (
	<div className="footer">
      <footer className="py-1 bg-dark fixed-bottom">
        <div className="container">
          <p className="m-0 text-left text-white">
            <Tooltip content="test">
            RI Version: {version}
            </Tooltip>
          </p>
        </div>
      </footer>
    </div>
	);
}

export default Footer;
