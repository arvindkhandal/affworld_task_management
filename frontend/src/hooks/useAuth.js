import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [user, setUser] = useState({});

  const getCookie = (key) => {
    const keyValue = document.cookie.match(`(^|;) ?${key}=([^;]*)(;|$)`);
    return keyValue ? keyValue[2] : null;
  };

  useEffect(() => {
    const encodedString = getCookie('user');
    if (encodedString) {
      try {
        const decodedString = decodeURIComponent(encodedString);
        const parsedObject = JSON.parse(decodedString);
        
        setAccessToken(parsedObject?.accessToken || '');
        setUser(parsedObject?.user || {});
      } catch (error) {
        console.error('Error parsing user cookie:', error);
      }
    }
  }, []);

  useEffect(() => {
    setIsAuthenticated(!!accessToken);
  }, [accessToken]);

  const updateAuth = (users) => {
    const { accessToken: token, user: userData } = users;
    
    setAccessToken(token || '');
    setUser(userData || {});

    if (token && userData) {
      const encodedUserData = encodeURIComponent(
        JSON.stringify({ accessToken: token, user: userData })
      );
      document.cookie = `user=${encodedUserData}; path=/;`;
    }
  };

  const logout = () => {
    setAccessToken('');
    setUser({});
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = "/signin"
    
  };

  return {
    isAuthenticated,
    accessToken,
    user,
    updateAuth,
    logout
  };
};