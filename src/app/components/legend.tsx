import React from 'react';
import { scaleOrdinal } from '@visx/scale';
import { LegendOrdinal, LegendItem, LegendLabel } from '@visx/legend';

// implement algorithm to check snapshot history and their respective colors

const legendGlyphSize = 8;

export default function Legendary(props: any) {
  // { events = false }: { events?: boolean }) {

  const { hierarchy } = props;

  function colorRanger(snapshotIdsArray) {
    // create object to store branch ranges
    const resultRangeColor = {};

    for (let i = 0; i < snapshotIdsArray.length; i += 1) {
      const current = snapshotIdsArray[i];

      let key = current - Math.floor(current);
      key = key.toFixed(2);

      if (current % 1 === 0) {
        key = current - Math.floor(current);
        if (!resultRangeColor[key]) resultRangeColor[key] = [current];
        else resultRangeColor[key].push(current);
      } else if (current - Math.floor(current) !== 0) {
        if (!resultRangeColor[key]) resultRangeColor[key] = [current];
        else resultRangeColor[key].push(current);
      }
    }
    return objectToArray(resultRangeColor);
  }

  // reduce or map method on this?
  function objectToArray(snapObj) {
    // console.log(
    //   'mid step: object that we are going to pass into the array is',
    //   snapObj
    // );
    const newArr = [];
    const arrValues = Object.values(snapObj);
    // console.log(arrValues);
    // console.log(arrValues[0].length);
    // console.log(arrValues[0][arrValues[0]]);

    for (let i = 0; i < arrValues.length; i += 1) {
      const len = arrValues[i].length;
      const tempVal = `${arrValues[i][0]} - ${arrValues[i][len - 1]}`;
      newArr.push(tempVal);
    }
    // console.log(
    //   'later step: the array that is created from passing in the object is',
    //   newArr
    // );
    return newArr;
  }

  const getSnapshotIds = (obj, snapshotIds = []) => {
    // console.log('the hierarchy object is: ', hierarchy);
    snapshotIds.push(`${obj.name}.${obj.branch}`);
    if (obj.children) {
      obj.children.forEach((child) => {
        getSnapshotIds(child, snapshotIds);
      });
    }
    // console.log('after recursive call, snapshotIds are: ', snapshotIds);
    // return snapshotIds;
    const resultRange = colorRanger(snapshotIds);
    // console.log(resultRange);
    return resultRange;
  };

  const snap = getSnapshotIds(hierarchy);
  // console.log('the snap that we are receiving now is: ', snap);

  const ordinalColorScale = scaleOrdinal<number, string>({
    domain: snap,
    // maybe think of having each element be a string of the range? ooooooh
    // sync in with the snapshot color chosen in history tab already
    range: [
      '#95B6B7',
      '#475485',
      '#519331',
      '#AA5039',
      '#8B2F5F',
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
                    // if (Event) alert(`clicked: ${JSON.stringify(label)}`);
                    if (Event) alert('clicked: YO BRILLIANT GENIOS');
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

      <style jsx>
        {`
          .legends {
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
  children: React.ReactNode;
}) {
  return (
    <div className="legend">
      <div className="title">{title}</div>
      {children}
      <style jsx>
        {`
          .legend {
            position: absolute;
            with: 120px;
            line-height: 0.9em;
            color: #efefef;
            font-size: 9px;
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
          }
        `}
      </style>
    </div>
  );
}
