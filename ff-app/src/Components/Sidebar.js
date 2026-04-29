import React from "react";
import "../App.css";
import { SidebarHeader, SidebarData, profileIcon } from "./SidebarData";
import { Link } from "react-router-dom";

function Sidebar() {
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
                    key ={key}
                    className="row"
                    to={val.link}
                    style={{ textDecoration: 'none' }} 
                    
                    id={window.location.pathname === val.link ? "active" : ""}
                    onClick={() => {window.location.pathname = val.link}}
                    >
                    <div id="icon">{val.icon}</div>
                    <div id="title">{val.title}</div>
                </Link>  
            ); 
            })}
        </ul>
     
    <button class="LogWBut">LOG WORKOUT</button>
    
    <div className="profile" href="/profile">
        {profileIcon}
    </div>
    </div>);

}

export default Sidebar;