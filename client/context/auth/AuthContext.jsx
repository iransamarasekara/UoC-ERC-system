import { createContext, useContext, useEffect, useState } from "react";
import {
  userLogin,
  validateUser,
  userRegister,
} from "../../services/auth-services.js";

const AuthContext = createContext({});

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const validToken = await validateUser(token);
        if (validToken.success) {
          console.log("validate token user data: ", validToken.user);
          setUser(validToken.user);
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } catch (error) {
        console.error("Token validation error:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  const login = async (username, password) => {
    const isValid = await userLogin(username, password);
    if (isValid.success) {
      setIsAuthenticated(true);

      // Store all relevant data returned from the backend
      const user = {
        user_id: isValid.user_id,
        role: isValid.role,
        email: isValid.email,
        // Store role-specific IDs based on user type
        ...(isValid.applicant_id && {
          applicant_id: isValid.applicant_id,
          applicant_category: isValid.applicant_category,
        }),
        ...(isValid.member_id && {
          member_id: isValid.member_id,
          committee_id: isValid.committee_id,
          is_active: isValid.is_active,
        }),
      };

      setUser(user);

      // Also store the auth token if you're handling it separately
      // if (isValid.user.auth) {
      //   localStorage.setItem('token', isValid.user.auth);
      // }

      return isValid.user;
    }

    return null;
  };

  const register = async (userData) => {
    const isValid = await userRegister(userData);
    if (isValid.success) {
      setIsAuthenticated(true);
      setUser(isValid.user);
      return isValid.user;
    }

    return null;
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
