import React from 'react';
import { scaleOrdinal } from '@visx/scale';
import { LegendOrdinal, LegendItem, LegendLabel } from '@visx/legend';

// implement algorithm to check snapshot history and their respective colors
const ordinalColorScale = scaleOrdinal<number, string>({
  domain: [1.0, 2.0, 3.0, 4.0, 4.1, 4.2, 5.0, 5.1, 5.2],
  // sync in with the snapshot color chosen in history tab already
  range: ['#66d981', '#71f5ef', '#4899f1', '#7d81f6'],
});

const legendGlyphSize = 12;

export default function Legendary(props: any) {
  // { events = false }: { events?: boolean }) {
  const displayArray = (obj: {
    stateSnapshot: { children: any[] };
    name: number;
    branch: number;
    index: number;
    children?: [];
  }) => {
    if (
      obj.stateSnapshot.children.length > 0 &&
      obj.stateSnapshot.children[0] &&
      obj.stateSnapshot.children[0].state &&
      obj.stateSnapshot.children[0].name
    ) {
      const newObj: Record<string, unknown> = {
        index: obj.index,
        displayName: `${obj.name}.${obj.branch}`,
        state: obj.stateSnapshot.children[0].state,
        componentName: obj.stateSnapshot.children[0].name,
        componentData:
          JSON.stringify(obj.stateSnapshot.children[0].componentData) === '{}'
            ? ''
            : obj.stateSnapshot.children[0].componentData,
      };
      hierarchyArr.push(newObj);
    }
    if (obj.children) {
      obj.children.forEach((element) => {
        displayArray(element);
      });
    }
  };
  // the hierarchy gets set on the first click in the page
  // when page in refreshed we may not have a hierarchy so we need to check if hierarchy was initialized
  // if true involk displayArray to display the hierarchy
  // if (hierarchy) displayArray(hierarchy);
  console.log('Inside Legendary, props is', props);

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
