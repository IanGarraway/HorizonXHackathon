import { useNavigate } from "react-router-dom";
import Stringify from "../util/Stringify.util";

function TableLine({ lineData }) {
  const navigate = useNavigate();
  const onClickHandler = () => {
    // setAModel(lineData);
    navigate(`/${lineData.model_id}`);
  };

  // Function to truncate description to 150 characters
  const truncateDescription = (description) => {
    if (description === null) return;
    return description.length > 150
      ? `${description.substring(0, 150)}...`
      : description;
  };
  const creationDate = new Date(lineData.created_date);

  return (
    <tr
      className="hover:bg-red-100/50 hover:cursor-pointer"
      onClick={onClickHandler}
    >
      <td className="px-4 py-2 border">{lineData.name}</td>
      <td className="px-4 py-2 border">
        {Stringify.text(lineData.organizations)}
      </td>
      <td className="px-4 py-2 border" title={lineData.description || ""}>
        {truncateDescription(lineData.description)}
      </td>
      <td className="px-4 py-2 border">
        {creationDate.toLocaleDateString("en-GB")}
      </td>
      <td className="px-4 py-2 border">
        {lineData.score_business_readiness} / {lineData.score_perceived_value}
      </td>
    </tr>
  );
}

export default TableLine;
