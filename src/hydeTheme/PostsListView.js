
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
				{posts.map(({ displayName, link }) =>
					<li key={link}>
						<Link href={`/posts${link}`}>{displayName}</Link>
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
