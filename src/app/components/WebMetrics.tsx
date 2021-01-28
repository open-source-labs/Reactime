import React, { useState } from 'react';
import { JSCharting } from 'jscharting-react';

const config = {
    type: 'horizontal column',
    series: [
        {
            points: [
                { x: 'A', y: 50 },
                { x: 'B', y: 30 },
                { x: 'C', y: 50 }
            ]
        }
    ]
};

const divStyle = {
	maxWidth: '700px',
	height: '400px',
	margin: '0px auto'
};

// const WebMetrics = ({webMetrics}) => {
//   const [data, setData] = React.useState({});
//   const METRICS = ["TTFB", "LCP", "FID", "FCP", "CLS"];

//   React.useEffect(() => {
//     chrome.runtime.sendMessage({
//       type: "performance:metric:request",
//     }, (d) => {
//       setData(d);
//     })
//   }, [])

//   const output = [];
//   const perfMetrics = Object.keys(webMetrics)
//     .map((metric) => output.push(<div><div>{metric}</div><div>{Math.round(webMetrics[metric])}</div></div>));
   



  return (
    <div id="chartDiv" style="width: 100%; height: 400px;"></div>
  )
}

export default WebMetrics;