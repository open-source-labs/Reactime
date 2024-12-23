import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleAxTree, setCurrentTabInApp } from '../../../slices/mainSlice';

const AxLinkControls = ({
  orientation,
  linkType,
  stepPercent,
  setOrientation,
  setLinkType,
  setStepPercent,
  setShowTree,
  setShowParagraph,
}) => {
  const dispatch = useDispatch();
  const disableAxTree = () => {
    dispatch(toggleAxTree('toggleAxRecord'));
    setShowTree(false);
    setShowParagraph(true);
  };

  return (
    <div className='link-controls'>
      <div className='accessibility-disable'>
        <input
          type='radio'
          id='disable'
          name='accessibility'
          value='disable'
          onChange={disableAxTree}
        />
        <label htmlFor='disable'>Disable</label>
      </div>

      <div className='control-group'>
        <label className='control-label'>Orientation:</label>
        <select
          className='control-select'
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setOrientation(e.target.value)}
          value={orientation}
        >
          <option value='vertical'>Vertical</option>
          <option value='horizontal'>Horizontal</option>
        </select>
      </div>

      <div className='control-group'>
        <label className='control-label'>Link:</label>
        <select
          className='control-select'
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setLinkType(e.target.value)}
          value={linkType}
        >
          <option value='diagonal'>Diagonal</option>
          <option value='step'>Step</option>
          <option value='curve'>Curve</option>
          <option value='line'>Line</option>
        </select>
      </div>

      {linkType === 'step' && (
        <div className='control-group'>
          <label className='control-label'>Step:</label>
          <input
            onClick={(e) => e.stopPropagation()}
            type='range'
            min={0}
            max={1}
            step={0.1}
            onChange={(e) => setStepPercent(Number(e.target.value))}
            value={stepPercent}
            disabled={linkType !== 'step'}
            className='control-range'
          />
        </div>
      )}
    </div>
  );
};

export default AxLinkControls;
