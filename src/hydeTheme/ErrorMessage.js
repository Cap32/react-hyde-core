
import React, { PropTypes } from 'react';

const MessageError = ({ errorMessage }) =>
	!!errorMessage && (<p style={{ color: 'red' }}>{errorMessage}</p>)
;

MessageError.propTypes = {
	errorMessage: PropTypes.string,
};

export default MessageError;
