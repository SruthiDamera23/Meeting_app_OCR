import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import { Container, Card, Title,NavLink, Text ,Button, TextInput } from "@mantine/core";
import { delete_user, signup, update_user, get_church_data, getCookie, isSuperUser, subscription_view, get_users, edit_church, delete_church } from '../../../src/api';
import AppSidebar from "../../components/appSidebar";

const Subscribers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [churchData, setChurchData] = useState([]);
  const [editedIndex, setEditedIndex] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: ''
  });
  const [approvalStatus, setApprovalStatus] = useState('');
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);

  const toggleEditModal = () => setEditModal(!editModal);
  useEffect(() => {
    get_church_data()
      .then((response) => {
        Promise.all(response.data.map(church => {
            return Promise.all([
                subscription_view(church.subscription),
                get_users(church.id)
            ])
            .then(([subscriptionRes, usersRes]) => {
                // Check if usersRes.data has length greater than zero
                if (usersRes.data.length > 0) {
                    return {
                        address: church.address,
                        church_email: church.address,
                        church_id: church.id,
                        church_name: church.name,
                        church_ph_no: church.ph_no,
                        subscription: church.subscription,
                        website: church.website,
                        count: subscriptionRes.data.find(item => item.id === church.subscription)?.count,
                        subscription_name: subscriptionRes.data.find(item => item.id === church.subscription)?.name,
                        admin_name: usersRes.data[0].first_name + " " + usersRes.data[0].last_name,
                        admin_email: usersRes.data[0].email,
                        existin_user_count: usersRes.data.length
                    };
                } else {
                    // Return null if usersRes.data has zero length
                    return null;
                }
            });
        }))
        .then(churches => {
            // Filter out null values from the list
            churches = churches.filter(church => church !== null);
            console.log(churches)
            setChurchData(churches);
            setIsLoading(false);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);



  const priorityLabels = {
    1: "Super-user",
    2: "Admin",
    3: "Leader"
  };

  const handleEdit = (index) => {
    setEditedIndex(index);
    setEditedUser(churchData[index]);
    toggleEditModal();
  };
  const handleSaveEdit = () => {
    edit_church(editedUser).then(() => {
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

  const handleDeleteUser = (churchId) => {
    get_users(churchId)
      .then((response) => {
        response.data.forEach((user) => {
          delete_user(user.id)
            .then(() => {
              console.log(`User ${user.id} deleted successfully.`);
            })
            .catch((error) => {
              console.error(`Error deleting user ${user.id}:`, error);
            });
        });
        delete_church(churchId)
          .then(() => {
            console.log(`Church ${churchId} deleted successfully.`);
            toggleModal(); 
            setTimeout(() => {
              window.location.reload();
            }, 4000);
          })
          .catch((error) => {
            console.error(`Error deleting church ${churchId}:`, error);
          });
      })
      .catch((error) => {
        console.error(`Error fetching users for church ${churchId}:`, error);
      });
  };
  


  return (
    <div style={{ display: "flex" }}>
      <AppSidebar />

      <Container className="my-4">
        <Card className="my-card schedule-card">
        <h1 style={{ textAlign: 'center', display: 'inline-block', marginBottom:"20px", marginTop:"10px" }}>Subscribers</h1>
          <div className="full-screen-calendar">
            <div style={{ textAlign: 'center' }}>
            </div>
            {isLoading && <p>Loading...</p>}
            {!isLoading && (
              <div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>

                    <tr style={{ borderBottom: '1px solid black' }}>
                      {/* address
                    admin_email
                    admin_name
                    church_email
                    church_id
                    church_name
                    church_ph_no
                    count
                    subscription
                    subscription_name
                    website  */}

                      <th style={{ borderBottom: '1px solid black', padding: '8px' }}>Church name</th>
                      <th style={{ borderBottom: '1px solid black', padding: '8px' }}>Admin name</th>
                      <th style={{ borderBottom: '1px solid black', padding: '8px' }}>Subscription type</th>
                      <th style={{ borderBottom: '1px solid black', padding: '8px' }}>Existing User count</th>
                      <th style={{ borderBottom: '1px solid black', padding: '8px' }}>Total User limit</th>
                      <th style={{ borderBottom: '1px solid black', padding: '8px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {churchData.map((church, index) => (
                      <tr>
                        <td style={{ padding: '8px' }}>{church.church_name}</td>
                        <td style={{ padding: '8px' }}>{church.admin_name}</td>
                        <td style={{ padding: '8px' }}>{church.subscription_name}</td>
                        <td style={{ padding: '8px' }}>{church.existin_user_count}</td>
                        <td style={{ padding: '8px' }}>{church.count}</td>
                        <td style={{ padding: '8px', display :'flex' }} >
                          <Button variant="filled" color="rgba(90, 211, 250, 1)" onClick={() => handleEdit(index)}  style={{ marginRight: '5px' }}>Edit</Button>
                          <Button  variant="filled" color="rgba(214, 66, 66, 1)"  onClick={() => handleDeleteUser(church.church_id)} style={{ marginRight: '5px' }}>Delete</Button>
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
        <Modal isOpen={editModal} toggle={toggleEditModal}>
          <ModalHeader toggle={toggleEditModal}>Edit User</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="firstName">Church Name</Label>
              <TextInput type="text" name="name" id="firstName" defaultValue={editedUser.church_name} onChange={handleInputChange} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button variant="filled" color="rgba(90, 211, 250, 1)" onClick={handleSaveEdit}>Save</Button>{' '}
            <Button  variant="filled" color="rgba(214, 66, 66, 1)" onClick={toggleEditModal}>Cancel</Button>
          </ModalFooter>
        </Modal>

      </Container>
    </div>
  );
};

export default Subscribers;




