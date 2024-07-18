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

  const h4Class = "font-poppins text-gray-500 font-bold";

  return (
    <div className="flex justify-center">
      <article className="w-3/5 pb-5">
        <section>

          <span className="grid grid-cols-1 md:grid-cols-4 gap-3 pb-4">
          <span className="">
          {aLLMData.logo && 
            <img src={`${aLLMData.logo}`} alt="model logo" />
          }
          </span>
          <span className="col-span-2">
            <h3 className="font-poppins text-gray-500 font-bold pb-2">
              {aLLMData.organization}
            </h3>
            <h1 className="font-poppins text-3xl pb-3">{aLLMData.name}</h1>
            <p className="text-sm pb-3">Created: {aLLMData.createdDate}</p>
          </span>
          <Card className="md:justify-self-end md:text-right text-sm">
            <p className="font-poppins text-gray-500 font-bold">LightHouse Score</p>
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
          <a className="text-red-500/75" href={aLLMData.url} target="_blank">
            Link to Documentation
          </a>
          </p>        
        </section>
        <hr className="my-5" />
        <section className="grid grid-cols-3 gap-3">
          <span className="col-span-2 border-r-2">
            <h4 className={h4Class}>Intended Uses:</h4>
            <p>{aLLMData.intendedUses}</p>
            <br />
            <h4 className={h4Class}>Prohibited Uses:</h4>
            <p>{aLLMData.prohibitedUses}</p>
          </span>
          <span>
          <h4 className={h4Class}>License:</h4>
            <p>{aLLMData.license}</p>
            <br />
            <h4 className={h4Class}>Access:</h4>
            <p>{aLLMData.access}</p>
          </span>
        </section>
        <hr className="my-5" />
        <section>
          <h4 className={h4Class}>Modality:</h4> <p>{aLLMData.modality}</p>
          <h4 className={h4Class}>Analysis:</h4> <p>{aLLMData.analysis}</p>
          <h4 className={h4Class}>Size:</h4> <p>{aLLMData.size}</p>
          <h4 className={h4Class}>Dependencies:</h4> <p>{aLLMData.dependencies}</p>
          <h4 className={h4Class}>Model Card:</h4><a className="text-red-500/75" href={aLLMData.modelCard} target="_blank">View the Model Card</a>
        </section>
        <hr className="my-5" />
          <p><span className={h4Class}>Training Emissions: </span> {aLLMData.trainingEmissions}</p>
          <p><span className={h4Class}>Training Time:</span> {aLLMData.trainingTime}</p>
          <p><span className={h4Class}>Training Hardware: </span> {aLLMData.trainingHardware}</p>
          <hr className="my-5" />
          <p><span className={h4Class}>Quality Control:</span> {aLLMData.qualityControl}</p>
          <hr className="my-5" />
          <p><span className={h4Class}>Monitoring:</span> {aLLMData.monitoring}</p>
          <p><span className={h4Class}>Feedback: </span> <a href={aLLMData.feedback}>{aLLMData.feedback}</a></p>
        
          <hr className="my-5" />

        
         
 
      </article>
    </div>
  );
}

export default DetailedView;
