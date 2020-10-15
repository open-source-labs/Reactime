import { link } from 'fs';
import React from 'react';

const controlStyles = { fontSize: 10 };
// props for orientation controls
type Props = {
  layout: string;
  orientation: string;
  linkType: string;
  stepPercent: number;
  setLayout: (layout: string) => void;
  setOrientation: (orientation: string) => void;
  setLinkType: (linkType: string) => void;
  setStepPercent: (percent: number) => void;
};
// below are the control options for each of the drop downs.
export default function LinkControls({
  layout,
  orientation,
  linkType,
  stepPercent,
  setLayout,
  setOrientation,
  setLinkType,
  setStepPercent,
}: Props) {
  return (
    <div style={controlStyles}>
      <label>Layout:</label>&nbsp;
      <select
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => setLayout(e.target.value)}
        value={layout}
      >
        <option value='cartesian'>Cartesian</option>
        <option value='polar'>Polar</option>
      </select>
      &nbsp;&nbsp;
      <label>Orientation:</label>&nbsp;
      <select
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => setOrientation(e.target.value)}
        value={orientation}
        disabled={layout === 'polar'}
      >
        <option value='vertical'>Vertical</option>
        <option value='horizontal'>Horizontal</option>
      </select>
      &nbsp;&nbsp;
      <label>Link:</label>&nbsp;
      <select
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => setLinkType(e.target.value)}
        value={linkType}
      >
        <option value='diagonal'>Diagonal</option>
        <option value='step'>Step</option>
        <option value='line'>Line</option>
      </select>
      {linkType === 'step' && layout !== 'polar' && (
        <>
          &nbsp;&nbsp;
          <label>Step:</label>&nbsp;
          <input
            onClick={(e) => e.stopPropagation()}
            type='range'
            min={0}
            max={5}
            step={0.1}
            onChange={(e) => setStepPercent(Number(e.target.value))}
            value={stepPercent}
            disabled={linkType !== 'step' || layout === 'polar'}
          />
        </>
      )}
    </div>
  );
}
