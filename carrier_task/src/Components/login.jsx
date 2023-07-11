import { Avatar, Box, Button, Container, createTheme, Grid, TextField, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import LockOpen from '@mui/icons-material/LockOpen';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import image from "../Components/pexels-andrew-neel-8960464.jpg"

const theme = createTheme({
  palette: {
    primary: {
      main: '#00266d',
    },
  },
});

const Login = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent form submission and page refresh

    // Reset previous error state
    setUsernameError("");
    setEmailError("");
    setErrorMessage("");

    if (username === "" && email === "") {
      setUsernameError("Enter username");
      setEmailError("Enter email");
    } else if (username === "") {
      setUsernameError("Enter username");
    } else if (email === "") {
      setEmailError("Enter email");
    } else {
      // Retrieve user details from IndexedDB
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
          const request = objectStore.get(username);

          request.onerror = (event) => {
            console.error('Error retrieving user details:', event.target.error);
          };

          request.onsuccess = (event) => {
            const userDetails = event.target.result;
            if (userDetails && userDetails.Email === email) {
              console.log("Login successful");
              sessionStorage.setItem("username", username);
              localStorage.setItem("email", email);
              navigate('/userpage');
            } else {
              setErrorMessage("Invalid username or email");
            }
          };
        } catch (error) {
          console.error('Error retrieving user details:', error);
        }
      };

      retrieveUserDetails();
    }
  };

  return (
    <div container className='back' style={{backgroundImage: `url('${image}')`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',}}>
      <Container component="main" maxWidth="xs" >
        <Box sx={{
         display: 'flex',
         flexDirection: 'column',
         alignItems: 'center',
         minHeight: '100vh',
        }}>
          <Avatar sx={{  bgcolor: 'primary.main' }}>
            <LockOpen />
          </Avatar>
          <Typography component="h1" variant="h5" color='primary'>
            Log in
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1}}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                   sx={{

                     '& .MuiInputLabel-root': {
                       color: '#00266d', 
                     }
                    }}
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  color="primary"
                  value={username}
                  data-testid="Username"
                  onChange={(e) => setUsername(e.target.value)}
                  error={!!usernameError}
                  helperText={usernameError}
                  variant="filled"
                  
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                   sx={{
                     '& .MuiInputLabel-root': {
                       color: '#00266d', 
                       
                     }
                    }}
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  color="primary"
                  value={email}
                  data-testid="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
                  variant="filled"
                />
                {errorMessage && (
                  <Typography variant="body1" color="error">
                    {errorMessage}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              color='primary'
              onClick={handleLogin}
            >
              Log in
            </Button>
            <Grid container>
              <Grid item xs={7}>
                <Link to="/forgot">

                  <Typography variant='body2' color='primary'>
                    Forgot password?
                  </Typography>
                </Link>
              </Grid>
              <Grid item xs={5}>
                <Link to="/adduser">
                  <Typography variant="body2" color='primary' sx={{ml:1}}>
                    Don't have an account?
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Login />
    </ThemeProvider>
  );
};

export default App;
