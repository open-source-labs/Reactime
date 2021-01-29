import React, { Component } from 'react';
import Charts from 'react-apexcharts'


interface apexcharts {
  state: any
}

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

//     console.log('WM >>>', webMetrics)
//     console.log('output>>>', output)
// return (
// 	<div>
//     {output}
//   </div>
// )

// }


class WebMetrics extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		
			series: [75],
			options: {
				chart: {
					height: 350,
					type: 'radialBar',
					toolbar: {
						show: true
					}
				},
				plotOptions: {
					radialBar: {
						startAngle: -135,
						endAngle: 225,
						 hollow: {
							margin: 0,
							size: '70%',
							background: '#fff',
							image: undefined,
							imageOffsetX: 0,
							imageOffsetY: 0,
							position: 'front',
							dropShadow: {
								enabled: true,
								top: 3,
								left: 0,
								blur: 4,
								opacity: 0.24
							}
						},
						track: {
							background: '#fff',
							strokeWidth: '67%',
							margin: 0, // margin is in pixels
							dropShadow: {
								enabled: true,
								top: -3,
								left: 0,
								blur: 4,
								opacity: 0.35
							}
						},
				
						dataLabels: {
							show: true,
							name: {
								offsetY: -10,
								show: true,
								color: '#888',
								fontSize: '17px'
							},
							value: {
								formatter: function(val) {
									return parseInt(val);
								},
								color: '#111',
								fontSize: '36px',
								show: true,
							}
						}
					}
				},
				fill: {
					type: 'gradient',
					gradient: {
						shade: 'dark',
						type: 'horizontal',
						shadeIntensity: 0.5,
						gradientToColors: ['#ABE5A1'],
						inverseColors: true,
						opacityFrom: 1,
						opacityTo: 1,
						stops: [0, 100]
					}
				},
				stroke: {
					lineCap: 'round'
				},
				labels: ['Percent'],
			},
		
		
    };
    const { webMetrics} = props;
    console.log('props', props, webMetrics)
	}



	render() {
		return (
			

<div id="card">
	<div id="chart">
		<Charts options={this.state.options} series={this.state.series} type="radialBar" height={350} />
	</div>
</div>

		)
	}
}

export default WebMetrics;