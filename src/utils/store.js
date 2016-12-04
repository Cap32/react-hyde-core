
import Wormhole from 'react-wormhole-hoc';

export const pagesStore = new Wormhole({
	pages: [],
	isFetching: false,
});

export const postStore = new Wormhole({
	post: { content: '' },
	isFetching: false,
});

export const postsListStore = new Wormhole({ posts: [], isFetching: false });
export const errorMessage = new Wormhole('');
export const fetchings = new Wormhole([]);

const maybeFetching = (nextValue, prevValue) => {
	const { isFetching } = nextValue;
	const prevIsFetching = prevValue.isFetching;

	if (isFetching !== prevIsFetching) {
		const prev = fetchings.get();
		fetchings.set(isFetching ? prev.concat(true) : prev.slice(1));
	}
};

pagesStore.subscribe(maybeFetching);
postStore.subscribe(maybeFetching);
postsListStore.subscribe(maybeFetching);
