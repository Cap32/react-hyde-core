
import React, { PropTypes } from 'react';
import Link from './Link';

const Menu = ({ menu }) =>
	<ul>
		{menu.map(({ link, displayName }, index) =>
			<li key={index}>
				<Link href={link}>{displayName}</Link>
			</li>
		)}
	</ul>
;

Menu.propTypes = {
	menu: PropTypes.array,
};

export default Menu;
