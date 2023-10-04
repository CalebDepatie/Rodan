import React from 'react';

import { getVersion } from 'common';

import "./footer.scss"


interface FooterProps {}

export function Footer(props: FooterProps) {
	return (
    <footer className="r-footer">
      <p>
        RI Version: {getVersion()}
      </p>
    </footer>
	);
}
