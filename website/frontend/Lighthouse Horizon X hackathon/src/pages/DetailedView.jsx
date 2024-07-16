import Card from "../components/UI/Card.jsx";

function DetailedView({ aLLMData }) {
  return (
    <div className="flex justify-center">
      <div className="text-left w-3/5">
        <h3 className="text-gray-500 font-bold pb-2">
          {aLLMData.organization}
        </h3>
        <h1 className="text-3xl pb-3">{aLLMData.name} </h1>
        <p className="text-sm pb-3">Created: {aLLMData.createdDate}</p>
        <p>{aLLMData.description}</p>
        <hr className="my-5" />
        <Card>
          <p className="truncate">Model Card: {aLLMData.modelCard}</p>
          <p>Modality: {aLLMData.modality}</p>
          <p>Analysis: {aLLMData.analysis}</p>
          <p>Size: {aLLMData.size}</p>
        </Card>
        <Card>
          <p>Dependancies: {aLLMData.dependencies}</p>

          <p>Quality Control: {aLLMData.qualityControl}</p>
          <p>Access: {aLLMData.access}</p>
          <p>License: {aLLMData.license}</p>
        </Card>
        <Card>
          <p>Intended Uses: {aLLMData.intendedUses}</p>
          <p>Prohibited Uses: {aLLMData.prohibitedUses}</p>
        </Card>
        <Card>
          <p>Monitoring: {aLLMData.monitoring}</p>
          <p>Feedback: {aLLMData.feedback}</p>
        </Card>
        <Card>
          <h1>Training</h1>
          <p>Training Emissions: {aLLMData.trainingEmissions}</p>
          <p>Training Time: {aLLMData.trainingTime}</p>
          <p>Training Hardware: {aLLMData.trainingHardware}</p>
        </Card>
      </div>
    </div>
  );
}

export default DetailedView;
