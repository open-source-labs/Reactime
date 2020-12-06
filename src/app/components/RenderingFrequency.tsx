
import React from 'react';


const RenderingFrequency = (props) => {
  const perfData = props.data 

  return (
    <div>
      {
      Object.keys(perfData).map( componentName => {
        const currentComponent = perfData[componentName]
        return (
					<div className="StyledGridElement">
						<div className="RenderLeft">
							<h3>{componentName} </h3>
							<h4>{currentComponent.stateType}</h4>
							<h4>
								average time:{' '}
								{(
									currentComponent.totalRenderTime /
									currentComponent.renderFrequency
								).toFixed(3)}{' '}
								ms
							</h4>
						</div>
						<div className="RenderRight">
							<p>{currentComponent.renderFrequency}</p>
						</div>
					</div>
				);
      })
      }
    </div>
  )
}

export default RenderingFrequency;
