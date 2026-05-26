import { create } from "zustand";
import axios from "axios";
const API_PORT = import.meta.env.VITE_API_PORT || 5000;

const API_URL = import.meta.env.MODE === "development" ? `http://localhost:${API_PORT}/api/auth` : "/api/auth";

axios.defaults.withCredentials = true;

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
	failedQueue = [];
};

// Axios interceptor for automatic token refresh
axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// If the error is 401 and message indicates expired token, try to refresh
		if (
			error.response?.status === 401 &&
			error.response?.data?.message?.includes("expired") &&
			!originalRequest._retry
		) {
			if (isRefreshing) {
				// Queue the request while refresh is in progress
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then(() => axios(originalRequest))
					.catch((err) => Promise.reject(err));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				await axios.post(`${API_URL}/refresh-token`);
				processQueue(null);
				return axios(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError, null);
				// Refresh failed — clear auth state
				useAuthStore.getState().clearAuth();
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	}
);

export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,

	setUser: (user) => set({ user }),

	clearAuth: () => set({ user: null, isAuthenticated: false, isCheckingAuth: false }),

	signup: async (email, password, name) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/signup`, { email, password, name });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
		} catch (error) {
			set({ error: error.response?.data?.message || "Error signing up", isLoading: false });
			throw error;
		}
	},

	login: async (email, password, totpCode = null) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/login`, { email, password, totpCode });

			// Check if 2FA is required
			if (response.data.requires2FA) {
				set({ isLoading: false });
				return { requires2FA: true };
			}

			set({
				isAuthenticated: true,
				user: response.data.user,
				error: null,
				isLoading: false,
			});
			return { success: true };
		} catch (error) {
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},

	logoutAll: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout-all`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out from all devices", isLoading: false });
			throw error;
		}
	},

	verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/verify-email`, { code });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error verifying email", isLoading: false });
			throw error;
		}
	},
	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/check-auth`);
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false });
		}
	},
	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response?.data?.message || "Error sending reset password email",
			});
			throw error;
		}
	},
	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response?.data?.message || "Error resetting password",
			});
			throw error;
		}
	},

	// Two-Factor Authentication
	setup2FA: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL.replace("/auth", "/user")}/2fa/setup`);
			set({ isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error setting up 2FA", isLoading: false });
			throw error;
		}
	},

	verify2FASetup: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL.replace("/auth", "/user")}/2fa/verify`, { code });
			set({ user: response.data.user, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error verifying 2FA", isLoading: false });
			throw error;
		}
	},

	disable2FA: async (password, code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL.replace("/auth", "/user")}/2fa/disable`, { password, code });
			set({ user: response.data.user, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error disabling 2FA", isLoading: false });
			throw error;
		}
	},
}));
