import * as PropTypes from 'prop-types';
import useEventListener from './useEventListener';

function EventListener(props) {
  useEventListener(props);
  return null;
}

EventListener.displayName = 'EventListener'; // TODO: use Babel plugin for this

EventListener.propTypes = process.env.NODE_ENV !== 'production' ? {
  capture: PropTypes.bool,
  listener: PropTypes.func.isRequired,
  targetRef: PropTypes.shape({
    current: PropTypes.object
  }).isRequired,
  type: PropTypes.string.isRequired
} : {};
EventListener.defaultProps = {
  capture: false
};
export default EventListener;