import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import Dashboard from "./Dashboard";
import Login from "./Login";

const App = () => {
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
