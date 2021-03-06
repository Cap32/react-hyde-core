
import React, { PropTypes } from 'react';
import Link from './Link';
import Fetching from './Fetching';
import ErrorMessage from './ErrorMessage';

const PostView = ({ posts, isFetching, errorMessage }) =>
	<div>
		<Fetching isFetching={isFetching} />
		<ErrorMessage errorMessage={errorMessage} />
		{!isFetching && !errorMessage &&
			<ul>
				{posts.map(({ body, title, number }) =>
					<li key={number}>
						<Link href={`/posts/${number}`}>{title}</Link>
					</li>
				)}
			</ul>
		}
	</div>
;

PostView.propTypes = {
	posts: PropTypes.array,
	isFetching: PropTypes.bool,
	errorMessage: PropTypes.string,
};

export default PostView;
