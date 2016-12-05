
import React, { PropTypes } from 'react';
import Fetching from './Fetching';
import ErrorMessage from './ErrorMessage';

const PostView = ({ post, isFetching, errorMessage }) =>
	<div>
		<Fetching isFetching={isFetching} />
		<ErrorMessage errorMessage={errorMessage} />
		{!isFetching && !errorMessage &&
			<div>{post.body}</div>
		}
	</div>
;

PostView.propTypes = {
	post: PropTypes.shape({
		body: PropTypes.string.isRequired,
	}).isRequired,
	isFetching: PropTypes.bool,
	errorMessage: PropTypes.string,
};

export default PostView;
