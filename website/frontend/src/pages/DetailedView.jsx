import Card from "../components/UI/Card.jsx";
import Data from "../services/Data.service.js";
import { useState, useParams } from "react";
import Stringify from "../util/Stringify.util.js";


function DetailedView({ aModel }) {
  //console.log(aModel.name, `<--`);
  const { name, organizations, description,
    created_date, organization_logo_url, score_business_readiness,
    score_perceived_value, url, intended_uses, prohibited_uses, modality,
    analysis, size, dependencies, monitoring, feedback,
    model_card, training_emissions, training_time, training_hardware,
    quality_control, terms_of_service, monthly_active_users,
    user_distribution, license, access } = aModel;
  
  console.log(aModel, `<000`);
  const orgs = Stringify.text(organizations);
  const dependencyString = Stringify.text(dependencies);
  console.log(orgs, `<---`, organizations);

  // const { id } = useParams();
  const [modelData, setModelData] = useState({})
  // replace props with modelData
  // useEffect(() => {
  //   const fetchOneModel = async (id) => {
  //     const data = await Data.getOneModel(id);
  //     setLLMData(data);
  //   }
  //   fetchOneModel(id);
  // })
  
  const h4Class = "font-poppins text-gray-500 font-bold";
  

  return (
    <div className="flex justify-center">
      <article className="w-3/5 pb-5">
        <section>

          <span className="grid grid-cols-1 md:grid-cols-4 gap-3 pb-4">
          <span className="">
          {organization_logo_url && 
            <img src={`${organization_logo_url}`} alt="model logo" />
          }
          </span>
          <span className="col-span-2">
            <h3 className="font-poppins text-gray-500 font-bold pb-2">
              {orgs}
            </h3>
            <h1 className="font-poppins text-3xl pb-3">{name}</h1>
            <p className="text-sm pb-3">Created: {created_date}</p>
          </span>
          <Card className="md:justify-self-end md:text-right text-sm">
            <p className="font-poppins text-gray-500 font-bold">LightHouse Score</p>
            <p>
              Readiness:{" "}
              <span className="font-bold text-gray-500">{score_business_readiness}</span>
            </p>
            <p>
              Perceived Value:{" "}
              <span className="font-bold text-gray-500">{score_perceived_value}</span>
            </p>
          </Card>
          </span>
          <p>{description}</p>
          <p className="text-center pt-4">
          <a className="text-red-500/75" href={url} target="_blank">
            Link to Documentation
          </a>
          </p>        
        </section>
        <hr className="my-5" />
        <section className="grid grid-cols-3 gap-3">
          <span className="col-span-2 border-r-2">
            <h4 className={h4Class}>Intended Uses:</h4>
            <p>{intended_uses||'No data'}</p>
            <br />
            <h4 className={h4Class}>Prohibited Uses:</h4>
            <p>{prohibited_uses}</p>
          </span>
          <span>
          <h4 className={h4Class}>License:</h4>
            <p>{license}</p>
            <br />
            <h4 className={h4Class}>Access:</h4>
            <p>{access}</p>
          </span>
        </section>
        <hr className="my-5" />
        <section>
          <h4 className={h4Class}>Modality:</h4> <p>{modality}</p>
          <h4 className={h4Class}>Analysis:</h4> <p>{analysis}</p>
          <h4 className={h4Class}>Size:</h4> <p>{size}</p>
          <h4 className={h4Class}>Dependencies:</h4> <p>{dependencyString}</p>
          <h4 className={h4Class}>Model Card:</h4><a className="text-red-500/75" href={model_card} target="_blank">View the Model Card</a>
        </section>
        <hr className="my-5" />
          <p><span className={h4Class}>Training Emissions: </span> {training_emissions}</p>
          <p><span className={h4Class}>Training Time:</span> {training_time}</p>
          <p><span className={h4Class}>Training Hardware: </span> {training_hardware}</p>
          <hr className="my-5" />
          <p><span className={h4Class}>Quality Control:</span> {quality_control}</p>
          <hr className="my-5" />
          <p><span className={h4Class}>Monitoring:</span> {monitoring}</p>
          <p><span className={h4Class}>Feedback: </span> <a href={feedback}>{feedback}</a></p>
        
          <hr className="my-5" />

        
         
 
      </article>
    </div>
  );
}

export default DetailedView;
