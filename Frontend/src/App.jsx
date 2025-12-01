import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Container } from 'react-bootstrap';
import './App.css'

import Sidebar from "./components/Sidebar";
import EmployeeList from "./views/employees/employeeList";
import DepartmentList from "./views/departments/departmentList";
import CreateNewDepartment from "./views/departments/createNewDepartment";
import CreateNewEmployee from "./views/employees/createNewEmployee";
import DepartmentView from "./views/departments/departmentView";
import LoginForm from "./views/auth/LoginForm";
import RegisterForm from "./views/auth/RegisterForm";

// Composant pour protéger les routes
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    const isAuthenticated = localStorage.getItem('token');

    return (
        <BrowserRouter>
            <div id="wrapper">
                {isAuthenticated && <Sidebar />}
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <Container fluid className={isAuthenticated ? 'page-contaniner' : ''}>
                            <Routes>
                                {/* Routes publiques */}
                                <Route path="/login" element={<LoginForm />} />
                                <Route path="/register" element={<RegisterForm />} />
                                
                                {/* Routes protégées */}
                                <Route path="/departments" element={
                                    <ProtectedRoute>
                                        <DepartmentList />
                                    </ProtectedRoute>
                                } />
                                <Route path="/employees" element={
                                    <ProtectedRoute>
                                        <EmployeeList />
                                    </ProtectedRoute>
                                } />
                                <Route path="/departments/create" element={
                                    <ProtectedRoute>
                                        <CreateNewDepartment />
                                    </ProtectedRoute>
                                } />
                                <Route path="/employees/create" element={
                                    <ProtectedRoute>
                                        <CreateNewEmployee />
                                    </ProtectedRoute>
                                } />
                                <Route path="/departments/:departmentName" element={
                                    <ProtectedRoute>
                                        <DepartmentView />
                                    </ProtectedRoute>
                                } />
                                
                                {/* Redirection par défaut */}
                                <Route path="/" element={
                                    <Navigate to={isAuthenticated ? "/employees" : "/login"} />
                                } />
                            </Routes>
                        </Container>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;