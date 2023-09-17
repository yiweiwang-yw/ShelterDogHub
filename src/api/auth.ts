import api from "./index";

export const login = async (name: string, email: string) => {
    try {
        const response = await api.post("/auth/login", { name, email });

        // Store user data in sessionStorage
        sessionStorage.setItem("user", JSON.stringify({ name, email }));

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = async () => {
    try {
        const response = await api.post("/auth/logout");

        const userData = sessionStorage.getItem("user");
        if (userData) {
            const { name, email } = JSON.parse(userData);
            const key = `matchedDog-${name}-${email}`;
            sessionStorage.removeItem(key);
        }else{
            return;
        }

        sessionStorage.removeItem("user");

        return response.data;
    } catch (error) {
        throw error;
    }
};
