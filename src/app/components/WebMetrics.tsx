import React, { useState, useEffect, Component } from 'react';
import Charts from 'react-apexcharts';
import useForceUpdate from './useForceUpdate';

const radialGraph = (props) => {
		const state = {
		
			series: [props.series],
			options: {
				colors: ['#0bce6b'],
				chart: {
					height: 100,
					width: 100,
					type: 'radialBar',
					toolbar: {
						show: false,
					}
				},
				plotOptions: {
					radialBar: {
						startAngle: -135,
						endAngle: 135,
						 hollow: {
							margin: 0,
							size: '80%',
							background: '#242529',
							image: undefined,
							imageOffsetX: 0,
							imageOffsetY: 0,
							position: 'front',
							dropShadow: {
								enabled: false,
								top: 3,
								left: 0,
								blur: 4,
								opacity: 0.24
							}
						},
						track: {
							background: '#fff',
							strokeWidth: '3%',
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
								color: '#fff',
								fontSize: '38px'
							},
							value: {
								formatter: props.formatted,
								color: '#fff',
								fontSize: '25px',
								show: true,
							}
						}
					}
				},
				fill: {
					type: 'solid',
					gradient: {
						shade: 'dark',
						type: 'horizontal',
						shadeIntensity: 0.1,
						gradientToColors: ['#0bce6b'],
						inverseColors: false,
						opacityFrom: 1,
						opacityTo: 1,
						stops: [0, 100]
					}
				},
				stroke: {
					lineCap: 'flat'
				},
				labels: [props.label],
			},		
    };

let formatted;

const [webMetricsState, setWebMetricsState] = useState(props)

useEffect(() => {
	setWebMetricsState(props);
	formatted = props.formatted;
}, [props])

// console.log("props.formatted", props.formatted)

		return (
			

<div id="card">
	<div id="chart">
		<Charts options={state.options} series={state.series} type="radialBar" height={250} width={250}/>
	</div>
</div>

		)
}


export default radialGraph;