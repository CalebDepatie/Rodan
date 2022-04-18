import React from 'react';

import { getVersion } from 'common';

import { Tooltip } from './tooltip';

function Footer(props: any) {
	return (
	<div className="footer">
      <footer className="py-1 bg-dark fixed-bottom">
        <div className="container">
          <p className="m-0 text-left text-white">
            RI Version: {getVersion()}
          </p>
        </div>
      </footer>
    </div>
	);
}

export default Footer;
