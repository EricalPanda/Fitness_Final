import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CoachDetails from '../src/components/user-components/CoachesDetail';
import axios from 'axios';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom';
jest.mock('../src/assets/avatar/url1.jpg', () => 'mocked-image-url');

jest.mock('axios');

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

const mockCoachData = {
    _id: '1',
    accountId: {
        name: 'Tim',
        avatar: 'mocked-image-url',
        gender: true,
        dob: '2024-01-01',
        address: 'Da Nang',
    },
    introduce: 'Test introduce',
    experience: [{ time: '2024', workplace: 'Gym A' }],
};

describe('Test Coach Details Component', () => {
    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockCoachData });
    });

    it('renders coach details', async () => {
        render(
            <MemoryRouter initialEntries={['/coach/1']}>
                <Routes>
                    <Route path="/coach/:id" element={<CoachDetails />} />
                </Routes>
            </MemoryRouter>
        );

        // Ensure loading state is shown initially
        expect(screen.getByText(/loading coach details/i)).toBeInTheDocument();

        // Wait for the coach details to be displayed
        await waitFor(() => {
            expect(screen.getByText("Tim's Profile")).toBeInTheDocument();
            expect(screen.getByText('Name:')).toBeInTheDocument();
            expect(screen.getByText('Tim')).toBeInTheDocument();
            expect(screen.getByText('Gender:')).toBeInTheDocument();
            expect(screen.getByText('Male')).toBeInTheDocument();
            expect(screen.getByText('Date of Birth:')).toBeInTheDocument();
            expect(screen.getByText('1/1/2024')).toBeInTheDocument();
            expect(screen.getByText('Address:')).toBeInTheDocument();
            expect(screen.getByText('Da Nang')).toBeInTheDocument();
            expect(screen.getByText(/Test introduce/i)).toBeInTheDocument();
            expect(screen.getByText('Experience')).toBeInTheDocument();
            expect(screen.getByText('2024 - Gym A')).toBeInTheDocument();
        });
    });

    it('handles errors from the API', async () => {
        axios.get.mockRejectedValueOnce(new Error('Network Error'));

        render(
            <MemoryRouter initialEntries={['/coach/1']}>
                <Routes>
                    <Route path="/coach/:id" element={<CoachDetails />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/error/i)).toBeInTheDocument();
        });
    });

    it('navigates back to the coach list when back button is clicked', async () => {
        const mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);
        render(
            <MemoryRouter initialEntries={['/coach/1']}>
                <Routes>
                    <Route path="/coach/:id" element={<CoachDetails />} />
                    <Route path="/" element={<div>Coaches List</div>} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Tim's Profile")).toBeInTheDocument();
        });

        const backButton = screen.getByText(/back/i);
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith('/coach-details');
    });
});