import React, { useState, useRef, useEffect } from "react";
import "../App.css";
import { SidebarHeader, SidebarData, profileIcon  } from "./SidebarData";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GreenButton from "./CustomButton";
import MenuIcon from '@mui/icons-material/Menu';

// ProfileObject must be ABOVE Sidebar since it's a const
const ProfileObject = () => {
  const navigate = useNavigate(); 
  const [UserOptions, SetUserOptions] = useState(false);
  const [isLoged, SetLog] = useState(true);
  return (
    <div
      onMouseEnter={() => SetUserOptions(true)}
      onMouseLeave={() => SetUserOptions(false)}
      onClick={(e) => { e.stopPropagation(); SetUserOptions(prev => !prev); }}
    >
      {profileIcon}

      {UserOptions && (
        <div style={{
          position: "absolute",
          top: "60px",        /* updated to match new header height */
          right: 0,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ffffff",
          border: "1px solid #2a2a2a",
          borderRadius: "10px",
          padding: "8px",
          gap: "1px",
          minWidth: "40px",
        }}>
          <button onClick={() => { isLoged ? SetLog(false) : navigate("/login"); }}>
            {isLoged ? "Log Out" : "Login"}
          </button>
          <button onClick={() => navigate("/settings")}>
            Settings
          </button>
        </div>
      )}
    </div>
  );
};



export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const popupRef = useRef(null);
      
    useEffect(() => {
        function handleOutClick(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setIsVisible(false);
            }
        }
        if (isVisible) {
            document.addEventListener('mousedown', handleOutClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutClick);
        };
    }, [isVisible]);

    return (
        <div style={{ position: "fixed", zIndex: 100, top: 0, left: 0, right: 0 }}>
            <header style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#DFFF00",
                background: "black",
                height: "60px",
                padding: "0 20px",
                boxSizing: "border-box",
            }}>
                <div
                    style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                    onClick={() => setIsVisible(!isVisible)}
                >
                    <MenuIcon />
                </div>

                <span style={{ fontFamily: "sans-serif", fontSize: 20 }}>FITNESS FIRST</span>

                <ProfileObject />
            </header>

            {isVisible &&
                <div ref={popupRef} className="Sidebar" style={{
    position: "fixed",
    top: "40px",
    left: 0,
    bottom: 0,
    width: "280px",
    maxWidth: "100vw",        /* doesn't overflow on small screens */
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    padding: "20px",
    background: "black",
    minHeight: "calc(100vh - 60px)",   /* always full height */
}}>
                    <ul className="SidebarHeader">
                        <li>
                            <div id="title">{SidebarHeader[0].title}</div>
                            <div id="subtitle">{SidebarHeader[0].subtitle}</div>
                        </li>
                    </ul>

{/* nav links take remaining space */}
<ul className="SidebarList" style={{ 
    flex: 1,
    overflowY: "auto",    /* links scroll if too many */
    margin: 0,
    padding: 0,
}}>
    {SidebarData.map((val, key) => (
        <Link
            key={key}
            className="row"
            to={val.link}
            style={{ textDecoration: 'none' }}
            id={location.pathname === val.link ? "active" : ""}
            /* removed onClick close here */
        >
            <div id="icon">{val.icon}</div>
            <div id="title">{val.title}</div>
        </Link>
    ))}
</ul>

{/* button always at bottom */}
<div style={{ 
    padding: "20px 20px",
    marginTop: "auto",     /* pushes to bottom */
    flexShrink: 0,
    marginBottom: '50px'
            /* never shrinks */
}}>
    <GreenButton
        size="medium"
        onClick={() => navigate("/LW")}
    >
        LOG WORKOUT
    </GreenButton>
</div>
                </div>
            }
        </div>
    );
}
