import Card from "../components/UI/Card.jsx";
// import Data from "./services/Data.service.js";

// const { id } = useParams();
// const [modelData, setModelData] = useState({})

// useEffect(() => {
//   const fetchOneModel = async (id) => {
//     const data = await Data.getOneModel(id);
//     setLLMData(data);
//   }
//   fetchOneModel(id);
// })

function DetailedView({ aLLMData }) {
  // replace props with modelData

  return (
    <div className="flex justify-center">
      <div className="w-3/5">
        <span className="grid grid-cols-1 md:grid-cols-4">
          <span>
            <img className="" src={`${aLLMData.logo}`} alt="model logo" />
          </span>
          <span className="col-span-2">
            <h3 className="text-gray-500 font-bold pb-2">
              {aLLMData.organization}
            </h3>
            <h1 className="text-3xl pb-3">{aLLMData.name}</h1>
            <p className="text-sm pb-3">Created: {aLLMData.createdDate}</p>
          </span>
          <Card className=" md:justify-self-end md:text-right">
            <p className="text-gray-500 font-bold">LightHouse Score</p>
            <p>
              Readiness:{" "}
              <span className="font-bold text-gray-500">{aLLMData.scoreX}</span>
            </p>
            <p>
              Perceived Value:{" "}
              <span className="font-bold text-gray-500">{aLLMData.scoreY}</span>
            </p>
          </Card>
        </span>
        <p>{aLLMData.description}</p>
        <p className="text-center pt-4">
          <a className=" text-red-500/75" href={aLLMData.url} target="_blank">
            Link to Documentation
          </a>
        </p>
        <span className="flex justify-center">
          {/* <Card className="w-full text-center">
            <p className="text-gray-500 font-bold">LightHouse Score</p>
            <p>
              Readiness:{" "}
              <span className="font-bold text-gray-500">{aLLMData.scoreX}</span>
            </p>
            <p>
              Perceived Value:{" "}
              <span className="font-bold text-gray-500">{aLLMData.scoreY}</span>
            </p>
          </Card> */}
        </span>
        <hr className="my-5" />
        <div className="grid grid-cols-3 gap-3">
          <span className="col-span-2 border-r-2">
            <p>Intended Uses: {aLLMData.intendedUses}</p>
            <p>Prohibited Uses: {aLLMData.prohibitedUses}</p>
          </span>
          <p>License: {aLLMData.license}</p>
        </div>
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
        </Card>
        <Card>
          <p>License: {aLLMData.license}</p>
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
