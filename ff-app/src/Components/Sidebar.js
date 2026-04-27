import React from "react";
import "../App.css";
import { SidebarHeader, SidebarData } from "./SidebarData";

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
                <li
                     key ={key}
                     className="row"
                     id={window.location.pathname === val.link ? "active" : ""}
                     onClick={() => {window.location.pathname = val.link}}
                     >
                     <div id="icon">{val.icon}</div>
                     <div id="title">{val.title}</div>
                
                </li>  
            ); 
            })}
        </ul>
     
    <button class="LogWBut">LOG WORKOUT</button>
    
    </div>);

}

export default Sidebar;