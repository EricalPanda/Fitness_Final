// SignUp.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import SignUp from '../src/pages/authenticate/SignUp';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Create a mock for axios
const mock = new MockAdapter(axios);

describe('SignUp Component', () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <SignUp />
            </MemoryRouter>
        );
    });

    it('renders Sign Up form correctly', () => {
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    it('shows an error message for invalid email', () => {
        const emailInput = screen.getByPlaceholderText('Email');
        fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });

    it('shows an error message for invalid password', () => {
        const passwordInput = screen.getByPlaceholderText('Password');
        fireEvent.change(passwordInput, { target: { value: 'short' } });
        expect(screen.getByText('Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, and 1 special character.')).toBeInTheDocument();
    });

    it('submits the form and shows success toast on valid submission', async () => {
        const emailInput = screen.getByPlaceholderText('Email');
        const nameInput = screen.getByPlaceholderText('Name');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByRole('button', { name: /Sign Up/i });

        // Set up mock response for successful registration
        mock.onPost('http://localhost:5000/api/authenticate/register').reply(200, {
            msg: 'Registration successful!'
        });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(nameInput, { target: { value: 'Test User' } });
        fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(screen.getByText('Registration successful!')).toBeInTheDocument());
    });

    it('shows error toast on failed submission', async () => {
        const emailInput = screen.getByPlaceholderText('Email');
        const nameInput = screen.getByPlaceholderText('Name');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByRole('button', { name: /Sign Up/i });

        // Set up mock response for failed registration
        mock.onPost('http://localhost:5000/api/authenticate/register').reply(400, {
            msg: 'Registration failed!'
        });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(nameInput, { target: { value: 'Test User' } });
        fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(screen.getByText('Registration failed!')).toBeInTheDocument());
    });
});