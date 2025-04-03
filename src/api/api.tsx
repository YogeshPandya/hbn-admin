import axios from "axios";

// Replace this with your actual base URL
const BASE_URL = "http://15.206.75.239:3000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // Add any other default headers you might need, like Authorization
  },
});

// Add request interceptor for authentication if needed
api.interceptors.request.use(
  (config: any) => {
    // Add token if you have authentication
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors globally (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message || "";

      // ✅ Only clear token if the response explicitly mentions an invalid token
      if (
        errorMessage.toLowerCase().includes("invalid token") ||
        errorMessage.toLowerCase().includes("token expired") ||
        errorMessage.toLowerCase().includes("unauthorized")
      ) {
        console.log(
          "401 Unauthorized detected due to an invalid token, clearing token..."
        );
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  try {
    const response: any = await api.post("api/admin/login", {
      email,
      password,
    });
    localStorage.setItem("token", response.data.data.access_token);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Dashboard metrics API call
export const dashboard = async () => {
  try {
    const response = await api.get("/api/admin/dashboard/metrics");
    return response.data; // This returns the full response with `data` nested
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    throw error;
  }
};

export const frequencyData = async (params = { month: "current_month" }) => {
  try {
    const response = await api.get("/api/admin/dashboard/frequencydata", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching frequency data:", error);
    throw error;
  }
};

// Insights API call
export const insights = async (params = { month: "current_month" }) => {
  try {
    const response = await api.get("/api/admin/dashboard/insight", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching insights:", error);
    throw error;
  }
};

export const customers = async (page: number) => {
  const token = localStorage.getItem("token");
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await api.get(
      `api/customers?page=${page}&limit=10`,
      headers
    ); // Adjust the query parameters
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

export const vendors = async (page: number) => {
  const token = localStorage.getItem("token");
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await api.get(`api/vendors?page=${page}`, headers);
    return response.data;
  } catch (error) {
    console.error("Error fetching vendors:", error);
    throw error;
  }
};
export const updateVendorApproval = async (
  vendorId: string,
  isApproved: boolean
) => {
  const token = localStorage.getItem("token");
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await api.put(
      `/api/vendors/${vendorId}`,
      { is_approved: isApproved, status: isApproved ? "approved" : "declined" },
      headers
    );
    return response.data;
  } catch (error) {
    console.error("Error updating vendor approval:", error);
    throw error;
  }
};

export const getVendorById = async (vendorId: string) => {
  const token = localStorage.getItem("token");
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await api.get(`/api/vendors/${vendorId}`, headers);
    return response.data;
  } catch (error) {
    console.error("Error fetching vendor details:", error);
    throw error;
  }
};

export default api;
