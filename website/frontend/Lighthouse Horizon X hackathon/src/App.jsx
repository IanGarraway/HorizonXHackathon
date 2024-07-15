import { useEffect, useState } from 'react';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Data from './services/Data.service';
import TableView from './components/TableView';


function App() {
  const [lLMData, setLLMData] = useState([]);

  const getData = () => {
    const newData = Data.get();
    if (newData.status == 200) {
      setLLMData(newData.data);
    }
  }

  useEffect(() => {
    getData();
    
  }, []);

  return (
    <>
      <div>
        <TableView lLMData={lLMData} />
        
      </div>
    </>
  )
}

export default App
