import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
     const isAuthenticated = JSON.parse(window.sessionStorage.getItem('isAuthenticated'));
     return (
          isAuthenticated ? <Outlet /> : <Navigate to='/' />
     )
}

export default PrivateRoutes