import React, { useState, useEffect } from 'react';
import { get_church_data, update_church_data, delete_church_data } from '../../../src/api';
import AppSidebar from "../../components/appSidebar";

const ChurchList = () => {
    const [churches, setChurches] = useState([]);
    const [editIndex, setEditIndex] = useState(-1);
    const [editedChurch, setEditedChurch] = useState({});
    const [initialChurchData, setInitialChurchData] = useState({});

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
        // Validation checks
        if (!editedChurch.name || !editedChurch.address || !editedChurch.ph_no) {
            alert('Name, address, and phone number are mandatory fields.');
            return;
        }
    
        update_church_data(editedChurch.id, editedChurch)
            .then(response => {
                console.log('Church data updated successfully:', response);
                setEditIndex(-1);
                setEditedChurch({});
                alert('Church data updated successfully');
                fetchChurchData();
            })
            .catch(error => {
                console.error('Error updating church data:', error);
            });
    };

    const handleCancel = () => {
        setEditIndex(-1);
        setEditedChurch({});
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
    };

    return (
        <div style={{ display: 'flex' }}>
            <AppSidebar style={{ width: '20%' }} />
            <div className="church-list" style={{ width: '80%', marginLeft: '15%' }}>
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
                                <td>
                                    {editIndex === index ? (
                                        <div>
                                            <button style={{ marginRight: '5px', backgroundColor: 'green', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }} onClick={handleSave}>Update</button>
                                            <button style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }} onClick={handleCancel}>Cancel</button>
                                        </div>
                                    ) : (
                                        <div>
                                            <button style={{ backgroundColor: 'blue', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }} onClick={() => handleEdit(index, church)}>Edit</button>
                                            <button style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', marginLeft: '5px' }} onClick={() => handleDelete(church.id)}>Delete</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ChurchList;
