
import AppView from 'hydeTheme/AppView';
import PageView from 'hydeTheme/PageView';
import PostsListView from 'hydeTheme/PostsListView';
import PostView from 'hydeTheme/PostView';

const components = {
	AppView,
	PageView,
	PostsListView,
	PostView,
};

export default {
	register(name, component) {
		return components[name] = component;
	},

	get(name) {
		if (!components.hasOwnProperty(name)) {
			throw new Error(`Component "${name}" NOT found.`);
		}
		return components[name];
	},
};
