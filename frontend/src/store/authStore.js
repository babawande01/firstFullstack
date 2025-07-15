import { create } from 'zustand';
import axios from 'axios';


axios.defaults.withCredentials = true; // Enable sending cookies with requests

const API_URL = "https://firstfullstack-z9k2.onrender.com/api"; // Base URL for your API





export const useAuthStore = create((set) => ({
//initial state
    user: null,
    isLoding: false,
    error: null,
    //actions
    message: null,
    fetchingUser: true,

    //function
    signup: async (username, email, password) => {
        set ({ isLoding: true, error: null, message: null });

        try {
            const response = await axios.post(`${API_URL}/signup`, {
                username,
                email,
                password
            });

            set({ user: response.data.user, isLoding: false});
        } catch (error){
            set({
                isLoding: false,
                error: error.response.data.message || "An error occurred sigining up",
            });

            throw error;
        }
    },

    login: async (username, password) => {
        set({ isLoding: true, error: null, message: null });
        try {

            const response = await axios.post(`${API_URL}/login`, {
                username,
                password
            });

            const { user, message } = response.data;
            set({ user, isLoding: false, message });

            return {user, message};
        }catch (error) {
            set({
                isLoding: false,
                error: error.response.data.message || "An error occurred Loggin",
            });

            throw error;
        }

    },

    fetchUser: async () => {
        set({
            fetchingUser: true,
            error: null,
        });
        try {
            const response = await axios.get(`${API_URL}/fetch-user`);
            set({
                user: response.data.user,
                fetchingUser: false,
                
            });

            
        } catch (error) {
            set({
                fetchingUser: false,
                user: null,
                error: null,
            });

            throw error;
        }
    },

    logout: async () => {
        set({ isLoding: true, error: null, message: null });
        try {
            const response = await axios.post(`${API_URL}/logout`);
            const { message } = response.data;
            set({ user: null, isLoding: false, message, error: null });
            return message;

        } catch (error) {
            set({
                isLoding: false,
                error: error.response.data.message || "An error occurred loging out",
            });

            throw error;
        }
    }
}));
