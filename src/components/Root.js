
import React, { PureComponent, PropTypes } from 'react';
import { pagesStore } from 'utils/store';
import fetch from 'utils/fetch';
import { fetchPages } from 'utils/actions';
import Routes from 'components/Routes';
import componentsRegistry from 'utils/componentsRegistry';
import location from 'utils/location';

const { pushState } = history;
history.pushState = (state, ...rest) => {
	if (typeof history.onpushstate === 'function') {
		process.nextTick(() => history.onpushstate({ state }));
	}
	return pushState.call(history, state, ...rest);
};

@pagesStore.hoc({
	injectProp: 'pages',
	select: ({ pages, ...other }) => pages
		.reduce((state, { link, baseName, displayName, type }) => {
			const { menu, routes } = state;
			menu.push({ link, displayName });
			routes.push({ baseName, type });
			return state;
		}, {
			...other,
			menu: [],
			routes: [],
		})
	,
})
@fetch({ shouldRefetch: false })
export default class Root extends PureComponent {
	static propTypes = {
		pages: PropTypes.object,
	};

	state = {
		children: null,
	};

	View = componentsRegistry.get('AppView');
	PageView = componentsRegistry.get('PageView');

	fetch() {
		return fetchPages();
	}

	componentWillReceiveProps({ pages: { routes } }) {
		if (routes.length && this.props.pages.routes !== routes) {
			this.setState({
				children: this._renderChildren({
					routes,
					location: location.get(),
					pageComponent: this.PageView,
				}),
			});
		}
	}

	_renderChildren(props) {
		return (<Routes {...props} />);
	}

	_handleRouteChange = () => {
		location.set(window.location.pathname);
		this.setState({
			children: this._renderChildren({
				location: location.get(),
				routes: this.props.pages.routes,
				pageComponent: this.PageView,
			}),
		});
	}

	componentDidMount() {
		window.onpopstate = history.onpushstate = this._handleRouteChange;
	}

	render() {
		const { View, state, props: { pages } } = this;
		return (
			<View {...state} {...pages} />
		);
	}
}
