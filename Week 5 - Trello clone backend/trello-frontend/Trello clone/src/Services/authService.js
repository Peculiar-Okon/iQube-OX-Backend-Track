import api from "./api";

export const registerUser = (payload) => api.post("/auth/register", payload);

export const loginUser = (payload) => api.post("/auth/login", payload);

export const verifyEmail = ({ email, otp }) =>
  api.post("/auth/verify-otp", { email, otp });

export const resendVerification = (email) =>
  api.post("/auth/resend-otp", { email });

export const forgotPassword = (payload) =>
  api.post("/auth/forgot-password", payload);

export const verifyResetOTP = (payload) =>
  api.post("/auth/verify-reset-otp", payload);

export const resetPassword = (payload) =>
  api.post("/auth/reset-password", payload);
