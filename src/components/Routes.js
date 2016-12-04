
import React, { PropTypes } from 'react';
import { Router, Route } from 'react-enroute';
import PostsList from 'components/PostsList';
import Post from 'components/Post';
import getConfigs from 'utils/getConfigs';

const ensurePath = (path) => {
	const { pages } = getConfigs();
	const page = pages.find(({ baseName, link }) => path === baseName && link);
	return ('/' + (page ? page.link : path)).replace(/\/+/, '/');
};

const Routes = ({ routes, location, pageComponent: PageView }) =>
	routes.length > 0 && (
		<Router location={location}>
			<Route path="*" component={PageView}>
				{routes.reduce((children, { baseName, type }) => {
					const isDir = type === 'dir';
					const path = ensurePath(baseName);

					children.push(
						<Route
							path={path}
							key={path}
							component={isDir ? PostsList : Post}
						/>
					);

					if (isDir) {
						const path = ensurePath(`${baseName}/:name`);
						children.push(
							<Route
								path={path}
								key={path}
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
	routes: PropTypes.array,
};

export default Routes;
