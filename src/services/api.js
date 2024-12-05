const API_URL =
    process.env.NODE_ENV === "production"
        ? "https://todolistbackend.vercel.app/api"
        : "http://localhost:3001/api";

const fetchConfig = {
    headers: {
        "Content-Type": "application/json",
    },
    credentials: "include",
};

export const loginUser = async (credentials) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            ...fetchConfig,
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        return response.json();
    } catch (error) {
        throw new Error(error.message || '登入失敗');
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            ...fetchConfig,
            method: 'POST',
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        return response.json();
    } catch (error) {
        throw new Error(error.message || '註冊失敗');
    }
};