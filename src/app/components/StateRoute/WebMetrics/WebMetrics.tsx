import React, { useEffect } from 'react';
import Charts from 'react-apexcharts';
import ReactHover, { Trigger, Hover } from 'react-hover';
import { OptionsCursorTrueWithMargin } from '../../../FrontendTypes';
import { setCurrentTabInApp } from '../../../slices/mainSlice';
import { useDispatch } from 'react-redux';

const radialGraph = (props) => {
  const dispatch = useDispatch();
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
        foreColor: 'var(--text-primary)',
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
            background: 'var(--border-color-dark)',
            strokeWidth: '10%',
            margin: 0,
          },
          dataLabels: {
            show: true,
            name: {
              offsetY: -10,
              show: true,
              color: 'var(--text-primary)',
              fontSize: '24px',
            },
            value: {
              formatter: props.formatted,
              color: 'var(--color-primary)',
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
    dispatch(setCurrentTabInApp('webmetrics'));
  }, []);

  const getThresholdColor = (type) => {
    switch (type) {
      case 'good':
        return '#0bce6b';
      case 'improvement':
        return '#fc5a03';
      case 'poor':
        return '#fc2000';
      default:
        return 'var(--text-primary)';
    }
  };

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
              <span style={{ color: getThresholdColor('good') }}>Good: </span>
              {`< ${props.score[0]}`}
            </p>
            <p>
              <span style={{ color: getThresholdColor('improvement') }}>Needs Improvement: </span>
              {`< ${props.score[1]}`}
            </p>
            <p>
              <span style={{ color: getThresholdColor('poor') }}>Poor: </span>
              {`> ${props.score[1]}`}
            </p>
          </div>
        </Hover>
      </ReactHover>
    </div>
  );
};

export default radialGraph;
