
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import assign from 'lodash/assign';

const extend = (src = {}, dist = {}) => Object
	.keys(dist)
	.reduce((results, key) => {
		const value = dist[key];

		if (isFunction(results[key]) && isFunction(value)) {
			const prev = results[key];
			results[key] = function (...args) {
				value.apply(this, args);
				return prev.apply(this, args);
			};
		}
		else if (isObject(results[key]) && isObject(value)) {
			results[key] = assign({}, value, results[key]);
		}
		else {
			results[key] = value;
		}
		return results;
	}, src)
;

export default (instanceProps, staticProps) => (target) => {
	const proto = target.prototype;
	extend(target, staticProps);
	if (proto) {
		extend(proto, instanceProps);
	}
};
