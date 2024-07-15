import React, { useEffect, useState } from 'react'
import Loading from './Loading'
import TableLine from './TableLine';

function TableView({ lLMData }) {
    const [tableLines, setTableLines] = useState([]);

    useEffect(() => {
        generateTable();
    },[lLMData])
    
    const generateTable = () => {
        let tableData = [];
        lLMData.forEach(line => {
            tableData.push(<TableLine lineData={line} key={line.id_} />)
        });

        setTableLines(tableData);
    };
    
    if (lLMData.length == 0) {
        return (
            <Loading />        
        )
    }
    

  return (
    <div>{tableLines}</div>
  )
}

export default TableView