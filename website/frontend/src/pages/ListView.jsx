import { useState } from "react";
import TableView from "../components/TableView.jsx";
import Filters from "../components/Filters.jsx";

const emptyFilters = {
  name: "",
  organisation: "",
}

function ListView({ lLMData, setALLMData }) {

  const [filters, setFilters] = useState({emptyFilters});
  return (
    <div className="columns-2 flex gap-5">
      <span className="hidden md:inline"><Filters filters={filters} setFilters={setFilters} /></span>
      <span>
        <TableView lLMData={lLMData} setALLMData={setALLMData} filters={filters } />
      </span>
    </div>
  );
}

export default ListView;
