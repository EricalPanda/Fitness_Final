import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ForgotPassword from '../src/pages/authenticate/ForgotPassword';

jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: jest.fn(() => null),
}));

describe('ForgotPassword Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders forgot password form', () => {
    render(
      <Router>
        <ForgotPassword />
      </Router>
    );
    expect(screen.getByText('Forgot Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });

  test('handles valid email submission', async () => {
    axios.post.mockResolvedValueOnce({ data: { Status: 'Success' } });

    render(
      <Router>
        <ForgotPassword />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/authenticate/forgotpassword',
        { email: 'test@example.com' }
      );
      expect(toast.success).toHaveBeenCalledWith('Email sent successfully!');
      expect(screen.getByText('Check your email for further instructions.')).toBeInTheDocument();
    });
  });

  test('handles invalid email format', async () => {
    render(
      <Router>
        <ForgotPassword />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'invalid-email' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
  });

  test('handles server error', async () => {
    axios.post.mockRejectedValueOnce(new Error('Server error'));

    render(
      <Router>
        <ForgotPassword />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('An error occurred. Please try again.');
      expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument();
    });
  });
});