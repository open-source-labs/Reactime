import React from 'react'



const RenderingFrequency = (props) => {
  console.log(props)
  const perfData = props.data 

  return (
    <div>
      {
      Object.keys(perfData).map( componentName => {
        const currentComponent = perfData[componentName]
        return (
          <div>
            <h2>{componentName} </h2>
            <p>{currentComponent.stateType}</p>
            <div>Render Count: {currentComponent.renderFrequency} </div>
            <p>Average Time: {(currentComponent.totalRenderTime/currentComponent.renderFrequency).toFixed(3) } ms</p>
          </div>
        )
      })
      }
    </div>
  )
}

export default RenderingFrequency
