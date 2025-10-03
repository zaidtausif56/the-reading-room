import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000/api"; // Use 127.0.0.1 to avoid IPv6 resolution issues

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post("/auth/signup", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
};

// Book APIs
export const bookAPI = {
  getAll: (page = 1, limit = 5, search = "", genre = "", sortBy = "") =>
    api.get("/books", { params: { page, limit, search, genre, sortBy } }),
  getById: (id: string) => api.get(`/books/${id}`),
  create: (data: {
    title: string;
    author: string;
    description: string;
    genre: string;
    year: number;
  }) => api.post("/books", data),
  update: (id: string, data: any) => api.put(`/books/${id}`, data),
  delete: (id: string) => api.delete(`/books/${id}`),
};

// Review APIs
export const reviewAPI = {
  getByBook: (bookId: string) => api.get(`/reviews/book/${bookId}`),
  create: (data: { bookId: string; rating: number; reviewText: string }) =>
    api.post("/reviews", data),
  update: (id: string, data: { rating: number; reviewText: string }) =>
    api.put(`/reviews/${id}`, data),
  delete: (id: string) => api.delete(`/reviews/${id}`),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get("/user/profile"),
  getBooks: () => api.get("/user/books"),
  getReviews: () => api.get("/user/reviews"),
};

export default api;
