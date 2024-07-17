import TableView from "../components/TableView.jsx";

function ListView({ lLMData, setALLMData }) {
  return (
    <div className="columns-2 flex gap-5">
      <span className="hidden md:inline">Sorting/Filter here</span>
      <span>
        <TableView lLMData={lLMData} setALLMData={setALLMData} />
      </span>
    </div>
  );
}

export default ListView;
