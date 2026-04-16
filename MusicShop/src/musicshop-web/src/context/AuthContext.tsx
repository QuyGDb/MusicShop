import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: any | null;
  accessToken: string | null;
  setAuth: (user: any, token: string) => void;
  clearAuth: () => void;
}

// 1. Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Setup Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Component Mount: Lấy thông tin phiên từ Local Storage
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setAccessToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user from local storage:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Hàm cập nhật trạng thái đăng nhập
  const setAuth = (newUser: any, newToken: string) => {
    setUser(newUser);
    setAccessToken(newToken);
    localStorage.setItem('accessToken', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  // Hàm đăng xuất
  const clearAuth = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom Hook (Vanilla React) để chui vào các Component con lấy data
export function useAuth() {
  const context = useContext(AuthContext);
  // Nếu gọi useAuth ở bên ngoài thẻ <AuthProvider>, React sẽ chửi thẳng mặt
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider root Component');
  }
  return context;
}
