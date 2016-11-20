
import Wormhole from 'react-wormhole-hoc';

export const pagesStore = new Wormhole({
	pages: [],
	isFetching: false,
});

export const postStore = new Wormhole({
	post: { content: '' },
	isFetching: false,
});

export const postsList = new Wormhole({ posts: [], isFetching: false });
export const errorMessage = new Wormhole('');
export const fetchings = new Wormhole([]);
