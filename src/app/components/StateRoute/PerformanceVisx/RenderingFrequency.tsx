/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { setCurrentTabInApp } from '../../../slices/mainSlice';
import { useDispatch } from 'react-redux';

/*
  
*/

const RenderingFrequency = (props) => {
  const perfData = props.data;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCurrentTabInApp('performance-comparison')); // dispatch sent at initial page load allowing changing "immer's" draft.currentTabInApp to 'performance-comparison' to facilitate render.
  }, []);

  return (
    <div>
      {Object.keys(perfData).map((componentName) => {
        const currentComponent = perfData[componentName];
        return (
          <ComponentCard
            key={componentName}
            componentName={componentName}
            stateType={currentComponent.stateType}
            averageRenderTime={(
              currentComponent.totalRenderTime / currentComponent.renderFrequency
            ).toFixed(3)}
            renderFrequency={currentComponent.renderFrequency}
            rtid={currentComponent.rtid}
            information={perfData[componentName].information}
          />
        );
      })}
    </div>
  );
};

const ComponentCard = (props): JSX.Element => {
  const { componentName, stateType, averageRenderTime, renderFrequency, information } = props;
  const [expand, setExpand] = useState(false);

  // render time for each component from each snapshot
  // differences in state change that happened prior;

  const dataComponentArray = [];
  for (let i = 0; i < information.length; i++) {
    dataComponentArray.push(
      <DataComponent
        key={`DataComponent${i}`}
        header={Object.keys(information[i])}
        paragraphs={Object.values(information[i])}
      />,
    );
  }

  return (
    <div className='borderStyling'>
      <div className={expand ? 'ExpandStyledGridElement' : 'StyledGridElement'}>
        <div className='RenderLeft'>
          <h3>{componentName} </h3>
          <h4>{stateType}</h4>
          <h4>average time: {averageRenderTime} ms</h4>
        </div>
        <div
          onClick={() => {
            if (expand === true) {
              setExpand(false);
            } else {
              setExpand(true);
            }
          }}
          className='RenderRight'
        >
          <p>{renderFrequency}</p>
        </div>
      </div>
      <div className={expand === true ? 'DataComponent' : null}>
        {expand === true ? dataComponentArray : null}
      </div>
    </div>
  );
};

const DataComponent = (props) => {
  const { header, paragraphs } = props;

  return (
    <div className='borderCheck'>
      <h4> {header}</h4>
      <p>{`renderTime: ${paragraphs[0].rendertime}`}</p>
    </div>
  );
};

export default RenderingFrequency;
