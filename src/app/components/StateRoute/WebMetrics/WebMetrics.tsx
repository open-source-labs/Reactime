import React, { useEffect } from 'react';
import Charts from 'react-apexcharts';
import ReactHover, { Trigger, Hover } from 'react-hover';
import { OptionsCursorTrueWithMargin } from '../../../FrontendTypes';
import { setCurrentTabInApp } from '../../../slices/mainSlice';
import { useDispatch } from 'react-redux';
/*
  Used to render a single radial graph on the 'Web Metrics' tab
*/

const radialGraph = (props) => {
  const dispatch = useDispatch();
  const state = {
    series: [props.series], // series appears to be the scale at which data is displayed based on the type of webMetrics measured.
    options: {
      colors: [props.color], // color of the webmetrics performance bar from 'StateRoute'
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
            background: 'transparent',
            image: props.overLimit
              ? 'https://static.vecteezy.com/system/resources/thumbnails/012/042/301/small/warning-sign-icon-transparent-background-free-png.png'
              : undefined,
            imageWidth: 32,
            imageHeight: 32,
            imageOffsetX: 0,
            imageOffsetY: -64,
            imageClipped: false,
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
            background: '#161617',
            strokeWidth: '3%',
            margin: 0,
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
              color: '#161617',
              fontSize: '24px',
            },
            value: {
              formatter: props.formatted,
              color: '#3c6e71',
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

  useEffect(() => {
    dispatch(setCurrentTabInApp('webmetrics')); // dispatch sent at initial page load allowing changing "immer's" draft.currentTabInApp to 'webmetrics' to facilitate render.
  }, []);

  return (
    <div className='metric'>
      <ReactHover>
        <Trigger type='trigger'>
          <div id='chart' className='chart-container'>
            <Charts
              options={state.options}
              series={state.series}
              type='radialBar'
              height={250}
              width={250}
            />
          </div>
        </Trigger>
        <Hover type='hover'>
          <div className='hover-box'>
            <p>
              <strong>{props.name}</strong>
            </p>
            <p>{props.description}</p>
            <p>
              <span style={{ color: '#0bce6b' }}>Good: </span>
              {`< ${props.score[0]}`}
            </p>
            <p>
              <span style={{ color: '#fc5a03' }}>Needs Improvement: </span>
              {`< ${props.score[1]}`}
            </p>
            <p>
              <span style={{ color: '#fc2000' }}>Poor: </span>
              {`> ${props.score[1]}`}
            </p>
          </div>
        </Hover>
      </ReactHover>
    </div>
  );
};

export default radialGraph;
