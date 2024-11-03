import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ResetPassword from '../src/pages/authenticate/ResetPassword';

jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: jest.fn(() => null),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: 'testId', token: 'testToken' }),
}));

describe('ResetPassword Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders reset password form', () => {
    render(
      <Router>
        <ResetPassword />
      </Router>
    );
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter New Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument();
  });

  test('handles valid password submission', async () => {
    axios.post.mockResolvedValueOnce({ data: { Status: 'Success' } });

    render(
      <Router>
        <ResetPassword />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter New Password'), {
      target: { value: 'ValidPass1!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Update' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/users/resetpassword/testId/testToken',
        { password: 'ValidPass1!' }
      );
      expect(toast.success).toHaveBeenCalledWith('Password updated successfully. Redirecting to login...');
    });
  });

  test('handles invalid password format', async () => {
    render(
      <Router>
        <ResetPassword />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter New Password'), {
      target: { value: 'weakpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Update' }));

    expect(screen.getByText(/Password must be at least 8 characters long/)).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
  });

  test('handles server error', async () => {
    axios.post.mockRejectedValueOnce(new Error('Server error'));

    render(
      <Router>
        <ResetPassword />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter New Password'), {
      target: { value: 'ValidPass1!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Update' }));

    await waitFor(() => {
      expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument();
    });
  });
});