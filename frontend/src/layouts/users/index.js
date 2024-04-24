import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import { get_users, delete_user, signup, update_user, get_church_data, getCookie, isSuperUser } from '../../../src/api';
import AppSidebar from "../../components/appSidebar";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editedIndex, setEditedIndex] = useState(null);
  const [editedUser, setEditedUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    user_type: '',
    church: getCookie('church')
  });
  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    user_type: '2',
    church: getCookie('church'),
    password: ''
  });
  const [approvalStatus, setApprovalStatus] = useState('');
  const [churchData, setChurchData] = useState([]);

  useEffect(() => {
    get_users(getCookie('church'))
      .then((response) => {
        get_church_data().then(response => {
          let tempChurchData = [];
          for (let i = 0; i < response.data.length; i++) {
            tempChurchData[response.data[i].id] = response.data[i].name;
          }
          setChurchData(tempChurchData);
        })
        setUsers(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const toggleModal = () => setModal(!modal);
  const toggleAddModal = () => setAddModal(!addModal);
  const toggleEditModal = () => setEditModal(!editModal);

  const priorityLabels = {
    1: "Super-user",
    2: "Admin",
    3: "Leader"
  };

  const handleDeleteUser = (userId) => {
    delete_user(userId).then(() => {
      toggleModal();
      setTimeout(() => {
        window.location.reload();
      }, 4000);
    });
  };

  const handleEdit = (index) => {
    setEditedIndex(index);
    setEditedUser(users[index]);
    toggleEditModal();
  };

  const handleSaveEdit = () => {
    update_user(editedUser).then(() => {
      toggleEditModal();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddUser = () => {
    signup(newUser).then((response) => {
      if (response.status === 226) {
        alert(response.data.message);
      }
      toggleAddModal();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div style={{ display: "flex" }}>
      <AppSidebar />
      <Container className="my-4">
        <Card className="my-card schedule-card">
          <div className="full-screen-calendar">
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ textAlign: 'left', display: 'inline-block' }}>Existing Users</h1>
              {!isSuperUser() && (
                <Button onClick={toggleAddModal} color="success" style={{ marginLeft: '20px' }}>Add New User</Button>
              )}
            </div>
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
                        <td style={{ padding: '8px' }}>{user.first_name + " " + user.last_name}</td>
                        <td style={{ padding: '8px' }}>{user.email}</td>
                        <td style={{ padding: '8px' }}>{priorityLabels[user.user_type]}</td>
                        <td style={{ padding: '8px' }}>{priorityLabels[user.user_type] === 'Super-user' ? '-' : churchData[user.church]}</td>
                        <td style={{ padding: '8px' }}>
                          <Button onClick={() => handleEdit(index)} color="info" style={{ marginRight: '5px' }}>Edit</Button>
                          {user.email !== getCookie('user') && (
                            <Button onClick={() => handleDeleteUser(user.id)} color="danger" style={{ marginRight: '5px' }}>Delete</Button>
                          )}
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

        <Modal isOpen={addModal} toggle={toggleAddModal}>
          <ModalHeader toggle={toggleAddModal}>Add New User</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="newFirstName">First Name</Label>
              <Input type="text" name="first_name" id="newFirstName" value={newUser.first_name} onChange={handleAddInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="newLastName">Last Name</Label>
              <Input type="text" name="last_name" id="newLastName" value={newUser.last_name} onChange={handleAddInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="newEmail">Email</Label>
              <Input type="email" name="email" id="newEmail" value={newUser.email} onChange={handleAddInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="newUserType">Privilege</Label>
              <Input type="select" name="user_type" id="newUserType" value={newUser.user_type} onChange={handleAddInputChange}>
                {isSuperUser() && <option value="1">Super-user</option>}
                <option value="2">Admin</option>
                <option value="3">Leader</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input type="password" name="password" id="password" value={newUser.password} onChange={handleAddInputChange} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleAddUser}>Add User</Button>{' '}
            <Button color="secondary" onClick={toggleAddModal}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={editModal} toggle={toggleEditModal}>
          <ModalHeader toggle={toggleEditModal}>Edit User</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="firstName">First Name</Label>
              <Input type="text" name="first_name" id="firstName" value={editedUser.first_name} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="lastName">Last Name</Label>
              <Input type="text" name="last_name" id="lastName" value={editedUser.last_name} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input type="email" name="email" id="email" value={editedUser.email} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="userType">Privilege</Label>
              <Input type="select" name="user_type" id="userType" value={editedUser.user_type} onChange={handleInputChange}>
                {isSuperUser() && <option value="1">Super-user</option>}
                <option value="2">Admin</option>
                <option value="3">Leader</option>
              </Input>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleSaveEdit}>Save</Button>{' '}
            <Button color="secondary" onClick={toggleEditModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </Container>
    </div>
  );
};

export default Users;
