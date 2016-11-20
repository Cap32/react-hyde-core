
import mixin from 'utils/mixin';
import { Cancellation } from 'http-ask';

export default (options = {}) => mixin({
	_cancelFetch() {
		if (this._cancellation) { this._cancellation.cancel(); }
	},
	_handleFetch() {
		if (typeof this.fetch !== 'function') { return; }

		const execAsk = (ask) => {
			this._cancelFetch();
			this._cancellation = new Cancellation();
			this.setState({ isFetching: true, errorMessage: '' });
			return ask
				.cancellation(this._cancellation)
				.exec()
			;
		};

		const complete = (state) => {
			this.setState({
				isFetching: false,
				errorMessage: '',
				...state,
			});
		};

		const result = this.fetch(execAsk, complete);

		if (result && result.catch) {
			result.catch((err) => {
				if (err instanceof Cancellation) {
					__DEV__ && console.warn('ask cancelled.');
				}
				else {
					this.setState({
						isFetching: false,
						errorMessage: err.message || 'Error',
					});
				}
			});
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
