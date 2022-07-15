import { List } from '@material-ui/core';
import React from 'react';
import snapshots from './snapshots';
// Font size of the Controls label and Dropdowns
const controlStyles = {
  fontSize: '12px',
  padding: '10px',
};

const dropDownStyle = {
  margin: '0.5em',
  fontSize: '12px',
  fontFamily: 'Roboto, sans-serif',
  borderRadius: '4px',
  borderStyle: 'solid',
  borderWidth: '1px',
  backgroundColor: '#242529',
  color: 'white',
  padding: '2px',
};

type Props = {
  layout: string;
  orientation: string;
  linkType: string;
  stepPercent: number;
  selectedNode: string;
  setLayout: (layout: string) => void;
  setOrientation: (orientation: string) => void;
  setLinkType: (linkType: string) => void;
  setStepPercent: (percent: number) => void;
  setSelectedNode: (selectedNode: string) => void;
  snapShots: [];
};

//use BFS to put all the nodes under snapShots(which is the tree node) into an array
const nodeList = [];

const collectNodes = (node) => {
  nodeList.splice(0, nodeList.length); { /* We used the .splice method here to ensure that nodeList did not accumulate with page refreshes */ }
  nodeList.push(node);
  for (let i = 0; i < nodeList.length; i++) {
    const cur = nodeList[i];
    if (cur.children && cur.children.length > 0) {
      for (let child of cur.children) {
        nodeList.push(child);
      }
    }
  }
};

export default function LinkControls({
  layout,
  orientation,
  linkType,
  stepPercent,
  selectedNode,
  setLayout,
  setOrientation,
  setLinkType,
  setStepPercent,
  setSelectedNode,
  snapShots,
}: Props) {
  collectNodes(snapShots);

  return (
    <div style={controlStyles}>

      {/* Controls for the layout selection */}
      <label>Layout:</label>
      &nbsp;
      <select
        onClick={e => e.stopPropagation()}
        onChange={e => setLayout(e.target.value)}
        // value={layout}
        style={dropDownStyle}
      >
        <option value="cartesian">Cartesian</option>
        <option value="polar">Polar</option>
      </select>
      &nbsp;&nbsp;

      {/* Controls for the Orientation selection, this dropdown will be disabled when the polar layout is selected as it is not needed */}
      <label>Orientation:</label>
      &nbsp;
      <select
        onClick={e => e.stopPropagation()}
        onChange={e => setOrientation(e.target.value)}
        // value={orientation}/
        disabled={layout === 'polar'}
        style={dropDownStyle}
      >
        <option value="horizontal">Horizontal</option>
        <option value="vertical">Vertical</option>
      </select>
      &nbsp;&nbsp;

      {/* Controls for the link selections. */}
      <label>Link:</label>
      &nbsp;
      <select
        onClick={e => e.stopPropagation()}
        onChange={e => setLinkType(e.target.value)}
        style={dropDownStyle}
      >
        <option value="diagonal">Diagonal</option>
        <option value="step">Step</option>
        <option value="line">Line</option>
      </select>

      {/* Controls for the select selections. */}
      <label> Select:</label>
      &nbsp; {/*This is a non-breaking space - Prevents an automatic line break at this position */}
      <input id='selectInput' list='nodeOptions' type='text' name="nodeOptions"
        onChange={e => setSelectedNode(e.target.value)}
        style={dropDownStyle}
      />
      <datalist id='nodeOptions'>
        {nodeList.map(node => (
          <option key={node.name} value={node.name}>{node.name}</option>
        ))}
      </datalist>

      {/* This is the slider control for the step option */}
      {linkType === 'step' && layout !== 'polar' && (
        <>
          &nbsp;&nbsp;
          <label>Step:</label>
          &nbsp;
          <input
            onClick={e => e.stopPropagation()}
            type="range"
            min={0}
            max={1}
            step={0.1}
            onChange={e => setStepPercent(Number(e.target.value))}
            value={stepPercent}
            disabled={linkType !== 'step' || layout === 'polar'}
          />
        </>
      )}
    </div>
  );
}
