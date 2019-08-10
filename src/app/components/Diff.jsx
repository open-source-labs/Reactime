import React from 'react';
import PropTypes from 'prop-types';
import { diff, reverse, formatters } from "jsondiffpatch";
import './diff.css';

import { useStoreContext } from '../store';

function Diff({ snapshot }) {
  const [mainState] = useStoreContext();
  const { snapshots, viewIndex } = mainState;

  let previous;
  if (viewIndex === -1) {
    if (snapshots.length > 1) {
      previous = snapshots[snapshots.length - 2];
    } else {
      previous = undefined;
    }
  } else if (snapshots.length > 1) {
    previous = snapshots[viewIndex - 1];
  } else {
    [previous] = snapshots;
  }
  const delta = diff(previous,snapshot)
  console.log('delta',delta);
  const html = formatters.html.format(delta, previous);
  console.log('format', formatters.html.format(delta, previous));
  if (previous === undefined) {
    return (
      <div>
       states are equal
      </div>
    );
  }
  return (
    <div dangerouslySetInnerHTML={{__html: html}}>
    </div>
  );
}

Diff.propTypes = {
  snapshot: PropTypes.shape({
    state: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    children: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default Diff;
