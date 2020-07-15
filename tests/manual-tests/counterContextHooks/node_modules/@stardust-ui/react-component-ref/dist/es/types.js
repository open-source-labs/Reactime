import * as PropTypes from 'prop-types';

/** A checker that matches the React.Ref type. */
export var refPropType = PropTypes.oneOfType([PropTypes.func, PropTypes.object]);