import { useNavigate } from "react-router-dom";

function TableLine({ lineData, setALLMData }) {
  const navigate = useNavigate();
  const onClickHandler = () => {
    setALLMData(lineData);
    navigate(`/${lineData.id}`);
  };

  // Function to truncate description to 150 characters
  const truncateDescription = (description) => {
    return description.length > 150
      ? `${description.substring(0, 150)}...`
      : description;
  };

  return (
    <tr
      className="hover:bg-red-100/50 hover:cursor-pointer"
      onClick={onClickHandler}
    >
      <td className="px-4 py-2 border">{lineData.name}</td>
      <td className="px-4 py-2 border">{lineData.organization}</td>
      <td className="px-4 py-2 border" title={lineData.description}>
        {truncateDescription(lineData.description)}
      </td>
      <td className="px-4 py-2 border">{lineData.createdDate}</td>
      <td className="px-4 py-2 border">{lineData.access}</td>
    </tr>
  );
}

export default TableLine;
