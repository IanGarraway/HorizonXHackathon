import { useEffect, useState } from "react";
import Loading from "./Loading";
import TableLine from "./TableLine";
import Filter from "../util/Filter.util.js";

function TableView({ lLMData, setALLMData, filters }) {
  const [tableLines, setTableLines] = useState([]);

  useEffect(() => {
    generateTable();
  }, [lLMData, filters]);

  const generateTable = () => {
    let modelData = lLMData;
    if (filters.name) { modelData = Filter.byName(modelData, filters.name); }
    if (filters.organisation) { modelData = Filter.byOrganisation(modelData, filters.organisation); }
    const tableData = modelData.map((data) => (
      <TableLine lineData={data} key={data.id} setALLMData={setALLMData} />
    ));

    setTableLines(tableData);
  };

  if (lLMData.length == 0) {
    return <Loading />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="font-poppins bg-gray-200 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Organisation</th>
            <th className="px-4 py-2 border">Description</th>
            <th className="px-4 py-2 border">Created</th>
            <th className="px-4 py-2 border">Score X / Y</th>
          </tr>
        </thead>
        <tbody>{tableLines}</tbody>
      </table>
    </div>
  );
}

export default TableView;
