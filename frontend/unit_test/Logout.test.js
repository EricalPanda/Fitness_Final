import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../src/components/user-components/Navbar'; 
import { fetchUserProfile } from '../src/services/userService';

jest.mock('../src/services/userService', () => ({
    fetchUserProfile: jest.fn(),
}));

describe('Navbar Logout', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('handles logout correctly', async () => {
        localStorage.setItem('token', 'dummy_token');
        fetchUserProfile.mockResolvedValue({ name: 'Test User' });

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        await screen.findByText(/test user/i);
        
        fireEvent.click(screen.getByText(/logout/i));

        expect(screen.getByText(/login/i)).toBeInTheDocument();
        expect(screen.queryByText(/test user/i)).not.toBeInTheDocument();
    });
});
