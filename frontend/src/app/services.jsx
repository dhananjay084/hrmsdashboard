const API_URL = 'https://hrmsnode.onrender.com/api/targets';

// Get targets with optional filters (userId, month, year)
export const getTargets = async (filters) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}?${queryParams}`);
    if (!response.ok) {
        throw new Error('Failed to fetch targets');
    }
    return await response.json();
};

// Create a new target
export const createTarget = async (targetData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(targetData),
    });
    if (!response.ok) {
        throw new Error('Failed to create target');
    }
    return await response.json();
};
export const updateTarget = async (id, body) => {
    const response = await fetch(`https://hrmsnode.onrender.com/api/targets/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error('Failed to update target');
    }

    return response.json();
};
