import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './login';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Login', () => {
  it('renders login form', () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    // Check if the login form is rendered
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const loginButton = screen.getByRole('button', { name: /log in/i });

    expect(usernameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  it('should display error messages for empty username and email fields', () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    expect(screen.getByText(/enter username/i)).toBeInTheDocument();
    expect(screen.getByText(/enter email/i)).toBeInTheDocument();
  });

//   it('displays error message for invalid username and email', () => {
//     render(
//       <Router>
//         <Login />
//       </Router>
//     );

//     const usernameInput = screen.queryAllByText(/username/i);
//     const emailInput = screen.getByLabelText(/email address/i);
//     const loginButton = screen.getByRole('button', { name: /log in/i });

//     fireEvent.change(usernameInput, { target: { value: 'invaliduser' } });
//     fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } });
//     fireEvent.click(loginButton);

//     // Check if error message is displayed for invalid username and email
//     expect(screen.getByText(/invalid username or email/i)).toBeInTheDocument();
//   });
});
