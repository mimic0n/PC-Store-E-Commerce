import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogout, getAdminProfile } from '../api/adminAuthService';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Kiểm tra authentication khi app load
    useEffect(() => {
        const checkAuth = async () => {
            const savedAdmin = localStorage.getItem('adminUser');
            const accessToken = localStorage.getItem('adminAccessToken');

            if (savedAdmin && accessToken) {
                try {
                    const adminData = JSON.parse(savedAdmin);
                    // Verify role
                    if (adminData.role === 'admin') {
                        setAdmin(adminData);
                        setIsAuthenticated(true);
                    } else {
                        handleLogout();
                    }
                } catch (error) {
                    handleLogout();
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    // Login handler
    const handleLogin = (userData, accessToken) => {
        if (userData.role !== 'admin') {
            throw new Error('Unauthorized access');
        }
        
        localStorage.setItem('adminAccessToken', accessToken);
        localStorage.setItem('adminUser', JSON.stringify(userData));
        setAdmin(userData);
        setIsAuthenticated(true);
    };

    // Logout handler
    const handleLogout = async () => {
        try {
            await adminLogout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('adminAccessToken');
            localStorage.removeItem('adminUser');
            setAdmin(null);
            setIsAuthenticated(false);
        }
    };

    // Update admin info
    const updateAdmin = (updatedData) => {
        const newAdminData = { ...admin, ...updatedData };
        setAdmin(newAdminData);
        localStorage.setItem('adminUser', JSON.stringify(newAdminData));
    };

    const value = {
        admin,
        setAdmin,
        isAuthenticated,
        isLoading,
        handleLogin,
        handleLogout,
        updateAdmin,
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

// Custom hook
export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within AdminProvider');
    }
    return context;
};