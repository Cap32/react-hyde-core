
import React, { PropTypes } from 'react';
import Menu from './Menu';

const App = ({ pages, children, isFetching, errorMessage }) =>
	<div>
		{isFetching && <p>loading...</p>}
		{errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
		{!isFetching && !errorMessage && <Menu menu={pages} />}
		{children}
	</div>
;

App.propTypes = {
	pages: PropTypes.array,
	children: PropTypes.node,
	isFetching: PropTypes.bool,
	errorMessage: PropTypes.string,
};

export default App;
