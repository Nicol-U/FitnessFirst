
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { borderRadius, display, margin, padding } from "@mui/system";
import React, { useEffect, useState } from 'react';

export default function GreenButton({ size, width, position, onClick, children, BGColor = "linear-gradient(95deg, #F6FFC0, #DFFF00, #DAF900)", Txtcolor = "black" }) {
  const styles = {
    background: BGColor,
    color: Txtcolor,
    border: "none",
    width: width,
    padding:
      size === "large"
        ? "16px 28px"
        : size === "small"
        ? "6px 12px"
        : "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    position: position ? "absolute" : "static",
    ...position,
    fontFamily: "'lexend', sans-serif",
    fontWeight: 300,
    fontSize: "20px"
    
  };
// example of use in src/Components/Sidebar.js: line 35-45

// size doesn't do much but it can be "small", "medium", or "large" for different padding
//width is a string like "200px" or "100%" 
// position is an object like { position: "fixed", bottom: "20px", left: "20px" } for absolute positioning, or you can omit it for static positioning
// onClick is a function that gets called when the button is clicked
// children is the content inside the button, like the text or any nested elements

  return (
    <button style={styles} onClick={onClick}>
      {children}
    </button>
  );
}

export function GrayRactangles({widthSize="75%", heightSize="90vh", children}){
  const styles1 = {
    display: "flex",
    backgroundColor: "#212020",
    flex: 1,
    color: " white",
    border: "1px solid #2a2a2a",
    borderRadius: 14,
    padding: "12px 28px 12px 40px",
    width: "90vw",
    marginRight: "100px",
    maxHeight: heightSize,
    marginLeft: "150px",
    fontFamily: "'lexend', sans-serif",
    maxWidth: widthSize,
  };
  
  return (
    <div style={styles1}>
      <p>{children}</p>
      </div>
  );

}


const DropDownButton = ({ children, open, toggle }) => {
  return (
    <div
      onClick={toggle}
      style={{
        ...dropdownS.DropDownBtn,
        ...(open ? dropdownS.buttonOpen : {}),
      }}
    >
      <span>{children}</span>

      <span style={dropdownS.toggleIcon}>
        <ExpandMoreIcon
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "0.2s",
          }}
        />
      </span>
    </div>
  );
};

const DropDownContent = ({ children, open }) => {
  if (!open) return null;

  return <div style={dropdownS.content}>{children}</div>;
};

export const DropdownItem = ({ children, onClick }) => {
  return (
    <div style={dropdownS.DropdownItem} onClick={onClick}>
      {children}
    </div>
  );
};

export function DropDown({ buttonText, content }){
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div style={dropdownS.DropDownStyle}>
      <DropDownButton toggle={toggleDropdown} open={open}>
        {buttonText}
      </DropDownButton>

      <DropDownContent open={open}>
        {content}
      </DropDownContent>
    </div>
  );
};


const dropdownS = {
  DropDownBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "220px",
    padding: "1rem",
    backgroundColor: "black",
    color: "white",
    borderRadius: "0.5rem",
    cursor: "pointer",
    border: "1px solid white",
  },

  buttonOpen: {
    backgroundColor: "#333",
  },

  toggleIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "1rem",
  },

  content: {
    position: "absolute",
    top: "100%",
    left: 0,
    minWidth: "220px",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    color: "black",
    borderRadius: "0.5rem",
    marginTop: "0.5rem",
    overflow: "hidden",
    zIndex: 1000,
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },

  DropDownStyle: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    width: "fit-content",
  },

  DropdownItem: {
    padding: "0.75rem 1rem",
    cursor: "pointer",
    borderBottom: "1px solid #ddd",
  },
};

