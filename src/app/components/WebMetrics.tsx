import React from 'react';
import Charts from 'react-apexcharts';
import ReactHover, { Trigger, Hover } from 'react-hover';

const radialGraph = (props) => {
  const state = {
    series: [props.series],
    options: {
      colors: [props.color],
      chart: {
        height: 100,
        width: 100,
        type: 'radialBar',
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          hollow: {
            margin: 0,
            size: '75%',
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
              opacity: 0.24,
            },
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
              opacity: 0.35,
            },
          },

          dataLabels: {
            show: true,
            name: {
              offsetY: -10,
              show: true,
              color: '#fff',
              fontSize: '24px',
            },
            value: {
              formatter: props.formatted,
              color: '#fff',
              fontSize: '16px',
              show: true,
            },
          },
        },
      },
      fill: {
        type: 'solid',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.1,
          gradientToColors: [props.color],
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      stroke: {
        lineCap: 'flat',
      },
      labels: [props.label],
    },
  };
  const optionsCursorTrueWithMargin = {
    followCursor: true,
    shiftX: 20,
    shiftY: 0,
  };

  return (
    <div className='metric'>
      <ReactHover options={optionsCursorTrueWithMargin}>
        <Trigger type='trigger'>
          <div id='chart'>
            <Charts
              options={state.options}
              series={state.series}
              type='radialBar'
              height={200}
              width={200}
            />
          </div>
        </Trigger>
        <Hover type='hover'>
          <div style={{ padding: '0.5rem 1rem' }} id='hover-box'>
            <p>
              <strong>{props.name}</strong>
            </p>
            <p>{props.description}</p>
          </div>
        </Hover>
      </ReactHover>
    </div>
  );
};

export default radialGraph;
