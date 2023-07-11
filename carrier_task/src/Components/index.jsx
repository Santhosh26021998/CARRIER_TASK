import React, { useState, useEffect } from 'react';
import { Button, Container, createTheme,Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary: {
        main: '#00266d',
      },
    },
  });

  const Index = () =>{
    const [userdetails, setUserdetails] = useState([]);
    const [formValues, setFormValues] = useState({
        User_Name: '',
        First_Name: '',
        Last_Name: '',
        Phone_Number: '',
        Email: '',
    });
    const [errorMessages, setErrorMessages] = useState({});

    useEffect(() => {
        // Retrieve user details from IndexedDB on component mount
        retrieveUserDetails();
    });

    const openDatabase = () => {
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open('UserDetailsDB', 1);

            request.onerror = (event) => {
                console.error('Error opening database:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                const db = event.target.result;
                resolve(db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                const objectStore = db.createObjectStore('userdetails', { keyPath: 'User_Name' });
                objectStore.createIndex('User_Name', 'User_Name', { unique: true });
            };
        });
    };

    const retrieveUserDetails = async () => {
        try {
            const db = await openDatabase();
            const transaction = db.transaction('userdetails', 'readonly');
            const objectStore = transaction.objectStore('userdetails');
            const request = objectStore.getAll();

            request.onerror = (event) => {
                console.error('Error retrieving user details:', event.target.error);
            };

            request.onsuccess = (event) => {
                const userDetails = event.target.result;
                setUserdetails(userDetails);
            };
        } catch (error) {
            console.error('Error retrieving user details:', error);
        }
    };

    const addUserDetails = async (user) => {
        try {
            const db = await openDatabase();
            const transaction = db.transaction('userdetails', 'readwrite');
            const objectStore = transaction.objectStore('userdetails');
            const request = objectStore.add(user);

            request.onerror = (event) => {
                console.error('Error adding user details:', event.target.error);
            };

            request.onsuccess = () => {
                retrieveUserDetails(); // Update user details after adding
            };
        } catch (error) {
            console.error('Error adding user details:', error);
        }
    };

    const deleteUserDetails = async (userName) => {
        try {
            const db = await openDatabase();
            const transaction = db.transaction('userdetails', 'readwrite');
            const objectStore = transaction.objectStore('userdetails');
            const request = objectStore.delete(userName);

            request.onerror = (event) => {
                console.error('Error deleting user details:', event.target.error);
            };

            request.onsuccess = () => {
                retrieveUserDetails(); // Update user details after deleting
            };
        } catch (error) {
            console.error('Error deleting user details:', error);
        }
    };

    const isUniqueUserName = (userName) => {
        return !userdetails.some((user) => user.User_Name === userName);
    };

    const isValidEmail = (value) => {
        const emailpattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailpattern.test(value);
    };

    const isValidMobile = (value) => {
        const mobilepattern = /^(?!0)\d{10}$/;
        return mobilepattern.test(value);
    };

    const isValidFirstname = (value) => {
        const fname = /^[a-zA-Z]*$/;
        return fname.test(value);
    };

    const isValidLastname = (value) => {
        const lname = /^[a-zA-Z]*$/;
        return lname.test(value);
    };

    const handleInputChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };

    const handleAddUser = () => {
        // Validate form inputs
        if (
            formValues.User_Name.trim() === '' ||
            formValues.First_Name.trim() === '' ||
            formValues.Last_Name.trim() === '' ||
            formValues.Phone_Number.trim() === '' ||
            formValues.Email.trim() === ''
        ) {
            setErrorMessages({
                User_Name: formValues.User_Name.trim() === '' ? 'Enter a username.' : '',
                First_Name: formValues.First_Name.trim() === '' ? 'Enter a first name.' : '',
                Last_Name: formValues.Last_Name.trim() === '' ? 'Enter a last name.' : '',
                Phone_Number: formValues.Phone_Number.trim() === '' ? 'Enter a phone number.' : '',
                Email: formValues.Email.trim() === '' ? 'Enter an email address.' : '',
            });
            return;
        }

        if (!isValidEmail(formValues.Email)) {
            setErrorMessages((prevErrors) => ({
                ...prevErrors,
                Email: 'Invalid email address. Please enter a valid email.',
            }));
            return;
        }

        if (!isValidMobile(formValues.Phone_Number)) {
            setErrorMessages((prevErrors) => ({
                ...prevErrors,
                Phone_Number: 'Invalid mobile number.',
            }));
            return;
        }

        if (!isUniqueUserName(formValues.User_Name)) {
            setErrorMessages((prevErrors) => ({
                ...prevErrors,
                User_Name: 'Username already taken.',
            }));
            return;
        }

        if (!isValidFirstname(formValues.First_Name)) {
            setErrorMessages((prevErrors) => ({
                ...prevErrors,
                First_Name: 'First name should contain only alphabets.',
            }));
            return;
        }

        if (!isValidLastname(formValues.Last_Name)) {
            setErrorMessages((prevErrors) => ({
                ...prevErrors,
                Last_Name: 'Last name should contain only alphabets.',
            }));
            return;
        }

        const newUser = { ...formValues };

        // Add new user to the list
        addUserDetails(newUser);

        // Clear form values and error messages
        setFormValues({
            User_Name: '',
            First_Name: '',
            Last_Name: '',
            Phone_Number: '',
            Email: '',
        });
        setErrorMessages({});

        // Display alert message
        alert('User added successfully!');
    };

    const handleDeleteUser = (userName) => {
        // Remove user from the list
        const confirmed = window.confirm('Are you sure you want to delete this user?');
        if (confirmed) {
            deleteUserDetails(userName);
            alert('User deleted successfully!');
        }
    };

    return (
        <div >
        <Container maxWidth='xl' sx={{background:'linear-gradient(to right,  #a8c0ff, #3f2b96)',height:'100vh'}}>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={3}>
                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{textAlign:'center'}}>Add User</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ marginBottom: '3%' }}>
                        <TextField
                            name="User_Name"
                            label="User Name"
                            value={formValues.User_Name}
                            onChange={handleInputChange}
                            fullWidth
                            error={Boolean(errorMessages.User_Name)}
                            helperText={errorMessages.User_Name}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ marginBottom: '3%' }}>
                        <TextField
                            name="First_Name"
                            label="First Name"
                            value={formValues.First_Name}
                            onChange={handleInputChange}
                            fullWidth
                            error={Boolean(errorMessages.First_Name)}
                            helperText={errorMessages.First_Name}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ marginBottom: '3%' }}>
                        <TextField
                            name="Last_Name"
                            label="Last Name"
                            value={formValues.Last_Name}
                            onChange={handleInputChange}
                            fullWidth
                            error={Boolean(errorMessages.Last_Name)}
                            helperText={errorMessages.Last_Name}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ marginBottom: '3%' }}>
                        <TextField
                            name="Phone_Number"
                            label="Phone Number"
                            value={formValues.Phone_Number}
                            onChange={handleInputChange}
                            fullWidth
                            error={Boolean(errorMessages.Phone_Number)}
                            helperText={errorMessages.Phone_Number}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ marginBottom: '3%' }}>
                        <TextField
                            name="Email"
                            label="Email"
                            value={formValues.Email}
                            onChange={handleInputChange}
                            fullWidth
                            error={Boolean(errorMessages.Email)}
                            helperText={errorMessages.Email}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ marginBottom: '3%' }}>
                        <Button variant="contained" color="primary" data-testid="add-user-button" onClick={handleAddUser}>
                            Add User
                        </Button>
                        <Link to="/">
                            <Button variant="contained" color="primary" sx={{marginLeft:'2%'}}>
                                Login
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
                <Grid item xs={9}>
                    <Grid item xs={12}>
                        <Typography variant="h4" align="center">
                            User Details
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,}}>
                                        <TableCell align="center" style={{ border: '1px solid black' ,color:'whitesmoke'}}>User Name</TableCell>
                                        <TableCell align="center" style={{ border: '1px solid black' ,color:'whitesmoke' }}>First Name</TableCell>
                                        <TableCell align="center" style={{ border: '1px solid black' ,color:'whitesmoke' }}>Last Name</TableCell>
                                        <TableCell align="center" style={{ border: '1px solid black' ,color:'whitesmoke' }}>Phone Number</TableCell>
                                        <TableCell align="center" style={{ border: '1px solid black' ,color:'whitesmoke' }}>Email</TableCell>
                                        <TableCell align="center" style={{ border: '1px solid black' ,color:'whitesmoke' }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {userdetails.map((user, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center" style={{ border: '1px solid black',color:'whitesmoke' }}>{user.User_Name}</TableCell>
                                            <TableCell align="center" style={{ border: '1px solid black',color:'whitesmoke' }}>{user.First_Name}</TableCell>
                                            <TableCell align="center" style={{ border: '1px solid black',color:'whitesmoke' }}>{user.Last_Name}</TableCell>
                                            <TableCell align="center" style={{ border: '1px solid black',color:'whitesmoke' }}>{user.Phone_Number}</TableCell>
                                            <TableCell align="center" style={{ border: '1px solid black',color:'whitesmoke' }}>{user.Email}</TableCell>
                                            <TableCell align="center" style={{ border: '1px solid black',color:'whitesmoke' }}>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    sx={{ bgcolor: 'red', color: 'white', '&:hover': { bgcolor: 'red', }, }} 
                                                    onClick={() => handleDeleteUser(user.User_Name)}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
        </div>
    );
};
const Ap = () => {
    return (
      <ThemeProvider theme={theme}>
        <Index />
      </ThemeProvider>
    );
  };
  
  export default Ap;
