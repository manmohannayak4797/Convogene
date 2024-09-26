import React, { useState, useEffect } from "react";
import infobellImg from "../../assets/Images/infobellLogo.png";
import Button from "@mui/material/Button";
import Gooogle from "../../assets/Images/icons8-google-48.png";
import Microsoft from "../../assets/Images/icons8-teams-48.png";
import Github from "../../assets/Images/icons8-teams-48.png";
import { TextField } from "@mui/material";
import Card from "@mui/material/Card";
import styles from "./Login.module.css";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from './AuthContext';
import {
  useMsal
} from "@azure/msal-react";
import { loginRequest } from "./authConfig";
const Login = () => {
  const navigate = useNavigate();
  let [stage, setStage] = useState("username");
  const [user, setUser] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { instance } = useMsal();
  // const  [login, setLogin] = useState(false)
  const { loginUser } = useAuth();

  const handleNext = async () => {
    if (stage === 'username') {
      if (username === 'amd' || username === 'sayali') {
        setStage('password');
      } else {
        alert('Invalid username');
      }
    } else if (stage === 'password') {
      if ((username === 'amd' && password === 'amd$$1234') || 
          (username === 'sayali' && password === 'sayali123')) {
        try {
          await loginUser({ username, password });
          navigate('/home');
        } catch (error) {
          alert('Login failed: ' + error.message);
        }
      } else {
        alert('Invalid Password');
      }
    }
  };

  const loginMicrosoft = () => {
    instance
      .loginPopup({ ...loginRequest, prompt: 'create' })
      .then((response) => {
        console.log("Login Success:", response);
        localStorage.setItem('user', JSON.stringify(response.account));
  
        return instance.acquireTokenSilent({
          ...loginRequest,
          account: response.account
        });
      })
      .then((tokenResponse) => {
        localStorage.setItem('accessToken', tokenResponse.accessToken);
        console.log("Token acquired:", tokenResponse.accessToken);
  
        // Set user in your app's state
        setUser(JSON.parse(localStorage.getItem('user')));
  
        // Navigate to home page
        navigate("/Home");
      })
      .catch((error) => {
        console.error("Login Error:", error);
      });
  };
  

  const loginGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          // setProfile(null);
          // setProfile(res.data);
          // await loginUser(res.data.given_name )          
          // localStorage.setItem("userInfo", res.data)
          console.log("check google", res.data)
          navigate("/home");
        })
        .catch((err) => console.log(err));
    }
  });

///////////
const [token, setToken] = useState(null);

const handleGithubLogin = () => {
  const clientId = "Ov23livuAdqT3VIf5Mp0"; // Replace with your GitHub Client ID
  window.location.assign(
    `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user`
  );
};

useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  if (token) {
    
    setToken(token);
    // Perform actions with the token, like fetching user data
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////

  const rootStyle = {
    width: "45%",
    fontSize: "0.875rem",
    color: "#616161",
  };
  const dividerStyle = {
    marginTop: "8px",
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "white",
        padding: 10,
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          height: "10%",
          width: "100%",
        }}
      >
        <img alt="" src={infobellImg} style={{ height: "3rem" }} />
      </div>
      <div style={{ width: "50%", margin: "auto" }}>
        <h1
          style={{
            fontSize: "2rem",
            opacity: "1",
            color: "#3B82F6",
            textAlign: "center",
          }}
        >
          ConvoGene
        </h1>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            // marginTop:"5%",
            margin: "3% 5%",
            marginTop: "5rem",
          }}
        >
          {stage === "username" && (
            <TextField
              sx={{
                width: "45%",
                marginBottom: 1,
              }}
              id="outlined-username"
              variant="outlined"
              label="Username"
              size="small"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}
          {stage === "password" && (
            <TextField
              sx={{
                width: "45%",
                marginBottom: 1,
              }}
              id="outlined-password"
              variant="outlined"
              label="Password"
              size="small"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
          <Button
            className={styles.login}
            onClick={() => {
              handleNext();
            }}
            variant="contained"
          >
            {stage === "username" ? "Continue" : "Login"}
            {/* {stage ==="password" ? navigate("/Home"):null} */}
            {/* Continue */}
          </Button>
          <div
            style={{ display: "flex", flexDirection: "row", padding: "5px" }}
          >
            <p style={{ fontSize: "12px" }}>Don't have an account?&nbsp; </p>
            <p onClick={()=>navigate('/SignUp')} style={{ fontSize: "12px", color: "#3B82F6" }}> Sign up</p>
          </div>
          <div style={rootStyle}>
            <Divider style={dividerStyle}>OR</Divider>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            // marginTop:"5%",
            margin: "3% 5%",
          }}
        >
          <Card
            variant="outlined"
            className={styles.loginContainer}
            onClick={() => loginGoogle()}
          >
            <img
              alt=""
              src={Gooogle}
              style={{ height: "1.7rem", width: "1.7rem" }}
            />{" "}
            <p
              style={{
                marginLeft: "0.5rem",
                marginBottom: "0rem",
                fontWeight: "400",
              }}
            >
              Continue with Google
            </p>
          </Card>
          <Card
            variant="outlined"
            className={styles.loginContainer}
            onClick={loginMicrosoft}
          >
            <img
              alt=""
              src={Microsoft}
              style={{ height: "1.7rem", width: "1.7rem" }}
            />{" "}
            <p
              style={{
                marginLeft: "0.5rem",
                marginBottom: "0rem",
                fontWeight: "400",
              }}
            >
              Continue with Microsoft
            </p>
          </Card>
          <Card
            variant="outlined"
            className={styles.loginContainer}
            onClick={handleGithubLogin}
          >
            <img
              alt=""
              src={Github}
              style={{ height: "1.7rem", width: "1.7rem" }}
            />{" "}
            <p
              style={{
                marginLeft: "0.5rem",
                marginBottom: "0rem",
                fontWeight: "400",
              }}
            >
              Continue with Github
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
