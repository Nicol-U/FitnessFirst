import React from 'react';
import ReactDom from 'react-dom/client';
import Sidebar from '../Components/Sidebar';
import backgoundI from '../Asset/image1.jpg'
import { fontSize } from '@mui/system';
import GreenButton, { GrayRactangles } from '../Components/CustomButton';
import { Button } from 'bootstrap';

export function CreateAcc() {
  return (
    <div
      style={{
        backgroundImage: `url(${backgoundI})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",

        width: "100vw",
        height: "100vh",
      }}
    > 
    <div
  style={{
    display: "flex",
    width: "100%",
    height: "100vh",
  }}
>
  {/* LEFT SIDE */}
  <div
    style={{
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <h1 style={{ color: "white" }}>
      Content goes here
    </h1>
  </div>

  {/* RIGHT SIDE */}
  <div
    style={{
        marginTop: "70px",
        marginBottom: "70px",
        marginRight: "20px",
        borderRadius: '15px', 
        flexDirection: 'column',
        padding: "40px",
      flex: 1,
      display: "flex",
      alignItems: "flex-start",
      backgroundColor: "rgba(26,26,26,0.6)",
    }}
  >

    <div>
    <h1 style={{ color: "white", fontFamily: "sans-serif"}}>
      IDENTITY SETUP
    </h1>
    <h2 style={{color: "#ADAAAA", fontFamily: "'lexend', sans-serif", fontSize: 15}}>Foundational data for your performance profile.</h2>
    </div>

    {RenderCards()}
          <div style={{marginTop: "150px", }}>
          <button style={submitBtn}> INITIALIZE PROFILE</button>
      </div>
  </div>
  
</div>
</div>
  );
}


export default CreateAcc;


const RenderCards = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "5px",
        width: "100%",
      }}
    >
      {cards.map((card, index) => (
        <div
          key={index}
          style={{
            borderRadius: "10px",
            color: "#DFFF00",
            fontSize: 10,
            fontFamily: "sans-serif",


            // 3rd item spans entire row
            gridColumn: index === 2 ? "1 / span 2" : "auto",
          }}
        >
          <h2>{card.title}</h2>

          <input
            type="text"
            placeholder={card.example}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "none",
              outline: "none",
              backgroundColor: "#5a5a5a",
              color: "white",
              boxSizing: "border-box",
            }}
          />
        </div>
      ))}


    </div>
    
  );
};

const submitBtn = {
  background: "yellow",
  color: "black",
  border: "none",


  width: "45%",
  height: "9%",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  textAlign: "center",


  borderRadius: "4px",
  cursor: "pointer",

  position: "absolute",

  fontFamily: "'lexend', sans-serif",
  fontSize: "20px",

  boxSizing: "border-box",
};

const cards = [
    {
        title: "FULL NAME",
        example: "ALEX RIVERA",
    },

    {
        title: "USERNAME",
        example: "@archive_user",
    },

    {
        title: "EMAIL ADDRESS",
        example: "alex@performance.com",
    },

    {
        title: "PASSWORD",
        example: "••••••••",
    },

    {
        title: "BIRTHDATE",
        example: "...."
    }
]

const Right = {
    UserInfo: {
    color: "#DAF900",
    fontFamily: "sans-serif",
    fontSize: 10,
    },

    header: {

    },

    InfoFill: {

    },

    WeightBtns: {

    },


}