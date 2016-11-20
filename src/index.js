
import React from 'react';
import { render } from 'react-dom';
import Root from 'components/Root';
import Wormhole from 'react-wormhole-hoc';

export location from 'utils/location';
export componentsRegistry from 'utils/componentsRegistry';

export const compose = Wormhole.compose;

export function bootstrap() {
	const mount = document.getElementById('mount');

	if (__DEV__) {
		(function () {
			const { AppContainer } = require('react-hot-loader');
			render(<AppContainer><Root /></AppContainer>, mount);

			if (module.hot) {
				module.hot.accept('./components/Root', () => {
					const Root = require('./components/Root').default;
					render(
						<AppContainer><Root /></AppContainer>,
						mount
					);
				});
			}
		}());
	}
	else {
		render(<Root />, mount);
	}
}
