import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://eduprobackend-eljtgmiw8-murtaza-mahmoods-projects.vercel.app/api',
});

api.interceptors.request.use(async (config) => {
  let token = null;

  // 1. Try Admin JWT from localStorage first (takes precedence for administrative actions)
  if (typeof window !== "undefined") {
    const adminUser = localStorage.getItem("adminUser");
    if (adminUser) {
        try {
            const parsed = JSON.parse(adminUser);
            token = parsed.token;
        } catch (e) {
            console.error("❌ API: Admin session corrupted");
        }
    }
  }

  // 2. If no admin token, fall back to Firebase token (for student/teacher sessions)
  if (!token && auth.currentUser) {
    try {
      token = await auth.currentUser.getIdToken();
    } catch (e) {
      console.error("❌ API: Failed to get Firebase token");
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
