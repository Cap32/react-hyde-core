
import { pick, defaults } from 'lodash';
// import getConfigs from 'utils/getConfigs';

const matchSortingIdRegExp = /^(\d+)-/;
const matchExtnameRegExp = /\.\w+$/;

const decodeContent = (src) => decodeURIComponent(escape(atob(src)));

export default function parsePost(post) {
	post = pick(post, [
		'type', 'name', 'path', 'sha', 'link', 'baseName', 'displayName',
		'content',
	]);
	const { name = post.baseName, content } = post;

	/*
	 * name: '20161024-wonderful_world.md'
	 *
	 * baseName: '20161024-wonderful_world'
	 * link: '/20161024-wonderful_world'
	 * extension: '.md'
	 * displayName: 'wonderful world'
	 * sortingId: 20161024
	 */
	if (name) {
		defaults(post, {
			extension: '',
			sortingId: 0,
		});

		const baseName = post.baseName || name
			.replace(matchExtnameRegExp, (extension) => {
				post.extension = extension;
				return '';
			})
		;

		post.baseName = baseName;

		const displayName = baseName
			.replace(matchSortingIdRegExp, (m, sortingId) => {
				post.sortingId = +sortingId;
				return '';
			})
			.replace(/_/g, ' ')
		;

		if (!post.displayName) { post.displayName = displayName; }

		if (!post.link) { post.link = `/${baseName}`.replace(/\/+/g, '/'); }
	}

	if (content) { post.content = decodeContent(post.content); }

	return post;
}
