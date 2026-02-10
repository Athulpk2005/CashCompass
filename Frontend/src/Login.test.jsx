import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Login from './Login';

// Mock the API URL
vi.mock('./config/api', () => ({
  API_URL: 'http://localhost:5000/api'
}));

const renderLogin = () => {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </HelmetProvider>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form with title and subtitle', () => {
    renderLogin();
    
    expect(screen.getByText('CashCompass')).toBeInTheDocument();
    expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders email and password input fields', () => {
    renderLogin();
    
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  it('shows email validation error for invalid email', async () => {
    renderLogin();
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    const form = submitButton.closest('form');

    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.submit(form);

    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  it('shows password validation error for short password', async () => {
    renderLogin();
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    const form = submitButton.closest('form');

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, '12345');
    fireEvent.submit(form);

    expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument();
  });

  it('clears validation error when user starts typing', async () => {
    renderLogin();
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    const form = submitButton.closest('form');

    // Trigger validation error
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.type(passwordInput, '123');
    fireEvent.submit(form);

    // Wait for error to appear
    await screen.findByText(/please enter a valid email address/i);

    // Start typing valid email
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'valid@example.com');

    // Error should be cleared
    expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    renderLogin();
    
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const toggleButton = screen.getByRole('button', { name: /show password/i });

    expect(passwordInput.type).toBe('password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    expect(toggleButton).toHaveAttribute('aria-label', 'Hide password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
    expect(toggleButton).toHaveAttribute('aria-label', 'Show password');
  });

  it('has link to register page', () => {
    renderLogin();
    
    const registerLink = screen.getByRole('link', { name: /sign up/i });
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  it('has forgot password link', () => {
    renderLogin();
    
    expect(screen.getByRole('link', { name: /forgot password/i })).toHaveAttribute('href', '/forgot-password');
  });
});
