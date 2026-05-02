import React from "react";
import "../App.css";
import { SidebarHeader, SidebarData, profileIcon } from "./SidebarData";
import { Link, useLocation, useNavigate } from "react-router-dom"; // ✅ import useLocation
import CustomButton from "./CustomButton";
function Sidebar() {
    const location = useLocation(); // ✅ call the hook here
    const navigate = useNavigate(); // ✅ call the hook here

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
<CustomButton
  size="medium"
  width="240px"
  position={{ position: "fixed", bottom: "40px", left: "20px" }}
  onClick={() => navigate("/LW")}
>
    LOG WORKOUT
</CustomButton>

    <div className="profile" onClick={() => navigate("/profile")}>
        {profileIcon}
    </div>
    </div>);

}

export default Sidebar;