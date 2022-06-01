import React from "react";

const RouteDescription = (props) => {
  const url = new URL(props.actions[0].props.routePath);
  return (
    <div className="routedescription">
      <h3 className='route'>Route: {url.pathname}</h3>
      {props.actions}
    </div>
  );
};

export default RouteDescription;
