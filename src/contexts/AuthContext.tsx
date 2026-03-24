import React, { createContext, useContext, useState, useEffect } from 'react';
import { SERVER_BASE_URL } from '@/lib/api';

interface User {
    id: number;
    email: string;
    name: string;
    role?: 'admin' | 'user';
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (username: string, email: string, phone: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is already logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    const response = await fetch(`${SERVER_BASE_URL}/api/auth/verify`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token }),
                    });

                    const data = await response.json();
                    if (data.success && data.user) {
                        setUser(data.user);
                    } else {
                        localStorage.removeItem('auth_token');
                    }
                } catch (error) {
                    console.error('Auth check failed:', error);
                    localStorage.removeItem('auth_token');
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        // Default admin credentials fallback
        if (email.toLowerCase() === 'admin123@gmail.com' && password === 'admin') {
            const adminUser: User = {
                id: -1,
                email: 'admin123@gmail.com',
                name: 'Admin',
                role: 'admin',
            };
            setUser(adminUser);
            localStorage.setItem('auth_token', 'admin-default-token');
            return true;
        }

        try {
            const response = await fetch(`${SERVER_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (data.success && data.token && data.user) {
                localStorage.setItem('auth_token', data.token);
                setUser(data.user);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const signup = async (username: string, email: string, phone: string, password: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const response = await fetch(`${SERVER_BASE_URL}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: username, email, phone, password }),
            });

            const data = await response.json();
            if (data.success && data.token && data.user) {
                localStorage.setItem('auth_token', data.token);
                setUser(data.user);
                return { success: true };
            }
            return {
                success: false,
                message: typeof data.message === 'string' ? data.message : 'Sign up failed. Please try again.',
            };
        } catch (error) {
            console.error('Signup failed:', error);
            return { success: false, message: 'Could not reach signup service. Please try again.' };
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                signup,
                logout,
                isAuthenticated: !!user,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
