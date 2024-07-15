import { useEffect, useState } from 'react'
import Loading from './Loading'
import TableLine from './TableLine';
import Card from './UI/Card';

function TableView({ lLMData }) {
    const [tableLines, setTableLines] = useState([]);

    useEffect(() => {
        generateTable();
    },[lLMData])
    
    const generateTable = () => {

        const tableData = lLMData.map((data) => (
            <TableLine lineData={data} key={data.id_} />
        ));
       

        setTableLines(tableData);
    };
    
    if (lLMData.length == 0) {
        return (
            <Loading />        
        )
    }
    

    return (
        <div>
             <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-200 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-2 border">Header 1</th>
            <th className="px-4 py-2 border">Header 2</th>
            <th className="px-4 py-2 border">Header 3</th>
            <th className="px-4 py-2 border">Header 4</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 50 }, (_, i) => (
            <tr key={i} className="hover:bg-gray-100">
              <td className="px-4 py-2 border">Data {i + 1}-1</td>
              <td className="px-4 py-2 border">Data {i + 1}-2</td>
              <td className="px-4 py-2 border">Data {i + 1}-3</td>
              <td className="px-4 py-2 border">Data {i + 1}-4</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        
      <div>{tableLines}</div>
      </div>
  )
}

export default TableView