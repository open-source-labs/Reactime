import React from 'react';
import { scaleOrdinal } from '@visx/scale';
import { LegendOrdinal, LegendItem, LegendLabel } from '@visx/legend';

// implement algorithm to check snapshot history and their respective colors
const ordinalColorScale = scaleOrdinal<number, string>({
  domain: [1, 2, 3, 4],
  // sync in with the snapshot color chosen in history tab already
  range: ['#66d981', '#71f5ef', '#4899f1', '#7d81f6'],
});

const legendGlyphSize = 12;

export default function Legendary({ events = false }: { events?: boolean }) {
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
                  onClick={() => {
                    if (events) alert(`clicked: ${JSON.stringify(label)}`);
                  }}
                >
                  <svg width={legendGlyphSize} height={legendGlyphSize}>
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
            background-color: ${242529};
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
        `}
      </style>
    </div>
  );
}
