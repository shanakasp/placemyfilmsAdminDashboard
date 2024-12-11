import axios from "axios";

const API_BASE_URL = "https://backend.placemyfilms.com";

export const loginApi = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/login`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.data.result);
    const { AdminId, token } = response.data.result;

    // Save AdminId and token to localStorage
    localStorage.setItem("AdminId", AdminId);
    localStorage.setItem("token", token);

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Login failed");
    } else {
      throw new Error("An error occurred during the request");
    }
  }
};
