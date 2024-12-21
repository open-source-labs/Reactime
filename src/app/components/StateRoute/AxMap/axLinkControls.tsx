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
    dispatch(setCurrentTabInApp('AxTree'));
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
          <option value='vertical'>vertical</option>
          <option value='horizontal'>horizontal</option>
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
          <option value='diagonal'>diagonal</option>
          <option value='step'>step</option>
          <option value='curve'>curve</option>
          <option value='line'>line</option>
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
