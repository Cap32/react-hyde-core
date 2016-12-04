
import {
	postStore, pagesStore, postsListStore, errorMessage,
} from './store';
import { askArticles } from 'utils/askAPIs';
import parsePost from 'utils/parsePost';
import MemoryCache from 'utils/MemoryCache';
import noop from 'lodash';
import { Cancellation } from 'http-ask';
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

export const fetchPostsList = () => ({ getCancellation }) => {
	const cacheKey = '_list';

	if (cache.has(cacheKey)) {
		const value = cache.get(cacheKey);
		postsListStore.set(value);
		return value;
	}

	postsListStore.set({
		posts: [],
		isFetching: true,
	});

	return askArticles
		.clone()
		.url('posts')
		.cancellation(getCancellation())
		.exec()
		.then((dataList) => {
			const posts = dataList
				.filter(({ type }) => type === 'file')
				.map(parsePost)
				.sort((a, b) => a.sortingId - b.sortingId < 0 ? 1 : -1)
			;
			const value = {
				posts,
				isFetching: false,
			};
			cache.set(cacheKey, value);
			postsListStore.set(value);
			return value;
		})
		.catch((err) => {
			catchError(err, (msg) => {
				postsListStore.set({
					posts: [],
					isFetching: false,
				});
				errorMessage.set(msg);
			});
		})
	;
};

export const fetchPost = (location) => async ({ getCancellation }) => {
	const cacheKey = location;

	if (cache.has(cacheKey)) {
		postStore.set(cache.get(cacheKey));
		return noop;
	}

	postStore.set({
		post: { content: '' },
		isFetching: true,
	});

	try {
		const ask = askArticles.clone().url(resolveLocation(location));
		const data = await ask.cancellation(getCancellation()).exec();
		const post = parsePost(data);
		const value = {
			post,
			isFetching: false,
		};
		cache.set(cacheKey, value);
		postStore.set(value);
	}
	catch (err) {
		catchError(err, (msg) => {
			postStore.set({
				post: { content: '' },
				isFetching: false,
			});
			errorMessage.set(msg);
		});
	}
};

export const fetchPages = () => ({ getCancellation }) => {
	const cacheKey = '_pages';

	if (cache.has(cacheKey)) { return noop; }

	pagesStore.set({
		pages: [],
		isFetching: true,
	});

	const { pages } = getConfigs();

	const getPages = pages.length ? Promise.resolve(pages) :
		askArticles.clone().cancellation(getCancellation()).exec()
	;

	return getPages
		.then((list) => {
			pagesStore.set({
				pages: list.map(parsePost),
				isFetching: false,
			});
		})
		.catch((err) => {
			catchError(err, (msg) => {
				pagesStore.set({
					pages: [],
					isFetching: false,
				});
				errorMessage.set(msg);
			});
		})
	;
};
