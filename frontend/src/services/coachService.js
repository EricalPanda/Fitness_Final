// userService.js

import axios from 'axios';

// Base API
const API_URL = 'http://localhost:5000/api/coaches';

// Get user profile
export const fetchCoachProfile = async () => {
    try {
        const response = await axios.get(`${API_URL}/getCoachProfile`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw new Error('Failed to fetch profile');
    }
};
