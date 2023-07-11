import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Index from './index';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Link: ({ children }) => children, // Mock Link component
  }));

describe('Index component', () => {
    beforeEach(() => {
        // Mock the IndexedDB APIs used in the component
        window.indexedDB = {
            open: jest.fn(),
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('renders without errors', () => {
        render(<Index />);
      });

      
    it('renders add user button', () => {
        const { getAllByText } = render(<Index />);
        const addButtons = getAllByText(/Add User/i);
        expect(addButtons.length).toBeGreaterThan(0);
      });
      

      it('initializes input fields with empty values', () => {
        render(<Index />);
        const userNameInput = screen.getByLabelText('User Name');
        const firstNameInput = screen.getByLabelText('First Name');
        const lastNameInput = screen.getByLabelText('Last Name');
        const phoneNumberInput = screen.getByLabelText('Phone Number');
        const emailInput = screen.getByLabelText('Email');
      
        expect(userNameInput.value).toBe('');
        expect(firstNameInput.value).toBe('');
        expect(lastNameInput.value).toBe('');
        expect(phoneNumberInput.value).toBe('');
        expect(emailInput.value).toBe('');
      });
      
it('updates form values on input change', () => {
  render(<Index />);
  const userNameInput = screen.getByLabelText('User Name');
  const firstNameInput = screen.getByLabelText('First Name');
  const lastNameInput = screen.getByLabelText('Last Name');
  const phoneNumberInput = screen.getByLabelText('Phone Number');
  const emailInput = screen.getByLabelText('Email');

  fireEvent.change(userNameInput, { target: { value: 'john_doe' } });
  fireEvent.change(firstNameInput, { target: { value: 'John' } });
  fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
  fireEvent.change(phoneNumberInput, { target: { value: '1234567890' } });
  fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });

  expect(userNameInput.value).toBe('john_doe');
  expect(firstNameInput.value).toBe('John');
  expect(lastNameInput.value).toBe('Doe');
  expect(phoneNumberInput.value).toBe('1234567890');
  expect(emailInput.value).toBe('john.doe@example.com');
});


// test('calls handleAddUser on button click', () => {
//     const handleAddUser = jest.fn();
//     render(<Index handleAddUser={handleAddUser} />);
  
//     const addUserButton = screen.getAllByText('Add User');
  
//     fireEvent.click(addUserButton);
  
//     expect(handleAddUser).toHaveBeenCalled();
//   });
  
// test('displays error message for empty required fields', () => {
//     render(<Index />);
//     const addUserButton = screen.getAllByText('Add User');
  
//     fireEvent.click(addUserButton);
  
//     expect(screen.getByText('Enter a username.')).toBeInTheDocument();
//     expect(screen.getByText('Enter a first name.')).toBeInTheDocument();
//     expect(screen.getByText('Enter a last name.')).toBeInTheDocument();
//     expect(screen.getByText('Enter a phone number.')).toBeInTheDocument();
//     expect(screen.getByText('Enter an email address.')).toBeInTheDocument();
//   });

// test('displays error message for invalid phone number', () => {
//     render(<Index />);
//     const addUserButton = screen.getByText('Add User');
//     const phoneNumberInput = screen.getByLabelText('Phone Number');
  
//     fireEvent.change(phoneNumberInput, { target: { value: '123' } });
//     fireEvent.click(addUserButton);
  
//     expect(screen.getByText('Invalid mobile number.')).toBeInTheDocument();
//   });
  
  
    it('Add user with valid details', () => {
      render(<Index />);
    
      // Fill in the form with valid details
      fireEvent.change(screen.getByLabelText('User Name'), { target: { value: 'john.doe' } });
      fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '1234567890' } });
      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john.doe@example.com' } });
    
      // Mock the alert function
      const originalAlert = window.alert;
      window.alert = jest.fn();
    
      fireEvent.click(screen.getByRole('button', { name: 'Add User' }));
    
      // Assert that the alert function was called with the success message
      expect(window.alert).toHaveBeenCalledWith('User added successfully!');
    
      // Restore the original alert function
      window.alert = originalAlert;
    });
    
      

});