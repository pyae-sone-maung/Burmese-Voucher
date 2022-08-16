import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashbord from "./pages/Dashbord";
import PrivateRoutes from "./utils/PrivateRoute";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<PrivateRoutes />} >
            <Route path="/dashbord/*" element={<Dashbord />} />
          </Route>
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;