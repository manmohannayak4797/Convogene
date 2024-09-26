import React from "react";
import infobellImg from "../../assets/Images/infobellLogo.png";
import Gradient from 'rgt'
import styles from "./Landing.module.css";
import Button from "@mui/material/Button";
import { useNavigate } from 'react-router-dom';
import IconsHolder from "../../components/IconsHolder/IconsHolder";

const Landing = () => {
    const navigate = useNavigate();
  return (
    <>
      <div style={{ height: "100vh", width: "100vw" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            height: "10%",
            width: "100%",
            padding:"15px"
          }}
        >
          <img alt="" src={infobellImg} style={{ height: "3rem" }} />
          <Button  style={{
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: '#3B82F6',
          alignItems: 'center',
          border: '2px solid',
          borderRadius: '20px',
          width: '100px',
          height: '40px',
          padding: '10px',
        }}
        variant="contained" onClick={()=> navigate('/login')}>Sign in</Button>
        </div>
        <div
          style={{
            width: "100vw",
            height: "80vh",
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              width: "50%",
              alignItems:"center"
            }}
          >
            <h1
            style={{
              fontSize: "2rem",
              opacity: "1",
              color: "#3B82F6",
              textAlign: "center",
            }}
          >
<h1 style={{fontSize:"80px"}}>
  <Gradient dir="left-to-right" from="#34ebc0" to="#3480eb">
                ConvoGene
            </Gradient></h1>
          </h1>
          <h4 style={{textAlign:"center"}}>Elevate your Interaction</h4>
          <Button  style={{
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: '#3B82F6',
          alignItems: 'center',
          border: '2px solid',
          borderRadius: '20px',
          width: '100px',
          height: '40px',
          padding: '10px',
        }}
        variant="contained" onClick={()=> navigate('/login')} >Sign in</Button>
          </div>
           


          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              width: "50%",
            }}
          >
             <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                flexWrap: "wrap",
              }}
            >
              
               
            

              <div className={styles.promptCustom}>
                <IconsHolder type="Writer" />
                <p className={styles.title}>Custom Data Conversations</p>
                <p className={styles.subtext}>
                  Chat effortlessly with ConvoGene, on your data.
                </p>
              </div>
              <div className={styles.promptCustom}>
                <IconsHolder type="Woman" />
                <p className={styles.title}>Personalized Assistance</p>
                <p className={styles.subtext}>
                  Get tailored help from ConvoGene for all your needs.
                </p>
              </div>
              <div className={styles.promptCustom}>
                <IconsHolder type="Graduate" />
                <p className={styles.title}>Knowledge Management</p>
                <p className={styles.subtext}>
                  Enables access control over information, enhancing security.
                </p>
              </div>
              <div className={styles.promptCustom}>
                <IconsHolder type="Security" />
                <p className={styles.title}>Privacy and Security</p>

                <p className={styles.subtext}>
                  Your data's safety is ConvoGene's top priority.
                </p>
              </div>
            
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
