
import React, { PureComponent, PropTypes } from 'react';

export default class Link extends PureComponent {
	static propTypes = {
		href: PropTypes.string,
	};

	_handleClick = (ev) => {
		ev.preventDefault();
		history.pushState(null, '', this.props.href);
	};

	render() {
		return (
			<a {...this.props} onClick={this._handleClick} />
		);
	}
}
