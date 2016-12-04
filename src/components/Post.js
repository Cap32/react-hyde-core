
import React, { PureComponent, PropTypes } from 'react';
import { postStore } from 'utils/store';
import { fetchPost } from 'utils/actions';
import fetch from 'utils/fetch';
import componentsRegistry from 'utils/componentsRegistry';

@postStore.hoc('post')
@fetch()
export default class Post extends PureComponent {
	static propTypes = {
		params: PropTypes.shape({
			name: PropTypes.string,
		}),
		location: PropTypes.string,
	};

	View = componentsRegistry.get('PostView');

	fetch() {
		const { params: { name }, location } = this.props;
		return fetchPost(location, name);
	}

	render() {
		const { props: { post, ...other }, View } = this;

		return (
			<View {...post} {...other} />
		);
	}
}
