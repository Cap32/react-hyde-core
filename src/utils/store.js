
import Wormhole from 'react-wormhole-hoc';
import getConfigs from 'utils/getConfigs';

const { pages } = getConfigs();

export const pagesStore = new Wormhole({ pages });

export const postStore = new Wormhole({
	post: { title: '', body: '' },
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

postStore.subscribe(maybeFetching);
postsListStore.subscribe(maybeFetching);
