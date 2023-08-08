import React from 'react';

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
    <div className='routedescription'>
      <h3 className='route'>Route: {url.pathname}</h3>
      {actions}
    </div>
  );
};

export default RouteDescription;
