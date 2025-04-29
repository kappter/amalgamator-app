import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Login from '../src/pages/Login';
import Register from '../src/pages/Register';
import Home from '../src/pages/Home';
import AmalgamationExplorer from '../src/pages/AmalgamationExplorer';

const mockStore = configureStore([]);

describe('Home Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        isAuthenticated: false,
        loading: false
      }
    });
  });

  test('renders home page with three mode cards', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Amalgamator')).toBeInTheDocument();
    expect(screen.getByText('Focus Mode')).toBeInTheDocument();
    expect(screen.getByText('Innovator Mode')).toBeInTheDocument();
    expect(screen.getByText('Play Mode')).toBeInTheDocument();
  });

  test('has working navigation buttons', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });
});

describe('Login Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        isAuthenticated: false,
        loading: false,
        error: {}
      }
    });
  });

  test('renders login form', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Login to Amalgamator')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('allows input in form fields', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });
});

describe('Register Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        isAuthenticated: false,
        loading: false,
        error: {}
      }
    });
  });

  test('renders registration form', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Join Amalgamator')).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Social Media Link/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });

  test('validates password match', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/^Password/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
    const socialMediaInput = screen.getByLabelText(/Social Media Link/i);
    const registerButton = screen.getByRole('button', { name: /Register/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
    fireEvent.change(socialMediaInput, { target: { value: 'https://twitter.com/testuser' } });

    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });
});

describe('AmalgamationExplorer Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        isAuthenticated: true,
        loading: false,
        user: { id: '123', username: 'testuser' }
      },
      amalgamation: {
        amalgamations: [],
        loading: false
      }
    });
  });

  test('renders mode selection', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AmalgamationExplorer />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Choose Your Mode')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Focus/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Innovator/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Play/i })).toBeInTheDocument();
  });

  test('allows mode selection', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AmalgamationExplorer />
        </BrowserRouter>
      </Provider>
    );

    const focusTab = screen.getByRole('tab', { name: /Focus/i });
    fireEvent.click(focusTab);

    expect(screen.getByText('Focus Mode')).toBeInTheDocument();
    expect(screen.getByText(/Choose one mastery concept/i)).toBeInTheDocument();
  });
});
