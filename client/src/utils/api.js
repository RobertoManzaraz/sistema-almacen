const API_BASE = "/api";

export const api = {
    async get(url) {
        const res = await fetch(`${API_BASE}${url}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    async post(url, data) {
        const res = await fetch(`${API_BASE}${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    async put(url, data) {
        const res = await fetch(`${API_BASE}${url}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    async delete(url) {
        const res = await fetch(`${API_BASE}${url}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    }
};
