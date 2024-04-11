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
import {  delete_user, signup, update_user, get_church_data, getCookie, isSuperUser, subscription_view,get_users } from '../../../src/api';
import AppSidebar from "../../components/appSidebar";

const Subscribers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [churchData, setChurchData] = useState([]);
  
  useEffect(() => {
    get_church_data()
    .then((response) => {
        Promise.all(response.data.map(church => {
            return Promise.all([
                subscription_view(church.subscription),
                get_users(church.id)
            ])
            .then(([subscriptionRes, usersRes]) => ({
                address: church.address,
                church_email: church.address,
                church_id: church.id,
                church_name: church.name,
                church_ph_no: church.ph_no,
                subscription: church.subscription,
                website: church.website,
                count: subscriptionRes.data[0].count,
                subscription_name: subscriptionRes.data[0].name,
                admin_name: usersRes.data[0].first_name + " " + usersRes.data[0].last_name,
                admin_email: usersRes.data[0].email,
                existin_user_count:usersRes.data.length-1
            }));
        }))
        .then(churches => {
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

 
  return (
    <div style={{ display: "flex" }}>
      <AppSidebar />
      <Container className="my-4">
        <Card className="my-card schedule-card">
          <div className="full-screen-calendar">
          <div style={{ textAlign: 'center' }}>
        </div>
        {isLoading &&<p>Loading...</p>}
            {!isLoading  &&(
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
                    </tr>
                  </thead>
                  <tbody>
                    {churchData.map((church) => (
                      <tr>
                        <td style={{ padding: '8px' }}>{church.church_name}</td>
                        <td style={{ padding: '8px' }}>{church.admin_name}</td>
                        <td style={{ padding: '8px' }}>{church.subscription_name}</td>
                        <td style={{ padding: '8px' }}>{church.existin_user_count}</td>
                        <td style={{ padding: '8px' }}>{church.count}</td>
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

export default Subscribers;




