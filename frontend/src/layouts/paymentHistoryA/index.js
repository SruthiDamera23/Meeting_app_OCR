import React, { useEffect, useState } from "react";
import { Container, Card, Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { get_all_payments, getCookie } from '../../../src/api';
import AppSidebar from "../../components/appSidebar";

const PaymentHistory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [showCardDetailsModal, setShowCardDetailsModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const churchId = getCookie("church");

  useEffect(() => {
    get_all_payments()
      .then((response) => {
        const filteredPayments = response.data.payments.filter(payment => payment.church_id === parseInt(churchId));
        filteredPayments.sort((a, b) => new Date(b.date) - new Date(a.date));
        setPayments(filteredPayments);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching payments:', error);
      });
  }, [churchId]);

  const toggleCardDetailsModal = () => {
    setShowCardDetailsModal(!showCardDetailsModal);
  };

  const formatDateTime = (dateTimeString) => {
    const optionsDate = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const optionsTime = {
      hour: 'numeric', 
      minute: 'numeric', 
      second: 'numeric',
      hour12: true 
    };
    const formattedDate = new Date(dateTimeString).toLocaleString(undefined, optionsDate);
    const formattedTime = new Date(dateTimeString).toLocaleString(undefined, optionsTime);
    return [formattedDate,formattedTime];
  };

  const handlePaymentSelect = (payment) => {
    setSelectedPayment(payment);
    toggleCardDetailsModal();
  };

  return (
    <div style={{ display: "flex" }}>
      <AppSidebar />
      <Container className="my-4">
        <Card className="my-card schedule-card">
          <div className="full-screen-calendar">
            {isLoading && <p>Loading...</p>}
            {!isLoading && payments.length === 0 && <p>No payments found.</p>}
            {!isLoading && payments.length > 0 && (
              <div>
                <h3>Payment History</h3>
                <br></br>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ width: "10%" }}>Payment ID</th>
                      <th style={{ width: "15%" }}>Church Name</th>
                      <th style={{ width: "15%" }}>Email</th>
                      <th style={{ width: "15%" }}>Date</th>
                      <th style={{ width: "15%" }}>Amount</th>
                      <th style={{ width: "10%" }}>Transaction Status</th>
                      <th style={{ width: "20%" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment, index) => (
                      <tr key={index}>
                        <td>{payment.payment_id}</td>
                        <td>{payment.church_name}</td>
                        <td>{payment.email}</td>
                        <td>{formatDateTime(payment.date)}</td>
                        <td>{payment.amount}</td>
                        <td>{payment.is_success ? 'Success' : 'Failed'}</td>
                        <td>
                          <Button color="primary" onClick={() => handlePaymentSelect(payment)}>Show Card Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </Container>

      {/* Card Details Modal */}
      <Modal isOpen={showCardDetailsModal} toggle={toggleCardDetailsModal}>
        <ModalHeader toggle={toggleCardDetailsModal}>Card Details</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Card Type</Label>
              <Input type="text" value={selectedPayment ? selectedPayment.brand : ''} readOnly />
            </FormGroup>
            <FormGroup>
              <Label>Last 4 Digits</Label>
              <Input type="text" value={selectedPayment ? "**** **** **** " + selectedPayment.last4 : ''} readOnly />
            </FormGroup>
            <FormGroup>
              <Label>Expiration Date</Label>
              <Input type="text" value={selectedPayment ? `${selectedPayment.exp_month}/${selectedPayment.exp_year}` : ''} readOnly />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleCardDetailsModal}>Close</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default PaymentHistory;
