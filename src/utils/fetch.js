
import mixin from 'utils/mixin';

export default (options = {}) => mixin({
	_cancelFetch() {
		if (this._cancellation) { this._cancellation.cancel(); }
	},
	_handleFetch() {
		if (typeof this.fetch === 'function') {
			this._cancellation = this.fetch();
		}
	},
	componentDidMount() {
		this._handleFetch();
	},
	componentDidUpdate({ location }) {
		const { shouldRefetch = true } = options;
		if (shouldRefetch && location !== this.props.location) {
			this._handleFetch();
		}
	},
	componentWillUnmount() {
		this._cancelFetch();
	},
});
