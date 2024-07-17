import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Data from "./services/Data.service";
import Header from "./components/Header";
import ListView from "./pages/ListView.jsx";
import DetailedView from "./pages/DetailedView.jsx";

function App() {
  const [lLMData, setLLMData] = useState([]);
  const [aLLMData, setALLMData] = useState([]);

  const getData = () => {
    const newData = Data.get();
    if (newData.status == 200) {
      setLLMData(newData.data);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <Header />
      <Routes>
        <Route
          path="/"
          element={<ListView lLMData={lLMData} setALLMData={setALLMData} />}
        />
        <Route path="/:id" element={<DetailedView aLLMData={aLLMData} />} />
      </Routes>
    </div>
  );
}

export default App;
