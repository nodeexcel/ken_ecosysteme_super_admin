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

export const createUserManagement = async (payload) => {
    try {
        const response = await axiosInstance.post("/admin/add-user",payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getUserManagement = async () => {
    try {
        const response = await axiosInstance.get("/admin/user-management");
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const deleteUserManagement = async (id) => {
    try {
        const response = await axiosInstance.delete(`/admin/delete-user/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getUsersKnowledge = async () => {
    try {
        const response = await axiosInstance.get(`/admin/get-users-knowledges`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getUsersKnowledgeById = async (id) => {
    try {
        const response = await axiosInstance.get(`/admin/get-users-knowledges/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const deleteUserKnowledgeBase = async (id) => {
    try {
        const response = await axiosInstance.delete(`/admin/delete-user-knowledge_base/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const deleteKnowledgeBase = async (id) => {
    try {
        const response = await axiosInstance.delete(`/admin/delete-knowledge_base/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const updateSubscription = async (id,payload) => {
    try {
        const response = await axiosInstance.put(`/admin/users/subscription/${id}`,payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const getUsersById = async (id) => {
    try {
        const response = await axiosInstance.get(`/admin/users/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const addCredits = async (id,payload) => {
    try {
        const response = await axiosInstance.post(`/admin/users/add-credits/${id}`,payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};
