import React, { useState } from 'react';
import Charts from 'react-apexcharts'

const radialGraph = ({webMetrics}) => {
		const state = {
		
			series: [(webMetrics.FCP / 1000) * 100],
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
							size: '90%',
							background: '#242529',
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
							strokeWidth: '10%',
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
								fontSize: '17px'
							},
							value: {
								formatter: function(val) {
									return parseInt(webMetrics.FCP);
								},
								color: '#fff',
								fontSize: '25px',
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
				labels: ['FCP'],
			},
		
		
    };
   

		return (
			

<div id="card">
	<div id="chart">
		<Charts options={state.options} series={state.series} type="radialBar" height={350} />
	</div>
</div>

		)
}

export default radialGraph;