import React from 'react';

import { getVersion } from 'common';
import { Tooltip } from '../tooltip';

import "./footer.scss"

export function Footer(props: {}) {
	return (
    <footer className="r-footer">
      <p>
        RI Version: {getVersion()}
      </p>
    </footer>
	);
}
