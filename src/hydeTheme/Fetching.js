
import React, { PropTypes } from 'react';

const Fetching = ({ isFetching }) =>
	!!isFetching && (<p>Loading...</p>)
;

Fetching.propTypes = {
	isFetching: PropTypes.bool,
};

export default Fetching;
