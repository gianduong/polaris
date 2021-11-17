import './App.scss';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
//#region component
import Register from "./components/Register"
import UserList from "./components/UserList"
import Catch404 from "./components/Catch404"
//#endregion


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Register />} />
        <Route exact path="/UserList" element={<UserList />} />
        <Route path="*" element={<Catch404 />} />
      </Routes>
    </Router>
  )
}

export default App;