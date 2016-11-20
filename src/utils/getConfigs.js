
import { once, defaults } from 'lodash';

const configs = process.env.HYDE;

const getConfigs = once(() => defaults(configs, {
	pages: [],
	resolve: {
		extension: '.md',
	},
	github: {},
}));

export default getConfigs;

export const resolveLocation = (location) => {
	const { extension } = getConfigs().resolve;

	if (extension && !location.endsWith(extension)) {
		location += extension;
	}

	return location.replace(/^\//, '');
};
