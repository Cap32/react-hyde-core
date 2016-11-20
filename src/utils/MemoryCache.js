
import { pull } from 'lodash';

const _indexes = Symbol('indexes');
const _expireIdMap = Symbol('expireIdMap');
const _cacheMap = Symbol('cacheMap');
const _max = Symbol('max');
const _isAvailable = Symbol('clientOnly');

export default class MemoryCache {
	constructor(options = {}) {
		const {
			max = 10,
			clientOnly = true,
		} = options;
		this[_max] = max;
		this[_isAvailable] = !clientOnly || typeof window !== undefined;
		this[_indexes] = [];
		this[_expireIdMap] = {};
		this[_cacheMap] = {};
	}

	_unshift(key) {
		pull(this[_indexes], key);
		this[_indexes].push(key);
	}

	remove(key) {
		if (!this[_isAvailable]) { return; }

		pull(this[_indexes], key);
		delete this[_cacheMap][key];
	}

	set(key, value, expire) {
		if (!this[_isAvailable]) { return; }

		this[_cacheMap][key] = value;
		this._unshift(key);

		if (this[_expireIdMap][key]) {
			clearTimeout(this[_expireIdMap][key]);
		}

		if (expire) {
			this[_expireIdMap][key] = setTimeout((key) => {
				this.remove(key);
			}, expire);
		}

		if (this[_indexes].length > this[_max]) {
			const deleteKey = this[_indexes][0];
			this.remove(deleteKey);
		}
	}

	has(key) {
		return this[_cacheMap].hasOwnProperty(key);
	}

	get(key) {
		if (!this[_isAvailable]) { return; }

		this._unshift(key);
		return this[_cacheMap][key];
	}

}
