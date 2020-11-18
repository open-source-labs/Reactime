// @ts-nocheck
import React from 'react';
import { scaleOrdinal } from '@visx/scale';
import {
  LegendOrdinal,
  LegendItem,
  LegendLabel,
} from '@visx/legend';


const ordinalColorScale = scaleOrdinal({
  domain: ['Root', 'Selectors', 'Atoms', 'Components'],
  range: [ '#3BB78F', '#f0ece2', '#FED8B1', '#acdbdf'],
});

const legendGlyphSize = 15;

export default function Legend({ events = false }: { events?: boolean }) {
  return (
    <div className="legends">
      <LegendDemo title="Recoil Relationships">
        <LegendOrdinal scale={ordinalColorScale} labelFormat={label => `${label}`}>
          {labels => (
            <div 
            style={{ display: 'flex', flexDirection: 'column' }}
            >
              {labels.map((label, i) => (
                <LegendItem
                  key={`legend-quantile-${i}`}
                  margin="0 5px"
                  onClick={() => {
                    if (events) alert(`clicked: ${JSON.stringify(label)}`);
                  }}
                >
                  <svg width={legendGlyphSize} height={legendGlyphSize}>
                    <circle 
                    fill={label.value}
                    r={legendGlyphSize / 2}
                    cx={legendGlyphSize / 2}
                    cy={legendGlyphSize / 2}
                    />
                  </svg>
                  <LegendLabel align="left" margin="4px 0px 4px 4px">
                    {label.text}
                  </LegendLabel>
                </LegendItem>
              ))}
            </div>
          )}
        </LegendOrdinal>
      </LegendDemo>
      <style jsx>
        {`
          .legends {
            width: 25%;
            font-family: arial;
            font-weight: 900;;
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

function LegendDemo({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="legend">
      <div className="title">{title}</div>
      {children}
      <style jsx>{`
        .legend {
         position: absolute;
            top: 50;
            left: 50;
            line-height: 0.9em;
            color: #efefef;
            font-size: 9px;
            font-family: arial;
            padding: 10px 10px;
            float: left;
            margin: 5px 5px;
        }
        .title {
          font-size: 12px;
          margin-bottom: 10px;
          font-weight: 100;
        }
      `}</style>
    </div>
  );
}