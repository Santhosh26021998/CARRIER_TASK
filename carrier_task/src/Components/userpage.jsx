
import { Button, Container, createTheme,Grid, Typography } from "@mui/material";
import { Link, useNavigate} from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import welcome from "../Components/welcome1.jpg";

const theme = createTheme({
  palette: {
    primary: {
      main: '#00266d',
    },
  },
});


const User = () => {
    const navigate = useNavigate()
    const storedUsername = sessionStorage.getItem("username");
    console.log("storedUsername : ", storedUsername)
    const handleLogout = () => {
        sessionStorage.removeItem("username")
    }

  return (
    <>
    <div  className="row" style={{backgroundColor:'#a8c0ff'}}>
      {storedUsername && storedUsername!== "" ? <Container sx={{ marginTop: "1%" }}>
        <Grid container spacing={2}>
          <Grid item xs={10} sm={10}>
            <Typography variant="h3" color="primary" sx={{ textAlign: "center" }}>
              Welcome, <span style={{ color: "red" }}>{storedUsername}</span>!
            </Typography>
          </Grid>
          <Grid item xs={2} sm={2}>
            <Link to="/">
              <Button type="button" variant="contained" color="primary" onClick={handleLogout} >
                Log out
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Container> : navigate('/')}
      </div>
      <div style={{textAlign:'center'}}>
        <img src={welcome} style={{height:"80vh",marginLeft:'2%'}}></img>
      </div>
    </>
  );
};
const All = () => {
  return (
    <ThemeProvider theme={theme}>
      <User />
    </ThemeProvider>
  );
};

export default All;

