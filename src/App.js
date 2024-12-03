import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import { TodoWrapper } from './pages/TodoWrapper';
import './App.css';

function App() {
  const isAuthenticated = false;

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
          />
          <Route 
            path="/" 
            element={isAuthenticated ? <TodoWrapper /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;