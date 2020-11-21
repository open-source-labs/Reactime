/* eslint react/jsx-handler-names: "off" */
// @ts-nocheck
import React, { useState } from 'react';
// import { interpolateRainbow } from 'd3-scale-chromatic';
import { Zoom } from '@visx/zoom';
import { localPoint } from '@visx/event';
import { RectClipPath } from '@visx/clip-path';
import { scaleLinear } from '@visx/scale';
import LegendKey from './legend';
import History from './History';
// import { hierarchy } from '@visx/hierarchy';

// const bg = '';
// const points = [...new Array(1000)];

// const colorScale = scaleLinear<number>({ range: [0, 1], domain: [0, 1000] });
// const sizeScale = scaleLinear<number>({ domain: [0, 600], range: [0.5, 8] });

const initialTransform = {
  scaleX: 1.27,
  scaleY: 1.27,
  translateX: -211.62,
  translateY: 162.59,
  skewX: 0,
  skewY: 0,
};

// export type ZoomIProps = {
//   width: number;
//   height: number;
// };

export default function ZoomI(props: any) {
  const [showMiniMap, setShowMiniMap] = useState(true);
  // const { width, height, hierarchy, dispatch, sliderIndex, viewIndex } = props;
  const { width, height, hierarchy, dispatch, sliderIndex, viewIndex } = props;
  // const genenerator: GenPhyllotaxisFunction = genPhyllotaxis({
  //   radius: 10,
  //   width,
  //   height,
  // });
  // const phyllotaxis: PhyllotaxisPoint[] = points.map((d, i) => genenerator(i));

  return (
    <>
      <Zoom
        width={width}
        height={height}
        scaleXMin={1 / 2}
        scaleXMax={4}
        scaleYMin={1 / 2}
        scaleYMax={4}
        transformMatrix={initialTransform}
      >
        {/* <div
          ref={HistoryRef}
          className="history-d3-div"
          id="historyContainer"
          // position="absolute"
        /> */}
        {(zoom) => (
          <div className="relative">
            <svg
              width={width}
              height={height}
              style={{ cursor: zoom.isDragging ? 'grabbing' : 'grab' }}
            >
              <RectClipPath id="zoom-clip" width={800} height={600} />
              <rect width={width} height={height} />
              <g transform={zoom.toString()}>
                {/* invoke them here */}
                <h1 color="yellowgreen">Hello</h1>
              </g>
              <rect
                width={width}
                height={height}
                rx={14}
                fill="transparent"
                onTouchStart={zoom.dragStart}
                onTouchMove={zoom.dragMove}
                onTouchEnd={zoom.dragEnd}
                onMouseDown={zoom.dragStart}
                onMouseMove={zoom.dragMove}
                onMouseUp={zoom.dragEnd}
                onMouseLeave={() => {
                  if (zoom.isDragging) zoom.dragEnd();
                }}
                // here we have the option to double click to zoom in or out
                onDoubleClick={(event) => {
                  const point = localPoint(event) || { x: 0, y: 0 };
                  zoom.scale({ scaleX: 1.1, scaleY: 1.1, point });
                }}
              />
            </svg>
            <div className="controls">
              <button
                type="button"
                className="btn btn-zoom"
                onClick={() => zoom.scale({ scaleX: 1.2, scaleY: 1.2 })}
              >
                +
              </button>
              <button
                type="button"
                className="btn btn-zoom btn-bottom"
                onClick={() => zoom.scale({ scaleX: 0.8, scaleY: 0.8 })}
              >
                -
              </button>
              <button
                type="button"
                className="btn btn-lg"
                onClick={zoom.center}
              >
                Center
              </button>
              <button type="button" className="btn btn-lg" onClick={zoom.reset}>
                Reset
              </button>
              <button type="button" className="btn btn-lg" onClick={zoom.clear}>
                Clear
              </button>
            </div>
            <div className="mini-map">
              <button
                type="button"
                className="btn btn-lg"
                onClick={() => setShowMiniMap(!showMiniMap)}
              >
                {showMiniMap ? 'Hide' : 'Show'} Mini Map
              </button>
            </div>
          </div>
        )}
      </Zoom>
      <style jsx>
        {`
          .btn {
            margin: 0;
            text-align: center;
            border: none;
            background: #2f2f2f;
            color: #888;
            padding: 0 4px;
            border-top: 1px solid #0a0a0a;
          }
          .btn-lg {
            font-size: 12px;
            line-height: 1;
            padding: 4px;
          }
          .btn-zoom {
            width: 26px;
            font-size: 22px;
          }
          .btn-bottom {
            margin-bottom: 1rem;
          }
          .description {
            font-size: 12px;
            margin-right: 0.25rem;
          }
          .controls {
            position: absolute;
            top: 15px;
            right: 15px;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
          }
          .mini-map {
            position: absolute;
            bottom: 25px;
            right: 15px;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
          }
          .relative {
            position: relative;
          }
        `}
      </style>
    </>
  );
}

/*
return (
    <>
    <Zoom>
      <div>
        <LegendKey hierarchy={hierarchy} />
        <div
          ref={HistoryRef}
          className="history-d3-div"
          id="historyContainer"
          // position="absolute"
        />
      </div>
      </Zoom>
    </>
  );
*/
