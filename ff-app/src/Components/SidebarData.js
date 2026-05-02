import React from "react";
import DashboardIcon from '@mui/icons-material/Dashboard';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import { Link } from "react-router-dom";

export const profileIcon = <AccountCircleSharpIcon />;

export const SidebarHeader =  [
    {
        title: 'THE ARCHIVE',
        subtitle: 'ELITE PERFORMANCE',
    }
];

export const SidebarData =  [
{
    title: "DASHBOARD",
    icon: <DashboardIcon />,
    link: "/"
},

{
    title: "WORKOUT PLANS",
    icon: <FitnessCenterIcon />,
    link: "/logworkoutplan"
},

/*{
    title: "LOG WORKOUT",
    icon: <EditNoteIcon />,
    link: "/LW"
},

*/

{
    title: "HISTORY",
    icon: <CalendarMonthIcon />,
    link: "/history"
},

{
    title: "SETTINGS",
    icon: <SettingsIcon />,
    link: "/settings"
},


];