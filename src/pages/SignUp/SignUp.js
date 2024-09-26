import React, { useState } from "react";
import infobellImg from "../../assets/Images/infobellLogo.png";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import styles from "./SignUp.module.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Confirm_Password, setConfirm_Password] = useState("");
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };
  const handleSubmit = async () => {
    let formIsValid = true;
    let errors = {};

    if (!validateEmail(Email)) {
      formIsValid = false;
      errors["email"] = "Invalid email format";
    }

    if (!validatePassword(Password)) {
      formIsValid = false;
      errors["password"] =
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character";
    }

    if (Confirm_Password !== Password) {
      formIsValid = false;
      errors["confirm_password"] = "Your passwords do not match";
    }

    setErrors(errors);

    if (!formIsValid) {
      return;
    }

    const userData = { name: Name, email: Email, password: Password };

    try {
      console.log("here start of signup check ")
      const response = await axios.post(
        "https://ap-south-1.aws.data.mongodb-api.com/app/application-0-urpnbbg/endpoint/SignUp",
        JSON.stringify(userData),
        {
          headers: { "Content-Type": "application/json" },
          Authorization: "669a27f7626d5980845f8918",
        }
      );
      console.log("checking signup")

      if (response.data.success) {
        alert("User registered successfully");
        navigate("/login"); // Navigate here upon successful registration
      } else {
        alert(response.data.message || "Failed to register user");
      }
    } catch (error) {
      console.error(
        "Sign-up error:",
        error.response ? error.response.data : error.message
      );
      alert("An error occurred during sign-up");
    }
  };


  return (
    <>
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
            <TextField
              sx={{
                width: "40%",
                marginBottom: 1,
              }}
              id="outlined-username"
              variant="outlined"
              label="Username"
              type="text"
              size="small"
              value={Name}
              required={true}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              sx={{
                width: "40%",
                marginBottom: 1,
              }}
              id="outlined-username"
              variant="outlined"
              label="Email Id"
              type="text"
              size="small"
              value={Email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              sx={{
                width: "40%",
                marginBottom: 1,
              }}
              id="outlined-password"
              variant="outlined"
              label=" Create Password"
              size="small"
              type="password"
              value={Password}
              required={true}
              onChange={(e) => setPassword(e.target.value)}
            />

            <TextField
              sx={{
                width: "40%",
                marginBottom: 1,
              }}
              id="outlined-password"
              variant="outlined"
              label="Confirm Password"
              size="small"
              type="password"
              value={Confirm_Password}
              onChange={(e) => setConfirm_Password(e.target.value)}
              error={!!errors.confirm_password}
              helperText={errors.confirm_password}
            />

            <Button
              style={{
                backgroundColor: "#3B82F6",
                opacity: 0.8,
                width: "40%",
                marginTop: "0rem",
                marginBottom: "1rem",
              }}
              variant="contained"
             
                onClick={handleSubmit}
      
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default SignUp;
