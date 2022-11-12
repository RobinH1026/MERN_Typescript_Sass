import React from 'react';
import { Routes, Route } from "react-router-dom";
import './App.scss';
import "bootstrap/dist/css/bootstrap.min.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";

const App: React.FC = () => {

  return (
    <div>
      <div className="container mt-3 text-center">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
