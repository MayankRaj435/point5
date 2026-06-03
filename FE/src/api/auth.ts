import axiosInstance from "../lib/axiosInstance";

/**
 * ADMIN AUTH APIs
 */

export const signupAdmin = async (data: {
  name: string;
  email: string;
  password: string;
  registrationKey: string;
}) => {
  const response = await axiosInstance.post("/admin/signup", data);
  return response.data;
};

export const signinAdmin = async (data: {
  email: string;
  password: string;
}) => {
  const response = await axiosInstance.post("/admin/signin", data);
  return response.data;
};

export const logoutAdmin = async () => {
  const response = await axiosInstance.post("/admin/logout");
  return response.data;
};

export const getMe = async () => {
  const response = await axiosInstance.get("/admin/me");
  return response.data;
};

export const deleteAdmin = async (id: number) => {
  const response = await axiosInstance.delete(`/admin/${id}`);
  return response.data;
};

export const getAllAdmins = async () => {
  const response = await axiosInstance.get("/admin");
  return response.data;
};
