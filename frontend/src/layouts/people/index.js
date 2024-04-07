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
  Input
} from 'reactstrap';
import { person_view, add_person, delete_person } from '../../../src/api';
import AppSidebar from '../../components/appSidebar';

const PersonPage = () => {
  const [persons, setPersons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchPersons();
  }, []);

  const fetchPersons = () => {
    person_view()
      .then((response) => {
        setPersons(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toggleModal = () => setModal(!modal);
  const toggleDeleteModal = (id = null) => {
    setDeleteId(id);
    setDeleteModal(!deleteModal);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddPerson = () => {
    add_person(formData)
      .then(() => {
        toggleModal();
        fetchPersons();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeletePerson = () => {
    if (!deleteId) return;
    delete_person(deleteId)
      .then(() => {
        toggleDeleteModal();
        fetchPersons();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div style={{ display: "flex" }}>
      <AppSidebar />
      <Container>
        <h1>Persons</h1>
        <Button color="primary" onClick={toggleModal}>Add Person</Button>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {persons.map((person) => (
              <tr key={person.id}>
                <td>{person.name}</td>
                <td>{person.email}</td>
                <td>
                  <Button color="danger" onClick={() => toggleDeleteModal(person.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal isOpen={modal} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Add Person</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleAddPerson}>Add</Button>{' '}
            <Button color="secondary" onClick={toggleModal}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
          <ModalHeader toggle={toggleDeleteModal}>Delete Person</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this person?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={handleDeletePerson}>Delete</Button>{' '}
            <Button color="secondary" onClick={toggleDeleteModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </Container>
    </div>
  );
};

export default PersonPage;
