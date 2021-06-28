import React from 'react';

import { version } from '../../package.json';

function Footer(props: any) {
	return (
	<div className="footer">
      <footer className="py-1 bg-dark fixed-bottom">
        <div className="container">
          <p className="m-0 text-left text-white">
            RI Version: {version}
          </p>
        </div>
      </footer>
    </div>
	);
}

export default Footer;
