import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./login";
import Dashboard from "./dashboard";
import ViewSegments from "./ViewSegments";
import './App.css'
function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element= {<Login/>}/>
        <Route
          path="/dashboard"
          element={ <Dashboard />}
        />
        {/* You can add more routes here */}
        <Route path="/view-segments" element={<ViewSegments />} />
      </Routes>
    </Router>
  );
}

export default App;
