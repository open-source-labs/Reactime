import React from 'react';

type RouteProps = {
  actions: JSX.Element[],
}

const RouteDescription = (props: RouteProps): JSX.Element => {
  // Use new URL to use the url.pathname method.
  const { actions } = props;
  const url = new URL(actions[0].props.routePath);
  return (
    <div className="routedescription">
      <h3 className="route">
        Route:
        {url.pathname}
      </h3>
      {actions}
    </div>
  );
};

export default RouteDescription;
