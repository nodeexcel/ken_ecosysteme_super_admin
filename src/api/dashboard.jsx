import axiosInstance from "./axiosInstance";

export const getDashboardDetails = async () => {
    try {
        const response = await axiosInstance.get("/admin/dashboard");
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};
