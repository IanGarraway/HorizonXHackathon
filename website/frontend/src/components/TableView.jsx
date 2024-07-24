import { useEffect, useState } from "react";
import Loading from "./Loading";
import TableLine from "./TableLine.jsx";
import Filter from "../util/Filter.util.js";

function TableView({ allModels, filters }) {
  const [tableLines, setTableLines] = useState([]);

  useEffect(() => {
    generateTable();
  }, [allModels, filters]);

  const generateTable = () => {
    const filteredModels = Filter.filterModels(allModels, filters);
    const tableData = filteredModels.map((data) => (
      <TableLine lineData={data} key={data.model_id} />
    ));

    setTableLines(tableData);
  };

  if (allModels.length == 0) {
    return <Loading />;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-transparent border border-gray-200 drop-shadow-md">
          <thead className="font-poppins sticky top-0 z-10 text-gray-500 font-bold text-center">
            <tr>
              <th
                className="px-4 py-2 border"
                data-tooltip-target="tooltip-name"
                data-tooltip-placement="top"
              >
                Name
                <button />
              </th>
              <th className="px-4 py-2 border">Organization</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Created</th>
              <th className="px-4 py-2 border">Score X / Y</th>
            </tr>
          </thead>
          <tbody>{tableLines}</tbody>
        </table>
      </div>
      <div
        id="tooltip-name"
        role="tooltip"
        className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
        data-tooltip="tooltip-name"
      >
        Tooltip on top
        <div className="tooltip-arrow" data-popper-arrow></div>
      </div>
    </>
  );
}

export default TableView;
