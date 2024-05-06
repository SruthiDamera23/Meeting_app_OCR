import React, { useState, useEffect } from 'react';
import { get_church_data, update_church_data, delete_church_data } from '../../../src/api';
import AppSidebar from "../../components/appSidebar";
import { Container, Card, Title,NavLink, Text ,Button, TextInput } from "@mantine/core";
const ChurchList = () => {
    const [churches, setChurches] = useState([]);
    const [editIndex, setEditIndex] = useState(-1);
    const [editedChurch, setEditedChurch] = useState({});
    const [initialChurchData, setInitialChurchData] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchChurchData();
    }, []);

    const fetchChurchData = () => {
        get_church_data()
            .then(response => {
                setChurches(response.data);
            })
            .catch(error => {
                console.error('Error fetching church data:', error);
            });
    };

    const handleEdit = (index, church) => {
        setEditIndex(index);
        setEditedChurch(church);
        setInitialChurchData(church);
    };

    const handleSave = () => {
        const validationErrors = {};
        if (!editedChurch.name) {
            validationErrors.name = 'Name is required.';
        }
        if (!editedChurch.address) {
            validationErrors.address = 'Address is required.';
        }
        if (editedChurch.ph_no && !/^\d{10}$/.test(editedChurch.ph_no)) {
            validationErrors.ph_no = 'Phone number must be 10 digits.';
        }
        if (editedChurch.email && !/^\S+@\S+\.\S+$/.test(editedChurch.email)) {
            validationErrors.email = 'Please enter a valid email address.';
        }
        if (editedChurch.website && !/^https?:\/\/\S+$/.test(editedChurch.website)) {
            validationErrors.website = 'Please enter a valid website URL.';
        }

        if (Object.keys(validationErrors).length === 0) {
            update_church_data(editedChurch.id, editedChurch)
                .then(response => {
                    console.log('Church data updated successfully:', response);
                    setEditIndex(-1);
                    setEditedChurch({});
                    setErrors({});
                    fetchChurchData();
                })
                .catch(error => {
                    console.error('Error updating church data:', error);
                });
        } else {
            setErrors(validationErrors);
        }
    };

    const handleCancel = () => {
        setEditIndex(-1);
        setEditedChurch({});
        setErrors({});
    };

    const handleDelete = (churchId) => {
        if (window.confirm("Are you sure you want to delete this church?")) {
            delete_church_data(churchId)
                .then(response => {
                    console.log('Church deleted successfully:', response);
                    fetchChurchData();
                })
                .catch(error => {
                    console.error('Error deleting church:', error);
                });
        }
    };

    const handleInputChange = (e, key) => {
        const value = e.target.value;
        setEditedChurch(prevState => ({
            ...prevState,
            [key]: value
        }));
        setErrors(prevState => ({
            ...prevState,
            [key]: '' // Clear error message when input changes
        }));
    };

    return (
        <div style={{ display: 'flex' }}>
            <AppSidebar style={{ width: '20%' }} />
            <Container className="church-list" style={{ width: '80%', marginLeft: '15%', marginTop:"30px" }}>
                <h2>Church List</h2>
                <table className="table" style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Phone Number</th>
                            <th>Email</th>
                            <th>Website</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {churches.map((church, index) => (
                            <tr key={church.id}>
                                <td>{editIndex === index ? <input type="text" value={editedChurch.name} onChange={e => handleInputChange(e, 'name')} /> : church.name}</td>
                                <td>{editIndex === index ? <input type="text" value={editedChurch.address} onChange={e => handleInputChange(e, 'address')} /> : church.address}</td>
                                <td>{editIndex === index ? <input type="text" value={editedChurch.ph_no} onChange={e => handleInputChange(e, 'ph_no')} /> : church.ph_no}</td>
                                <td>{editIndex === index ? <input type="text" value={editedChurch.email} onChange={e => handleInputChange(e, 'email')} /> : church.email}</td>
                                <td>{editIndex === index ? <input type="text" value={editedChurch.website} onChange={e => handleInputChange(e, 'website')} /> : church.website}</td>
                                <td >
                                    {editIndex === index ? (
                                        <div style={{display:"flex"}}> 
                                            <Button  variant="filled" color="rgba(90, 211, 250, 1)" style={{ marginRight: '5px',color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }} onClick={handleSave}>Update</Button>
                                            <Button variant="filled" color="rgba(214, 66, 66, 1)" style={{    padding: '5px 10px', borderRadius: '5px' }} onClick={handleCancel}>Cancel</Button>
                                        </div>
                                    ) : (
                                        <div style={{display:"flex"}}>
                                            <Button  variant="filled" color="rgba(90, 211, 250, 1)" style={{ color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }} onClick={() => handleEdit(index, church)}>Edit</Button>
                                            <Button variant="filled" color="rgba(214, 66, 66, 1)" style={{ color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', marginLeft: '5px' }} onClick={() => handleDelete(church.id)}>Delete</Button>
                                        </div>
                                    )}
                                    {Object.keys(errors).map(key => (
                                        <div key={key} style={{ color: 'red', fontSize: '12px' }}>{errors[key]}</div>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Container>
        </div>
    );
};

export default ChurchList;
