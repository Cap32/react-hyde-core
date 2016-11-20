
import React, { PropTypes } from 'react';
import Menu from './Menu';

const App = ({ menu, children, isFetching, errorMessage }) =>
	<div>
		{isFetching && <p>loading...</p>}
		{errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
		{!isFetching && !errorMessage && <Menu menu={menu} />}
		{children}
	</div>
;

App.propTypes = {
	menu: PropTypes.array,
	children: PropTypes.node,
	isFetching: PropTypes.bool,
	errorMessage: PropTypes.string,
};

export default App;
