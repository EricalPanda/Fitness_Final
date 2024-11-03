import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CoachesList from '../src/components/user-components/CoachesList';
import axios from 'axios';
import { BrowserRouter} from 'react-router-dom';

jest.mock('axios');

jest.mock('../../assets/avatar/url1.jpg', () => 'mocked-image-url', { virtual: true });
jest.mock('../../assets/avatar/url2.jpg', () => 'mocked-image-url', { virtual: true });
jest.mock('../../assets/avatar/url3.jpg', () => 'mocked-image-url', { virtual: true });

const mockCoachesData = [
    {
        _id: '1',
        accountId: { name: 'Coach One', avatar: 'url1.jpg' },
        introduce: 'I am Coach One',
        experience: [{ time: '2020', workplace: 'Gym A' }],
    },
    {
        _id: '2',
        accountId: { name: 'Coach Two', avatar: 'url2.jpg' },
        introduce: 'I am Coach Two',
        experience: [{ time: '2021', workplace: 'Gym B' }],
    },
    {
        _id: '3',
        accountId: { name: 'Coach Three', avatar: 'url3.jpg' },
        introduce: 'I am Coach Three',
        experience: [{ time: '2022', workplace: 'Gym C' }],
    },
    {
        _id: '4',
        accountId: { name: 'Coach Three', avatar: 'url3.jpg' },
        introduce: 'I am Coach Three',
        experience: [{ time: '2022', workplace: 'Gym C' }],
    },
];

describe('Test Coaches List Component', () => {
    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockCoachesData });
    });

    it('renders coaches and displays pagination', async () => {
        render(
            <BrowserRouter>
                <CoachesList />
            </BrowserRouter>
        );

        expect(screen.getByText(/loading coaches/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Coach One')).toBeInTheDocument();
            expect(screen.getByText('Coach Two')).toBeInTheDocument();
            expect(screen.getByText('Coach Three')).toBeInTheDocument();
        });

        const nextButton = screen.getByText(/next/i);
        const prevButton = screen.getByText(/previous/i);

        expect(prevButton).toBeDisabled();
        expect(nextButton).toBeEnabled();
    });

    it('handles errors from the API', async () => {
        axios.get.mockRejectedValueOnce(new Error('Network Error'));

        render(
            <BrowserRouter>
                <CoachesList />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/error/i)).toBeInTheDocument();
        });
    });

    it('navigates to next page on clicking next button', async () => {
        render(
            <BrowserRouter>
                <CoachesList />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Coach One')).toBeInTheDocument();
        });

        const nextButton = screen.getByText(/next/i);
        fireEvent.click(nextButton);
    });
});