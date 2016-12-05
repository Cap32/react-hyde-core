
import {
	postStore, postsListStore, errorMessage,
} from './store';
import location from 'utils/location';
import { askIssues } from 'utils/askAPIs';
import MemoryCache from 'utils/MemoryCache';
import { Cancellation } from 'http-ask';
import getConfigs from 'utils/getConfigs';

const cache = new MemoryCache({ max: 20 });
const { pages } = getConfigs();

const catchError = (err, update) => {
	if (err instanceof Cancellation) {
		__DEV__ && console.warn('request cancelled.');
	}
	else {
		update(err.message || 'Error');
	}
};

const match = () => {
	const pathname = location.get();
	const page = pages.find(({ path }) => path === pathname);

	if (!page) { throw new Error('Not found'); }

	return page;
};

export const fetchPostsList = () => ({ getCancellation }) => {
	const { type, number } = match();

	const cacheKey = `${type}::${number}`;

	if (cache.has(cacheKey)) {
		const value = cache.get(cacheKey);
		postsListStore.set(value);
		return value;
	}

	postsListStore.set({
		posts: [],
		isFetching: true,
	});

	return askIssues
		.clone()
		.query({ [type]: number })
		.cancellation(getCancellation())
		.exec()
		.then((posts) => {
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

export const fetchPost = (number) => async ({ getCancellation }) => {
	if (!number) { number = match().number; }

	const cacheKey = number;

	if (cache.has(cacheKey)) {
		const value = cache.get(cacheKey);
		postStore.set(value);
		return value;
	}

	postStore.set({
		post: { body: '', title: '' },
		isFetching: true,
	});

	try {
		const ask = askIssues.clone().url(number);
		const post = await ask.cancellation(getCancellation()).exec();
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
				post: { body: '', title: '' },
				isFetching: false,
			});
			errorMessage.set(msg);
		});
	}
};
