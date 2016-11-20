
import React, { PureComponent } from 'react';
import { askArticles } from 'utils/askAPIs';
import parsePost from 'utils/parsePost';
import fetch from 'utils/fetch';
import Routes from 'components/Routes';
import getConfigs from 'utils/getConfigs';
import componentsRegistry from 'utils/componentsRegistry';
import location from 'utils/location';

const { pushState } = history;
history.pushState = (state, ...rest) => {
	if (typeof history.onpushstate === 'function') {
		process.nextTick(() => history.onpushstate({ state }));
	}
	return pushState.call(history, state, ...rest);
};

@fetch({ shouldRefetch: false })
export default class Root extends PureComponent {
	View = componentsRegistry.get('AppView');

	state = {
		children: null,
		menu: [],
		routes: [],
		isFetching: false,
		errorMessage: '',
	};

	fetch(execAsk, complete) {
		const { pages } = getConfigs();

		const getPages = pages.length ?
			Promise.resolve(pages) : execAsk(askArticles.clone())
		;

		return getPages.then((list) => {
			const { menu, routes } = list
				.map(parsePost)
				.reduce((state, { link, baseName, displayName, type }) => {
					const { menu, routes } = state;
					menu.push({ link, displayName });
					routes.push({ baseName, type });
					return state;
				}, {
					menu: [],
					routes: [],
				})
			;

			complete({
				menu,
				routes,
				children: this._renderChildren({
					routes,
					location: location.get(),
				}),
			});
		});
	}

	_renderChildren(props) {
		return (<Routes {...props} />);
	}

	_handleRouteChange = () => {
		location.set(window.location.pathname);
		this.setState({
			children: this._renderChildren({
				location: location.get(),
				routes: this.state.routes,
			}),
		});
	}

	componentDidMount() {
		window.onpopstate = history.onpushstate = this._handleRouteChange;
	}

	render() {
		const { View, state } = this;
		return (
			<View {...state} />
		);
	}
}
