
import React, { PureComponent } from 'react';
import componentsRegistry from 'utils/componentsRegistry';
import fetch from 'utils/fetch';
import { postsList } from 'utils/store';
import { fetchPostsList } from 'utils/actions';

@postsList.hoc('posts')
@fetch()
export default class PostsList extends PureComponent {
	View = componentsRegistry.get('PostsListView');

	fetch() {
		return fetchPostsList();
	}

	render() {
		const { props: { posts, ...other }, View } = this;

		return (
			<View {...posts} {...other} />
		);
	}
}
