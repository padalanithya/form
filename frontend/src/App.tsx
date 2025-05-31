import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import EmployeeForm from './EmployeeForm';
import EmployeeTable from './EmployeeTable';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Default route to redirect to /employee-table */}
        <Route path="/" element={<Navigate to="/employee-table" replace />} />

        {/* Actual Routes */}
        <Route path="/employee-form" element={<EmployeeForm />} />
        <Route path="/employee-table" element={<EmployeeTable />} />
      </Routes>
    </Router>
  );
};

export default App;
