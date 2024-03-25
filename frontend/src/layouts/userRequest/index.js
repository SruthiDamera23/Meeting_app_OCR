import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import {user_requests,delete_request,signup, signup_approve, get_church_data} from '../../../src/api'

import ReactDOM from 'react-dom';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import AppSidebar from "../../components/appSidebar";
let churchData = [];


const UserRequest = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mustGetUsers, setMustGetUsers] = useState(true);
  const [modal, setModal] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState('');
  const [UserNameOfRequest, UserNameOfRequesr] = useState('');
  useEffect(() => {
    if (mustGetUsers) {
      get_requests();
    }
  }, [mustGetUsers]);

  useEffect(()=>{
    get_church_data().then( response => {
      churchData = [];
      for(let i=0;i<response.data.length;i++) {
      churchData[response.data[i].id] = response.data[i].name;
    }
    console.log(churchData);
    })
},[])


  const priorityLabels = {
    1: "Super-user",
    2: "Admin",
    3: "Leader"
  };
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

  const toggleModal = () => setModal(!modal);

  const handleApprove = (userTemp) => {
 

     const userData= {
      'email': userTemp.email,
        
        'first_name': userTemp.first_name,
        'last_name': userTemp.last_name,
        'is_active':userTemp.is_active,
        'user_type':userTemp.user_type,
        'church': userTemp.church,
        'password':userTemp.password
      }

      console.log(userData);

     
 
    signup(userData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });

      delete_request(userTemp.id).then((req)=>{
        setApprovalStatus('approved');
        toggleModal();
        setTimeout(() => {
          window.location.reload();
        }, 4000);
  })


 
  };

  const handleDeny = (userTemp) => {
    const userData= {
      'email': userTemp.email,
        
        'first_name': userTemp.first_name,
        'last_name': userTemp.last_name,
        'is_active':userTemp.is_active,
        'user_type':userTemp.user_type,
        'church': userTemp.church,
        'password':userTemp.password
      }

      
      

      console.log(userData);

      delete_request(userTemp.id).then((req)=>{
          setApprovalStatus('denied');
          window.location.reload();
          toggleModal();
        setTimeout(() => {
          window.location.reload();
        }, 4000);
    })

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
                      <th style={{ borderBottom: '1px solid black', padding: '8px' }}>Privilege</th>
                      <th style={{ borderBottom: '1px solid black', padding: '8px' }}>Church</th>
                      <th style={{ borderBottom: '1px solid black', padding: '8px' }}>Actions</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={index}>
                        <td style={{ padding: '8px' }}>{user.first_name+" "+user.last_name}</td>
                        <td style={{ padding: '8px' }}>{user.email}</td>
                        <td style={{ padding: '8px' }}>{priorityLabels[user.user_type]}</td>
                        <td style={{ padding: '8px' }}>{churchData[user.church]}</td>
                        <td style={{ padding: '8px' }}>
                          <Button onClick={() => handleApprove(user)} color="success">Approve</Button>{' '}
                          <Button onClick={() => handleDeny(user)} color="danger">Deny</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>

        <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>{approvalStatus === 'approved' ? 'Access Approved' : 'Access Denied'}</ModalHeader>
        <ModalBody>
          {approvalStatus === 'approved' ? 'User access has been approved.' : 'User access has been denied.'}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggleModal}>OK</Button>{' '}
        </ModalFooter>
      </Modal>
      </Container>
    </div>
  );
};

export default UserRequest;
