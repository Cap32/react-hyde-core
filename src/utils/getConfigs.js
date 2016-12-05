
import { once, defaults } from 'lodash';

const configs = process.env.HYDE;

const getConfigs = once(() => defaults(configs, {
	pages: [],
	github: {},
}));

export default getConfigs;
