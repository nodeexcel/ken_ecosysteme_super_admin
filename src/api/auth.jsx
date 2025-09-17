import axiosInstance from "./axiosInstance";

export const login = async (payload) => {
    try {
        const response = await axiosInstance.post("/login", payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};
