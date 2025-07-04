import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const userLogin = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    if (response.status === 200) {
      localStorage.setItem("authToken", response.data.auth);
      localStorage.setItem("applicantId", response.data.data.applicant_id);
      return {
        success: true,
        user: response.data,
      };
    } else {
      return { success: false, error: response.statusText };
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Login failed",
    };
  }
};

export const validateUser = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/auth/validate`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      return { success: true, user: response.data.user };
    } else {
      return { success: false, error: response.statusText };
    }
  } catch (error) {
    console.log("Token validation error: ", error);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Token validation failed",
    };
  }
};

export const userRegister = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    if (response.status === 200 || response.status === 201) {
      return { success: true, user: response.data };
    } else {
      return { success: false, error: response.statusText };
    }
  } catch (error) {
    console.log("Register user error: ", error);

    // Return an error response instead of undefined
    return {
      success: false,
      error:
        error.response?.data?.message || error.message || "Registration failed",
    };
  }
};
