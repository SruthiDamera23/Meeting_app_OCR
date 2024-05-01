import React, { useState, useEffect } from "react";
import {
    Sidebar,
    Menu,
    SubMenu,
    MenuItem
} from "react-pro-sidebar";
import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import ChurchIcon from '@mui/icons-material/Church';
import GroupIcon from '@mui/icons-material/Group';
import { useNavigate, Link } from "react-router-dom";
import { logout, tasks_view, getCookie, updateCookie, isSuperUser, isAdmin } from "../../api";
import "bootstrap/dist/css/bootstrap.min.css";
import Edit from "@mui/icons-material/Edit";
import { People } from "@mui/icons-material";

const AppSidebar = () => {
    const navigate = useNavigate();

    useEffect(() => {

        console.log(document.cookie);
        if (getCookie("user") == "" && getCookie("priv") == "") {
            navigate('/');
        }
    }, [])

    const handleLogout = async () => {
        logout()
            .then(() => {
                updateCookie('user', '');
                updateCookie('priv', '');
                navigate("/");
            })
            .catch((error) => {
                console.log(error.response.data);
            });
    };

   


    return (
        <Sidebar
            className="sidebar"
            width="10%"
            backgroundColor="rgba(200, 250, 200, 0.2)"
            rootStyles={{ position: "fixed", borderRightColor: "rgb(160, 200, 160)" }}
        >
            <Menu>
                <MenuItem className="sidebar-menu-item" component={<Link to="/dashboard" />}>
                    <SpeedOutlinedIcon className="sidebar-menu-item-icon" />
                    <br />
                    Dashboard
                </MenuItem>
                <SubMenu
                    className="sidebar-menu-item"
                    label={
                        <div>
                            <ForumOutlinedIcon className="sidebar-menu-item-icon" />
                            <br />
                            Meetings
                        </div>
                    }
                >
                    <MenuItem className="sidebar-menu-item" component={<Link to="/schedule/meeting" state={{ meeting: null, clearForm: true }} />}>
                        <AddCircleOutlineOutlinedIcon />
                        <br />
                        New
                    </MenuItem>
                    <MenuItem className="sidebar-menu-item" component={<Link to="/schedule" />}>
                        <GridViewOutlinedIcon />
                        <br />
                        List
                    </MenuItem>
                </SubMenu>
                <SubMenu
                    className="sidebar-menu-item"
                    label={
                        <div>
                            <AssignmentOutlinedIcon className="sidebar-menu-item-icon" />
                            <br />
                            Tasks
                        </div>
                    }
                >
                    <MenuItem className="sidebar-menu-item" component={<Link to="/task-calendar" />}>
                        <CalendarMonthOutlinedIcon />
                        <br />
                        <div style={{ overflow: "visible" }}>Dates</div>
                    </MenuItem>

                    <MenuItem className="sidebar-menu-item" component={<Link to="/tasks" />}>
                        <GridViewOutlinedIcon />
                        <br />
                        List
                    </MenuItem>
                </SubMenu>
                
               { (isSuperUser() || isAdmin() ) && <MenuItem className="sidebar-menu-item" component={<Link to="/users" />}>
                    <People className="sidebar-menu-item-icon" />
                    <br />
                    Users
                </MenuItem>}

                { (isSuperUser() ) && <MenuItem className="sidebar-menu-item" component={<Link to="/subscribers" />}>
                    <GroupIcon className="sidebar-menu-item-icon" />
                    <br />
                    Subscribers
                </MenuItem>}

                {isSuperUser() &&
                    <SubMenu
                        className="sidebar-menu-item"
                        label={
                            <div>
                                <ChurchIcon className="sidebar-menu-item-icon" />
                                <br />
                                Church
                            </div>
                        }
                    >
                        {<MenuItem className="sidebar-menu-item" component={<Link to="/add-church" />}>
                            <AddCircleOutlineOutlinedIcon />
                            <br />
                            <div style={{ overflow: "visible" }}>Add</div>
                        </MenuItem>}

                        <MenuItem className="sidebar-menu-item" component={<Link to="/edit-church" />}>
                            <Edit />
                            <br />
                            Edit
                        </MenuItem>
                    </SubMenu>
                }

                        {<MenuItem className="sidebar-menu-item" component={<Link to="/people" />}>
                            <EmojiPeopleIcon/>
                            <br />
                            <div style={{ overflow: "visible" }}>People</div>
                        </MenuItem>}

                        {(isSuperUser() || isAdmin()) && <MenuItem className="sidebar-menu-item" component={<Link to="/subscriptions" />}>
                            <AttachMoneyIcon/>
                            <br />
                            <div style={{ overflow: "visible" }}>Subscriptions</div>
                        </MenuItem>}     

                        {isSuperUser() && <MenuItem className="sidebar-menu-item" component={<Link to="/paymenthistory" />}>
                            <ReceiptIcon/>
                            <br />
                            <div style={{ overflow: "visible" }}>Payments</div>
                        </MenuItem>}

                        {isAdmin() && <MenuItem className="sidebar-menu-item" component={<Link to="/paymenthistorya" />}>
                            <ReceiptIcon/>
                            <br />
                            <div style={{ overflow: "visible" }}>Payments</div>
                        </MenuItem>}

                <MenuItem className="sidebar-menu-item" component={<div onClick={handleLogout} />}>
                    <LogoutOutlinedIcon className="sidebar-menu-item-icon" />
                    <br />
                    Logout
                </MenuItem>

            </Menu>
        </Sidebar>
    );
};

export default AppSidebar;