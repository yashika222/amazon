import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  timeout: 20000, // 20 seconds instead of 5 seconds
});

export default API;