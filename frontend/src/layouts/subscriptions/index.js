import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Form
} from 'reactstrap';
import { get_subscriptions, add_subscription, update_subscription, delete_subscription } from '../../../src/api';
import AppSidebar from '../../components/appSidebar';

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    count: '' // Added count field to formData
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = () => {
    get_subscriptions()
      .then((response) => {
        // Modify response data to include count field
        const updatedSubscriptions = response.data.map(subscription => ({
          ...subscription,
          count: subscription.count || 0  // Set count to 0 if it's not provided in the response
        }));
        setSubscriptions(updatedSubscriptions);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toggleModal = (subscription = null) => {
    setModal(!modal);
    if (subscription) {
      setSelectedSubscription(subscription);
      setFormData({
        id: subscription.id,
        name: subscription.name,
        price: subscription.price.toString(),
        count: subscription.count.toString() // Set count in formData
      });
      setIsEditMode(true);
    } else {
      setSelectedSubscription(null);
      setFormData({ id: '', name: '', price: '', count: '' }); // Include count in initial state
      setIsEditMode(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddSubscription = (e) => {
    e.preventDefault();
    add_subscription(formData)
      .then(() => {
        toggleModal();
        fetchSubscriptions();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateSubscription = (e) => {
    e.preventDefault();
    const { id, ...updatedData } = formData; // Extract subscription ID and remaining data
    update_subscription(id, updatedData) // Pass ID and updated data to the update_subscription function
      .then(() => {
        toggleModal();
        fetchSubscriptions();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteSubscription = (id) => {
    delete_subscription(id)
      .then(() => {
        fetchSubscriptions();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div style={{ display: "flex" }}>
      <AppSidebar />
      <Container>
        <h1>Subscriptions</h1>
        <Button color="primary" onClick={() => toggleModal()}>Add Subscription</Button>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Count</th> {/* Add count column header */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => (
              <tr key={subscription.id}>
                <td>{subscription.name}</td>
                <td>${subscription.price}</td>
                <td>{subscription.count}</td> {/* Display count */}
                <td>
                  <Button color="info" onClick={() => toggleModal(subscription)}>Edit</Button>
                  <Button color="danger" onClick={() => handleDeleteSubscription(subscription.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal isOpen={modal} toggle={toggleModal}>
          <ModalHeader toggle={() => toggleModal()}>{isEditMode ? 'Edit Subscription' : 'Add Subscription'}</ModalHeader>
          <ModalBody>
            <Form onSubmit={isEditMode ? handleUpdateSubscription : handleAddSubscription}>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} />
              </FormGroup>
              <FormGroup>
                <Label for="price">Price</Label>
                <Input type="text" name="price" id="price" value={formData.price} onChange={handleInputChange} />
              </FormGroup>
              <FormGroup>
                <Label for="count">Count</Label> {/* Add count input field */}
                <Input type="number" name="count" id="count" value={formData.count} onChange={handleInputChange} />
              </FormGroup>
              <Button color="primary" type="submit">{isEditMode ? 'Update' : 'Add'}</Button>{' '}
              <Button color="secondary" onClick={() => toggleModal()}>Cancel</Button>
            </Form>
          </ModalBody>
        </Modal>
      </Container>
    </div>
  );
};

export default SubscriptionsPage;
