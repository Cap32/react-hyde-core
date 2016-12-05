
import React, { PropTypes } from 'react';
import Link from './Link';

const Menu = ({ menu }) =>
	<ul>
		{menu.map(({ path, label }, index) =>
			<li key={index}>
				<Link href={path}>{label}</Link>
			</li>
		)}
	</ul>
;

Menu.propTypes = {
	menu: PropTypes.array,
};

export default Menu;
