import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button
} from 'reactstrap';
import {user_requests,delete_request,signup} from '../../../src/api'

import ReactDOM from 'react-dom';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import AppSidebar from "../../components/appSidebar";


const UserRequest = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mustGetUsers, setMustGetUsers] = useState(true);

  useEffect(() => {
    if (mustGetUsers) {
      get_requests();
    }
  }, [mustGetUsers]);


  const get_requests=()=>{
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
  const handleApprove = (userTemp) => {
 

     const userData= {
        'church_id': userTemp.church,
        'email': userTemp.email,
        'first_name': userTemp.first_name,
        'is_active':userTemp.is_active,
        'last_name': userTemp.last_name,
        'user_type':userTemp.user_type,
        'password':userTemp.password
      }

      console.log(userData);

    //   delete_request(userTemp.id).then((req)=>{
    //       console.log('deleted');
    // })
 
    signup(userData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });



 
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
                          <Button onClick={() => handleApprove(user)} color="success">Approve</Button>{' '}
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
