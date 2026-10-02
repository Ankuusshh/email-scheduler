const API_URL = "http://localhost:5000/api";

export async function login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Login failed");
    }

    return data;
}

export async function getEmails(token) {
    const response = await fetch(`${API_URL}/emails`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch emails");
    }

    return data;
}

export async function getScheduledEmails(token) {
    const response = await fetch(`${API_URL}/emails/scheduled`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch scheduled emails");
    }

    return data;
}

export async function getSentEmails(token) {
    const response = await fetch(`${API_URL}/emails/sent`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch sent emails");
    }

    return data;
}

export async function scheduleEmail(token, emailData) {
    const response = await fetch(`${API_URL}/emails`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(emailData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to schedule email");
    }

    return data;
}