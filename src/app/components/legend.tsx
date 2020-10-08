import React from 'react';
import { scaleOrdinal } from '@visx/scale';
import { LegendOrdinal, LegendItem, LegendLabel } from '@visx/legend';

// implement algorithm to check snapshot history and their respective colors

const legendGlyphSize = 12;

export default function Legendary(props: any) {
  // { events = false }: { events?: boolean }) {

  console.log('successfully invoke Legendary function call');
  const { hierarchy } = props;
  console.log('and hierarchy being passed in is', hierarchy);

  const getSnapshotIds = (obj, snapshotIds = []) => {
    console.log('obj.name is', obj.name);
    snapshotIds.push(`${obj.name}.${obj.branch}`);
    if (obj.children) {
      obj.children.forEach((child) => {
        getSnapshotIds(child, snapshotIds);
      });
    }
    return snapshotIds;
  };

  const snap = getSnapshotIds(hierarchy);
  console.log('passing hierarchy as an object to getSnapshotIds is -->', snap);

  const ordinalColorScale = scaleOrdinal<number, string>({
    domain: snap,
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
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {labels.map((label, i) => (
                <LegendItem
                  key={`legend-quantile-${i}`}
                  margin="0 5px"
                  // onClick={() => {
                  //   if (events) alert(`clicked: ${JSON.stringify(label)}`);
                  // }}
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
            font-family: arial;
            font-weight: 900;
            background-color: 242529;
            border-radius: 14px;
            padding: 24px 24px 24px 32px;
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
