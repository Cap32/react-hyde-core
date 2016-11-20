
import {
	postStore, pagesStore, postsListStore, fetchings, errorMessage,
} from './store';
import { askArticles, askBlobs } from 'utils/askAPIs';
import parsePost from 'utils/parsePost';
import { Cancellation } from 'http-ask';
import MemoryCache from 'utils/MemoryCache';
import noop from 'lodash';
import getConfigs, { resolveLocation } from 'utils/getConfigs';

const cache = new MemoryCache({ max: 20 });

const catchError = (err, update) => {
	if (err instanceof Cancellation) {
		__DEV__ && console.warn('request cancelled.');
	}
	else {
		update(err.message || 'Error');
	}
};

const dropFetching = () => fetchings.set(fetchings.get().slice(1));

const pushFetching = () => fetchings.set(fetchings.get().concat(true));

export const fetchPost = (location, sha) => {
	const cacheKey = location;

	if (cache.has(cacheKey)) { return noop; }

	postStore.set({
		post: { content: '' },
		isFetching: true,
	});
	pushFetching();

	const cancellation = new Cancellation();

	const ask = sha ?
		askBlobs.clone().url(sha) :
		askArticles.clone().url(resolveLocation(location))
	;

	ask
		.cancellation(cancellation)
		.exec()
		.then((data) => {
			const post = parsePost(data);
			cache.set(cacheKey, post);
			postStore.set({
				post,
				isFetching: false,
			});
			dropFetching();
		})
		.catch((err) => {
			catchError(err, (msg) => {
				postStore.set({
					post: { content: '' },
					isFetching: false,
				});
				errorMessage.set(msg);
			});
			dropFetching();
		})
	;

	return cancellation;
};

export const fetchPostsList = () => {
	const cacheKey = '/';

	if (cache.has(cacheKey)) { return noop; }

	postsListStore.set({
		posts: [],
		isFetching: true,
	});
	pushFetching();

	const cancellation = new Cancellation();
	askArticles
		.clone()
		.url('posts')
		.cancellation(cancellation)
		.exec()
		.then((dataList) => {
			const posts = dataList
				.filter(({ type }) => type === 'file')
				.map(parsePost)
				.sort((a, b) => a.sortingId - b.sortingId < 0 ? 1 : -1)
			;
			cache.set(cacheKey, posts);
			postsListStore.set({
				posts,
				isFetching: false,
			});
			dropFetching();
		})
		.catch((err) => {
			catchError(err, (msg) => {
				postsListStore.set({
					posts: [],
					isFetching: false,
				});
				errorMessage.set(msg);
			});
			dropFetching();
		})
	;

	return cancellation;
};

export const fetchPages = () => {
	const cacheKey = '_pages';

	if (cache.has(cacheKey)) { return noop; }

	pagesStore.set({
		pages: [],
		isFetching: true,
	});
	pushFetching();

	const { pages } = getConfigs();
	const cancellation = new Cancellation();

	const getPages = pages.length ? Promise.resolve(pages) :
		askArticles.clone().exec().cancellation(cancellation)
	;

	getPages
		.then((list) => {
			pagesStore.set({
				pages: list.map(parsePost),
				isFetching: false,
			});
			dropFetching();
		})
		.catch((err) => {
			catchError(err, (msg) => {
				pagesStore.set({
					pages: [],
					isFetching: false,
				});
				errorMessage.set(msg);
			});
			dropFetching();
		})
	;

	return cancellation;
};
