import React, { useState } from "react";
import { Container, Card, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { addChurch } from '../../../src/api';
import AppSidebar from "../../components/appSidebar";

const AddChurchForm = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phNo, setPhNo] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [alert, setAlert] = useState({ message: '', color: '' });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !address || !phNo) {
      setAlert({ message: 'Name, address, and phone number are mandatory fields.', color: 'danger' });
      return;
    }

    const newChurchData = {
      name,
      address,
      ph_no: phNo, // In consistency with Django model
      email,
      website,
    };
    console.log(newChurchData)
    addChurch(newChurchData)
      .then(response => {
        console.log('Church added successfully:', response.data);
        setAlert({ message: 'Church added successfully', color: 'success' });
      })
      .catch(error => {
        console.error('Error adding church:', error);
        setAlert({ message: 'Failed to add church. Please try again.', color: 'danger' });
      });
  };

  return (
    <div style={{ display: "flex" }}>
      <AppSidebar />
      <Container className="my-4">
        <Card className="my-card schedule-card">
          <div className="full-screen-calendar" style={{ width: '40%', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center' }}>Add Church</h1>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="name" style={{ textAlign: 'left' }}>Name *</Label>
                <Input type="text" name="name" id="name" value={name} onChange={e => setName(e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label for="address" style={{ textAlign: 'left' }}>Address *</Label>
                <Input type="text" name="address" id="address" value={address} onChange={e => setAddress(e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label for="phNo" style={{ textAlign: 'left' }}>Phone Number *</Label>
                <Input type="text" name="phNo" id="phNo" value={phNo} onChange={e => setPhNo(e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label for="email" style={{ textAlign: 'left' }}>Email</Label>
                <Input type="email" name="email" id="email" value={email} onChange={e => setEmail(e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label for="website" style={{ textAlign: 'left' }}>Website</Label>
                <Input type="text" name="website" id="website" value={website} onChange={e => setWebsite(e.target.value)} />
              </FormGroup>
              <button type="submit" className="btn btn-primary">Submit</button>
            </Form>
            {alert.message && (
              <Alert color={alert.color} style={{ marginTop: '10px' }}>
                {alert.message}
              </Alert>
            )}
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default AddChurchForm;
