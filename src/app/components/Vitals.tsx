import React, { useState } from 'react';


const Vitals = ({FCP}) => {
  const [data, dataSet] = React.useState({});
  const METRICS = ["TTFB", "LCP", "FID", "FCP", "CLS"];

  React.useEffect(() => {
    chrome.runtime.sendMessage({
      type: "performance:metric:request",
    }, (d) => {
      dataSet(d);
    })
  }, [])


  return (
    <div>
      <h1>FCP: {FCP.toFixed(3)}</h1>
    </div>
  )
}

export default Vitals;