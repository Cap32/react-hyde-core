
import React, { PureComponent, PropTypes } from 'react';
import { askBlobs, askArticles } from 'utils/askAPIs';
import parsePost from 'utils/parsePost';
import fetch from 'utils/fetch';
import { resolveLocation } from 'utils/getConfigs';
import componentsRegistry from 'utils/componentsRegistry';
import MemoryCache from 'utils/MemoryCache';

const cache = new MemoryCache({ max: 20 });

@fetch()
export default class Post extends PureComponent {
	static propTypes = {
		params: PropTypes.shape({
			sha: PropTypes.string,
		}),
		location: PropTypes.string,
	};

	View = componentsRegistry.get('PostView');

	state = {
		post: { content: '' },
		isFetching: false,
		errorMessage: '',
	};

	fetch(execAsk, complete) {
		const { params: { sha }, location } = this.props;

		if (cache.has(location)) {
			return complete({ post: cache.get(location) });
		}

		const ask = sha ?
			askBlobs.clone().url(sha) :
			askArticles.clone().url(resolveLocation(location))
		;

		return execAsk(ask).then((data) => {
			const post = parsePost(data);
			cache.set(location, post);
			complete({ post });
		});
	}

	render() {
		const { state, props, View } = this;

		return (
			<View {...props} {...state} />
		);
	}
}
