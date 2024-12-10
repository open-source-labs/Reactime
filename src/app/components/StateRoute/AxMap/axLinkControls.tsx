import React from 'react';

const controlStyles = { fontSize: 10 };

type Props = {
  orientation: string;
  linkType: string;
  stepPercent: number;
  setOrientation: (orientation: string) => void;
  setLinkType: (linkType: string) => void;
  setStepPercent: (percent: number) => void;
};

export default function LinkControls({
  orientation,
  linkType,
  stepPercent,
  setOrientation,
  setLinkType,
  setStepPercent,
}: Props) {
  return (
    <div style={controlStyles}>
      &nbsp;&nbsp;
      <label>orientation:</label>&nbsp;
      <select
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => setOrientation(e.target.value)}
        value={orientation}
      >
        <option value='vertical'>vertical</option>
        <option value='horizontal'>horizontal</option>
      </select>
      &nbsp;&nbsp;
      <label>link:</label>&nbsp;
      <select
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => setLinkType(e.target.value)}
        value={linkType}
      >
        <option value='diagonal'>diagonal</option>
        <option value='step'>step</option>
        <option value='curve'>curve</option>
        <option value='line'>line</option>
      </select>
      {linkType === 'step' && (
        <>
          &nbsp;&nbsp;
          <label>step:</label>&nbsp;
          <input
            onClick={(e) => e.stopPropagation()}
            type='range'
            min={0}
            max={1}
            step={0.1}
            onChange={(e) => setStepPercent(Number(e.target.value))}
            value={stepPercent}
            disabled={linkType !== 'step'}
          />
        </>
      )}
    </div>
  );
}
