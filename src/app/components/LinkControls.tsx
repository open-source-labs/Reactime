
import React from 'react';
// Font size of the Controls label and Dropdowns
const controlStyles = { 
  fontSize: '12px',
  padding: '10px',
};

const dropDownStyle = {
	margin: '0.5em',
  fontSize: '12px',
  borderRadius: '4px', 
	backgroundColor: '#242529', 
	color:'white',
	padding:'2px'
}

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
			{/* Controls for the layout selection */}
			<label>Layout:</label>
			&nbsp;
			<select
				onClick={(e) => e.stopPropagation()}
				onChange={(e) => setLayout(e.target.value)}
				value={layout}
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
				onClick={(e) => e.stopPropagation()}
				onChange={(e) => setOrientation(e.target.value)}
				value={orientation}
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
				onClick={(e) => e.stopPropagation()}
				onChange={(e) => setLinkType(e.target.value)}
				value={linkType}
				style={dropDownStyle}
			>
				<option value="diagonal">Diagonal</option>
				<option value="step">Step</option>
				<option value="line">Line</option>
			</select>
			{/* This is the slider control for the step option */}
			{linkType === 'step' && layout !== 'polar' && (
				<>
					&nbsp;&nbsp;
					<label>Step:</label>
					&nbsp;
					<input
						onClick={(e) => e.stopPropagation()}
						type="range"
						min={0}
						max={1}
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
