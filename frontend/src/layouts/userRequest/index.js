import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button
} from 'reactstrap';
import {user_requests} from '../../../src/api'

import ReactDOM from 'react-dom';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import AppSidebar from "../../components/appSidebar";
import { tasks_view, approveUser, denyUser } from "../../api";

const UserRequest = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mustGetUsers, setMustGetUsers] = useState(true);

  useEffect(() => {
    if (mustGetUsers) {
      user_requests()
        .then((req) => {
          const usersData = req.data;
          console.log(usersData);
          setUsers(req.data);
          setIsLoading(false);
          setMustGetUsers(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [mustGetUsers]);

  const handleApprove = (userId) => {

    // approveUser(userId)
    //   .then((response) => {
    //     // If successful, refresh users data
    //     setMustGetUsers(true);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  const handleDeny = (userId) => {
    // // Handle denial logic
    // denyUser(userId)
    //   .then((response) => {
    //     // If successful, refresh users data
    //     setMustGetUsers(true);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  return (
    <div style={{ display: "flex" }}>
      <AppSidebar />
      <Container className="my-4">
        <Card className="my-card schedule-card">
          <div className="full-screen-calendar">
            <h1 style={{ textAlign: 'left', paddingLeft: '380px' }}>User Approval</h1>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid black' }}>
                      <th style={{ borderBottom: '1px solid black', padding: '8px' }}>name</th>
                      <th style={{ borderBottom: '1px solid black', padding: '8px' }}>Email</th>
                      <th style={{ borderBottom: '1px solid black', padding: '8px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={index}>
                        <td style={{ padding: '8px' }}>{user.first_name+" "+user.last_name}</td>
                        <td style={{ padding: '8px' }}>{user.email}</td>
                        <td style={{ padding: '8px' }}>
                          <Button onClick={() => handleApprove(user.id)} color="success">Approve</Button>{' '}
                          <Button onClick={() => handleDeny(user.id)} color="danger">Deny</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default UserRequest;
