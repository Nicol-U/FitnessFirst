import React, { useState } from "react";
import "../App.css";
import { SidebarHeader, SidebarData, profileIcon } from "./SidebarData";
import { Link, useLocation, useNavigate } from "react-router-dom"; // ✅ import useLocation
import GreenButton from "./CustomButton";
function Sidebar() {
    const location = useLocation(); // ✅ call the hook here
    const navigate = useNavigate(); // ✅ call the hook here
    const [UserOptions, SetUserOptions] = useState(false);
    const [isLoged, SetLog] = useState(false);

    return (
    <div className="Sidebar">

        <h1 className="SidebarTitle">FITNESS FIRST</h1>
        <ul className="SidebarHeader">
            <li>
                <div id="title">{SidebarHeader[0].title}</div>
                <div id="subtitle">{SidebarHeader[0].subtitle}</div>
            </li>    
        </ul>

        <ul className="SidebarList">
            {SidebarData.map((val, key)=> {
                return (
                <Link
                    key={key}
                    className="row"
                    to={val.link}
                    style={{ textDecoration: 'none' }} 
                    id={location.pathname === val.link ? "active" : ""}
                >
                    <div id="icon">{val.icon}</div>
                    <div id="title">{val.title}</div>
                </Link>  
            ); 
            })}
        </ul>
<GreenButton
  size="medium"
  width="240px"
  position={{ position: "fixed", bottom: "40px", left: "20px" }}
  onClick={() => navigate("/LW")}
>
    LOG WORKOUT
</GreenButton>

    <div className="profile" onMouseEnter={() => SetUserOptions(true)} onMouseLeave={() => SetUserOptions(false)} >
        {profileIcon}
        {
            UserOptions && 
            <div >
                <button style={buttonStyle} onClick={() => {if (!isLoged) {navigate("/login");}}} >{isLoged ? "sign out" : " Loggin "}</button>
                <button style={buttonStyle} onClick={() => navigate("/settings")}>Settings</button>
            </div>
        }
    </div>
    </div>);
}

export default Sidebar;
//style={{display: 'flex', flexDirection: "column", color: 'black', alignItems: "center"
//}}>
const buttonStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: '30px',
    width: "50px",
    
    color: "#191A17",
    background: "#F6FFC0",
    fontSize: 10,
  
}
