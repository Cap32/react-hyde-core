
import React, { PureComponent } from 'react';
import Routes from 'components/Routes';
import componentsRegistry from 'utils/componentsRegistry';
import location from 'utils/location';
import getConfigs from 'utils/getConfigs';

const { pages } = getConfigs();

const { pushState } = history;
history.pushState = (state, ...rest) => {
	if (typeof history.onpushstate === 'function') {
		process.nextTick(() => history.onpushstate({ state }));
	}
	return pushState.call(history, state, ...rest);
};

export default class Root extends PureComponent {
	View = componentsRegistry.get('AppView');
	PageView = componentsRegistry.get('PageView');

	componentWillMount() {
		this.state = {
			children: this._renderChildren({
				location: location.get(),
				pageComponent: this.PageView,
			}),
		};
	}

	_renderChildren(props) {
		return (<Routes {...props} />);
	}

	_handleRouteChange = () => {
		location.set(window.location.pathname);
		this.setState({
			children: this._renderChildren({
				location: location.get(),
				pageComponent: this.PageView,
			}),
		});
	}

	componentDidMount() {
		window.onpopstate = history.onpushstate = this._handleRouteChange;
	}

	render() {
		const { View, state } = this;
		return (
			<View {...state} pages={pages} />
		);
	}
}
