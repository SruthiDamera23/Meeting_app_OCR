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
import { get_users ,delete_user, get_church_data, getCookie} from '../../../src/api'; 
import AppSidebar from "../../components/appSidebar";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState('');
  const [churchData,setChurchData] = useState([]);
  useEffect(() => {
    console.log("cid====",getCookie('church'))
    get_users(getCookie('church'))
      .then((response) => {
        get_church_data().then( response => {
          let tempChurchData=[];
          for(let i=0;i<response.data.length;i++) {
            tempChurchData[response.data[i].id] = response.data[i].name;
        }
        console.log(tempChurchData);
        setChurchData(tempChurchData);
        })
        let tempUsersData = response.data.filter(item => item.email !== getCookie('user'))
        setUsers(tempUsersData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });

  }, []);


  const toggleModal = () => setModal(!modal);

  const priorityLabels = {
    1: "Super-user",
    2: "Admin",
    3: "Leader"
  };

  const handleDeleteUser = (userId) => {
    delete_user(userId).then((req)=>{
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
            <h1 style={{ textAlign: 'left', paddingLeft: '380px' }}>Existing Users</h1>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid black' }}>
                      <th style={{ borderBottom: '1px solid black', padding: '8px' }}>Name</th>
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
                        <td style={{ padding: '8px' }}>{priorityLabels[user.user_type]=='Super-user' ?'-':churchData[user.church]}</td>
                        
                        <td style={{ padding: '8px' }}>
                          <Button onClick={() => handleDeleteUser(user.id)} color="danger">Delete</Button>
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
          <ModalHeader toggle={toggleModal}>{approvalStatus === 'added' ? 'User Added' : 'User Deleted'}</ModalHeader>
          <ModalBody>
            {approvalStatus === 'added' ? 'New user has been added.' : 'User has been deleted.'}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggleModal}>OK</Button>{' '}
          </ModalFooter>
        </Modal>
      </Container>
    </div>
  );
};

export default Users;
