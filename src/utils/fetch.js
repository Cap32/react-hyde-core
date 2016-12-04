
import mixin from 'utils/mixin';
import { Cancellation } from 'http-ask';

export default (options = {}) => mixin({
	_handleFetch() {
		if (typeof this.fetch === 'function') {
			const getCancellation = () => this._cancelFetch = new Cancellation();
			const execFetch = this.fetch();
			execFetch({ getCancellation });
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
		if (this._cancelFetch) {
			this._cancelFetch.cancel();
		}
	},
});
