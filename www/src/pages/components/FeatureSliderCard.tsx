
export default function FeatureSliderCard(props:any) {

  return (
    <div className ="flex justify-center w-80%">
      <div className ="rounded-lg shadow-lg bg-white max-w-sm">
        <div className ="p-6">
          <h5 className ="text-gray-900 text-xl font-medium mb-2">
            {props.title}
          </h5>
          <p className ="text-gray-700 text-base mb-4">
            {props.desc}
          </p>
        </div>
      </div>
    </div>  
  )
}