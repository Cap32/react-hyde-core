
import React, { PureComponent } from 'react';
import { askArticles } from 'utils/askAPIs';
import parsePost from 'utils/parsePost';
import fetch from 'utils/fetch';
import componentsRegistry from 'utils/componentsRegistry';
import MemoryCache from 'utils/MemoryCache';

const cache = new MemoryCache();
const cacheKey = 'posts';

@fetch()
export default class PostsList extends PureComponent {
	View = componentsRegistry.get('PostsListView');

	state = {
		posts: [],
		isFetching: false,
		errorMessage: '',
	};

	fetch(execAsk, complete) {
		if (cache.has(cacheKey)) {
			return complete({ posts: cache.get(cacheKey) });
		}

		return execAsk(askArticles.clone().url('posts')).then((dataList) => {
			const posts = dataList
				.filter(({ type }) => type === 'file')
				.map(parsePost)
				.sort((a, b) => a.sortingId - b.sortingId < 0 ? 1 : -1)
			;
			cache.set(cacheKey, posts);
			complete({ posts });
		});
	}

	render() {
		const { state, props, View } = this;

		return (
			<View {...state} {...props} />
		);
	}
}
