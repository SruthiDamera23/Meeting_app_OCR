/**
 * This files contains all the routes of the application.
 *
 * @params: {props}
 *
 *
 */

import './App.css';
import { BrowserRouter as Router, Routes, Route, Redirect } from 'react-router-dom';
import Dashboard from "./layouts/dashboard";
import TaskAssignment from "./layouts/taskAssignment";
import Schedule from "./layouts/schedule";
import Meeting from "./layouts/schedule/meeting";
import Login from "./layouts/authentication/login";
import Signup from "./layouts/authentication/signup/index"
import ForgotPassword from './layouts/authentication/forgotPassword/index';
import TaskCalendar from "./layouts/taskCalendar";
import UserRequest from "./layouts/userRequest";
import DenyHistory from './layouts/denyhistory/DenyHistory';
import Approvehistory from './layouts/approvehistory/Approvehistory';


import AddChurch from "./layouts/addChurch";
import EditChurch from "./layouts/editChurch";
import Users from './layouts/users';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/forgot-password" element={<ForgotPassword />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/schedule" element={<Schedule />} />
        <Route exact path="/schedule/meeting" element={<Meeting />} />
        <Route exact path="/tasks" element={<TaskAssignment />} />
        <Route exact path="/task-calendar" element={<TaskCalendar />} />
        <Route exact path="/user-request" element={<UserRequest />} />
        <Route exact path="/deny-history" element={<DenyHistory />} />
        <Route exact path="/approve-history" element={<Approvehistory />} />
        <Route exact path="/add-church" element={<AddChurch />}/>
        <Route exact path="/edit-church" element={<EditChurch />}/>
        <Route exact path="/users" element={<Users />} />
      </Routes>
    </Router>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Welcome to Scheduler App
    //     </p>
    //     <a
    //       className="App-link"
    //       href="http://localhost:3001"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Scheduler App
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;

