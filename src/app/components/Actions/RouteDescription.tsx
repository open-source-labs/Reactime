import React from 'react';
import Slider from 'rc-slider';
import VerticalSlider from '../TimeTravel/VerticalSlider';

/*
  Render's the red route description on app's left sided column between the clear button and the list of state snapshots. The route description is derived from the first state snapshot.
*/

type RouteProps = {
  actions: JSX.Element[];
};

const RouteDescription = (props: RouteProps): JSX.Element => {
  const { actions } = props;

  const url: URL = new URL(actions[0].props.routePath); // Use new URL to use the url.pathname method.

  return (
    <div className='route-container'>
      <div className='route-header'>Route: {url.pathname}</div>
      <div className='route-content' style={{ height: `${actions.length * 30}px` }}>
        <div style={{ maxWidth: '50px' }}>
          <VerticalSlider className='main-slider' snapshots={actions} />
        </div>
        <div className='actions-container'>
          {/* actual snapshots per route */}
          {actions}
        </div>
      </div>
    </div>
  );
};

export default RouteDescription;
