
import React, { PropTypes } from 'react';
import { Router, Route } from 'react-enroute';
import PostsList from 'components/PostsList';
import Post from 'components/Post';
import getConfigs from 'utils/getConfigs';

const { pages } = getConfigs();
const ensurePath = (path) => `/${path}`.replace(/\/+/, '/');

const Routes = ({ location, pageComponent: PageView }) =>
	pages.length > 0 && (
		<Router location={location}>
			<Route path="*" component={PageView}>
				{pages.reduce((children, { path, type }) => {
					const isDir = type !== 'issue';
					const finalPath = ensurePath(path);

					children.push(
						<Route
							path={finalPath}
							key={finalPath}
							component={isDir ? PostsList : Post}
						/>
					);

					if (isDir) {
						const finalPath = ensurePath(`${path}/posts/:number`);
						children.push(
							<Route
								path={finalPath}
								key={finalPath}
								component={Post}
							/>
						);
					}

					return children;
				}, [])}
			</Route>
		</Router>
	)
;

Routes.propTypes = {
	location: PropTypes.string,
	pageComponent: PropTypes.func,
};

export default Routes;
