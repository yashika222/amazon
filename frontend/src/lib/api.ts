import axios from "axios";

const API = axios.create({
  baseURL: "https://amazon-backend-zdki.onrender.com"
});

export default API;