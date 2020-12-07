import React from 'react';
import { scaleOrdinal } from '@visx/scale';
import { LegendOrdinal, LegendItem, LegendLabel } from '@visx/legend';

// implement algorithm to check snapshot history and their respective colors

const legendGlyphSize = 8;

type snapHierarchy = {};
//type snapHierarchy = {`Record<string, unknown>`};
export default function LegendKey(props: any) {
  const { hierarchy } = props;
  // we are sifting through array of displayNames and sorting them into key value pairs in an object, based on the branch they are on:
  // { '.0': [1.0, 2.0, 3.0, 4.0], '.1': [1.1, 2.1, 3.1,...], '.2': [....]}
  // then we create an array, with each index being strings showing the range of the branch, see below:
  // ['1.0-4.0', '1.1-6.1',...]
  function colorRanger(snapshotIdsArray) {
    const resultRangeColor = {};

    for (let i = 0; i < snapshotIdsArray.length; i += 1) {
      const current = snapshotIdsArray[i];
      let key = current - Math.floor(current);
      key = parseFloat(key.toFixed(2));

      if (current % 1 === 0) {
        key = current - Math.floor(current);
        resultRangeColor[key]
          ? resultRangeColor[key].push(current)
          : (resultRangeColor[key] = [current]);
      } else if (current - Math.floor(current) !== 0) {
        resultRangeColor[key]
          ? resultRangeColor[key].push(current)
          : (resultRangeColor[key] = [current]);
      }
    }
    // now we convert the object to an array, each index being a string of the range of the branch
    // initializing array and new array with the values from resultRangeColor
    const branchesArr = [];
    const arrValues : string[] = Object.values(resultRangeColor);

    //iterate through and values and combine them into a string of range for each branch
    for (let i = 0; i < arrValues.length; i += 1) {
      const len = arrValues[i].length;
      const tempVal = `${arrValues[i][0]} - ${arrValues[i][len - 1]}`;
      branchesArr.push(tempVal);
    }
    return branchesArr;
  }

  // this is where we invoke the function to return an array of range of branches for legendKey
  const getSnapshotIds = (obj, snapshotIds = []) => {
    snapshotIds.push(`${obj.name}.${obj.branch}`);
    if (obj.children) {
      obj.children.forEach((child) => {
        getSnapshotIds(child, snapshotIds);
      });
    }
    const resultRange = colorRanger(snapshotIds);
    return resultRange;
  };

  // invoking getSnaphshotIds, which will ultimately return our array of split up branches
  const snap = getSnapshotIds(hierarchy);

  const ordinalColorScale = scaleOrdinal<number, string>({
    domain: snap,
    range: [
      '#eb4d70', 
      '#f19938', 
      '#6ce18b',
      '#78f6ef', 
      '#9096f8',
      '#C5B738',
      '#858DFF',
      '#FF8D02',
      '#FFCD51',
      '#ACDAE6',
      '#FC997E',
      '#CF93AD',
      '#AA3939',
      '#AA6C39',
      '#226666',
      '#2C4870',
    ],
  });

  return (
    <div className="legends">
      <LegendVisual title="State Snapshots">
        <LegendOrdinal scale={ordinalColorScale}>
          {(labels) => (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {labels.map((label, i) => (
                <LegendItem
                  key={`legend-quantile-${i}`}
                  margin="0 5px"
                  onClick={() => {
                    // if (Event) alert('clicked: YO BRILLIANT GENIUS');
                  }}
                >
                  <svg width={10} height={10}>
                    <rect
                      fill={label.value}
                      width={legendGlyphSize}
                      height={legendGlyphSize}
                    />
                  </svg>
                  <LegendLabel align="left" margin="0 0 0 4px">
                    {label.text}
                  </LegendLabel>
                </LegendItem>
              ))}
            </div>
          )}
        </LegendOrdinal>
      </LegendVisual>

      <style >
        {`
          .legends {
            position: center;
            width: 25%;
            font-family: arial;
            font-weight: 900;
            // background-color: 242529;
            border-radius: 14px;
            padding: 2px 2px 2px 2px;
            overflow-y: auto;
            flex-grow: 1;
          }
        `}
      </style>
    </div>
  );
}

function LegendVisual({
  title,
  children,
}: {
  title: string;
  children: JSX.Element;
}) {
  return (
    <div className="legend">
      <div className="title">{title}</div>
      {children}
      <style >
        {`
          .legend {
            position: absolute;
            with: 120px;
            line-height: 0.9em;
            color: #efefef;
            font-size: 11px;
            font-family: arial;
            padding: 10px 10px;
            float: left;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px;
            margin: 5px 5px;
          }
          .title {
            font-size: 12px;
            margin-bottom: 10px;
            font-weight: 100;
            font-family: arial;
          }
        `}
      </style>
    </div>
  );
}
