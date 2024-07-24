import Card from "../components/UI/Card.jsx";
import Data from "../services/Data.service.js";
import Loading from "../components/Loading.jsx";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Stringify from "../util/Stringify.util.js";

function DetailedView() {
  const [modelData, setModelData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchOneModel = async (id) => {
      const data = await Data.getOneModel(id);
      setModelData(data[0]);
      setIsLoading(false);
    };
    fetchOneModel(id);
  }, [id]);

  if (isLoading) return <Loading />;

  const orgs = Stringify.text(modelData.organizations);
  const dependencyString = Stringify.text(modelData.dependencies);

  const h4Class = "font-poppins text-gray-500 font-bold";

  const creationDate = new Date(modelData.created_date);

  return (
    <div className="flex justify-center">
      <article className="w-3/5 pb-5">
        <section>
          <span className="grid grid-cols-1 md:grid-cols-4 gap-3 pb-4">
            <span className="">
              {modelData.organization_logo_url && (
                <img src={modelData.organization_logo_url} alt="model logo" />
              )}
            </span>
            <span className="col-span-2">
              <h3 className="font-poppins text-gray-500 font-bold pb-2">
                {orgs}
              </h3>
              <h1 className="font-poppins text-3xl pb-3">{modelData.name}</h1>
              <p className="text-sm pb-3">
                Created: {creationDate.toLocaleDateString("en-GB")}
              </p>
            </span>
            <Card className="md:justify-self-end md:text-right text-sm">
              <p className="font-poppins text-gray-500 font-bold">
                LightHouse Score
              </p>
              <span>
                <div className="mb-1 font-semibold text-gray-500">
                  Readiness: {modelData.score_business_readiness}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-fire h-2 rounded-full"
                    style={{
                      width: `${modelData.score_business_readiness * 10}%`,
                    }}
                  ></div>
                </div>
              </span>
              <span>
                <div className="mb-1 font-semibold text-gray-500">
                  Perceived Value: {modelData.score_perceived_value}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4 dark:bg-gray-700">
                  <div
                    className="bg-fire h-2 rounded-full"
                    style={{
                      width: `${modelData.score_perceived_value * 10}%`,
                    }}
                  ></div>
                </div>
              </span>
            </Card>
          </span>
          <p>{modelData.description}</p>
          <p className="text-center pt-4">
            <a className="text-red-500/75" href={modelData.url} target="_blank">
              Link to Documentation
            </a>
          </p>
        </section>
        <hr className="my-5" />
        <section className="grid grid-cols-3 gap-3">
          <span className="col-span-2 border-r-2">
            <h4 className={h4Class}>Intended Uses:</h4>
            <p>{modelData.intended_uses || "Unknown"}</p>
            <br />
            <h4 className={h4Class}>Prohibited Uses:</h4>
            <p>{modelData.prohibited_uses || "Unknown"}</p>
          </span>
          <span>
            <h4 className={h4Class}>License:</h4>
            <p>{modelData.license || "Unknown"}</p>
            <br />
            <h4 className={h4Class}>Access:</h4>
            <p>{modelData.access || "Unknown"}</p>
          </span>
        </section>
        <hr className="my-5" />
        <section>
          <h4 className={h4Class}>Modality:</h4>{" "}
          <p>{modelData.modality || "Unknown"}</p>
          <h4 className={h4Class}>Analysis:</h4>{" "}
          <p>{modelData.analysis || "Unknown"}</p>
          <h4 className={h4Class}>Size:</h4>{" "}
          <p>{modelData.size || "Unknown"}</p>
          <h4 className={h4Class}>Dependencies:</h4>{" "}
          <p>{dependencyString || "Unknown"}</p>
          <h4 className={h4Class}>Model Card:</h4>
          <a
            className="text-red-500/75"
            href={modelData.model_card || "Unknown"}
            target="_blank"
          >
            View the Model Card
          </a>
        </section>
        <hr className="my-5" />
        <p>
          <span className={h4Class}>Training Emissions: </span>{" "}
          {modelData.training_emissions || "Unknown"}
        </p>
        <p>
          <span className={h4Class}>Training Time:</span>{" "}
          {modelData.training_time || "Unknown"}
        </p>
        <p>
          <span className={h4Class}>Training Hardware: </span>{" "}
          {modelData.training_hardware || "Unknown"}
        </p>
        <hr className="my-5" />
        <p>
          <span className={h4Class}>Quality Control:</span>{" "}
          {modelData.quality_control || "Unknown"}
        </p>
        <hr className="my-5" />
        <p>
          <span className={h4Class}>Monitoring:</span>{" "}
          {modelData.monitoring || "Unknown"}
        </p>
        <p>
          <span className={h4Class}>Feedback: </span>{" "}
          <a href={modelData.feedback}>{modelData.feedback || "Unknown"}</a>
        </p>

        <hr className="my-5" />
      </article>
    </div>
  );
}

export default DetailedView;
