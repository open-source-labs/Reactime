import React from 'react';
import { scaleOrdinal } from '@visx/scale';
import {
  LegendOrdinal,
  LegendItem,
  LegendLabel,
} from '@visx/legend';

import {
  green,
  selectWhite,
  orange,
  blue
} from './AtomsRelationship'

const ordinalColorScale = scaleOrdinal({
  domain: ['root', 'selectors', 'atoms', 'components'],
  range: [ green, selectWhite, orange, blue],
});

const legendGlyphSize = 10;

export default function Legend({ events = false }: { events?: boolean }) {
  return (
    <div className="legends">
      <LegendDemo title="Recoil Relationships">
        <LegendOrdinal scale={ordinalColorScale} labelFormat={label => `${label.toUpperCase()}`}>
          {labels => (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
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
                    // width={legendGlyphSize} 
                    // height={legendGlyphSize} 
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
      </LegendDemo>
      <style jsx>{`
        .legends {
          font-family: arial;
          font-weight: 900;
          border-radius: 14px;
          padding: 24px 24px 24px 32px;
          overflow-y: auto;
          flex-grow: 1;
        }
        .chart h2 {
          margin-left: 10px;
        }
      `}</style>
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
          line-height: 0.9em;
          color: #efefef;
          font-size: 10px;
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
      `}</style>
    </div>
  );
}