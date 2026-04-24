import React from "react";
import DashboardIcon from '@mui/icons-material/Dashboard';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';

export const SidebarData =  [
{
    title: "DASHBOARD",
    icon: <DashboardIcon />,
    link: "/home"
},

{
    title: "WORKOUT PLANS",
    icon: <FitnessCenterIcon />,
    link: "/WorkoutPlans"
},

{
    title: "LOG WORKOUT",
    icon: <EditNoteIcon />,
    link: "/LogWorkout"
},


{
    title: "HISTORY",
    icon: <CalendarMonthIcon />,
    link: "/History"
},

{
    title: "SETTINGS",
    icon: <SettingsIcon />,
    link: "/settings"
},


];