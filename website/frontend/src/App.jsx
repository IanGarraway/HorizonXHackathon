import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Data from "./services/Data.service.js";
import DetailedView from "./pages/DetailedView.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import ListView from "./pages/ListView.jsx";
import Matrix from "./pages/Matrix.jsx";

function App() {
  const [allModels, setAllModels] = useState([]);

  const getData = async () => {
    const newData = await Data.getAllData();
    if (newData.status == 200) {
      setAllModels(newData.data);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="min-h-screen font-open flex flex-col">
      <div className="flex-grow">
        <div
          style={{
            backgroundImage: "url('logo.png')",
            opacity: "0.04",
            height: "100vh",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            position: "fixed",
            top: "0px",
            right: "0px",
            bottom: "0px",
            left: "0px",
            zIndex: "-1",
          }}
        >
          {" "}
        </div>
        <Header />
        <Routes>
          <Route path="/" element={<ListView allModels={allModels} />} />
          <Route path="/:id" element={<DetailedView />} />
          <Route path="/matrix" element={<Matrix />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
