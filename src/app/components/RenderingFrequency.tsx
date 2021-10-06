import React from 'react';
import { onHover, onHoverExit } from '../actions/actions';
import { useStoreContext } from '../store';

const RenderingFrequency = (props) => {
  const perfData = props.data;
  return (
    <div>
      {Object.keys(perfData).map((componentName) => {
        const currentComponent = perfData[componentName];
        return (
          <ComponentCard
            componentName={componentName}
            stateType={currentComponent.stateType}
            averageRenderTime={(
              currentComponent.totalRenderTime /
              currentComponent.renderFrequency
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

const ComponentCard = (props) => {
  const {
    componentName,
    stateType,
    averageRenderTime,
    renderFrequency,
    rtid,
    information,
  } = props;
  const [{ tabs, currentTab }, dispatch] = useStoreContext();

  // const onMouseMove = () => {
  //   console.log(rtid);
  //   dispatch(onHover(rtid));
  // };
  // const onMouseLeave = () => {
  //   console.log(rtid);
  //   dispatch(onHoverExit(rtid));
  // };
  console.log('this is the information', information)

// render time for each component from each snapshot
// differences in state change that happened prior;

  return (
    <div
      // onMouseLeave={onMouseLeave}
      // onMouseMove={onMouseMove}
      className="StyledGridElement"
    >
      <div className="RenderLeft">
        <h3>{componentName} </h3>
        <h4>{stateType}</h4>
        <h4>average time: {averageRenderTime} ms</h4>
      </div>
      <div onClick={() => console.log('this is triggering')} className="RenderRight">
        <p>{renderFrequency}</p>
      </div>
      {/* <div>
        <p>{information}</p>
      </div> */}
    </div>
  );
};

export default RenderingFrequency;
