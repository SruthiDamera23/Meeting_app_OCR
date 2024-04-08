import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { signup, addChurch as create_church, get_subscriptions } from '../../../api';

const Signup = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const history = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    churchName: '',
    address: '',
    ph_no: '',
    churchEmail: '',
    website: '',
    user_type: '2',
    subscription :'',
    church: 'new', // Default to creating a new church
  });

  useEffect(() => {
    get_subscriptions()
      .then(response => {
        setSubscriptions(response.data);
      })
      .catch(error => console.error('Error fetching subscriptions:', error));
  }, []);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [signupMessage, setSignupMessage] = useState('');

  const handleChange = event => {
    const { name, value } = event.target;

    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setIsLoading(true);

    try {
      let churchId;
      if (formData.church === 'new') {
        const newChurchData = await create_church({
          name: formData.churchName,
          address: formData.address,
          ph_no: formData.ph_no,
          email: formData.churchEmail,
          website: formData.website,
          subscription: formData.subscription
        });
        churchId = newChurchData.data.id;
      } else {
        churchId = formData.church;
      }

      const userData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        church: churchId,
        subscription: formData.subscription,
        user_type: formData.user_type,
      };

      await signup(userData);
      setIsSubmitted(true);
      setSignupMessage(
        "Your request is being processed. You'll receive confirmation once approved"
      );
      history('/');
    } catch (error) {
      console.error('Signup error:', error);
      setSignupMessage('Signup failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="center-fullscreen">
      <Card className="vertical-card">
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="first_name">First name</Label>
              <Input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter your first name"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="last_name">Last name</Label>
              <Input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter your last name"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="subscription">Subscription</Label>
              <Input
                type="select"
                id="subscription"
                name="subscription"
                value={formData.subscription}
                onChange={handleChange}
                required
              >
                <option value="">Select Subscription</option>
                {subscriptions.map(subscription => (
                  <option key={subscription.id} value={subscription.id}>
                    {subscription.name}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="churchName">Church Name</Label>
              <Input
                type="text"
                id="churchName"
                name="churchName"
                value={formData.churchName}
                onChange={handleChange}
                placeholder="Enter church name"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="address">Address</Label>
              <Input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter church address"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="ph_no">Phone Number</Label>
              <Input
                type="text"
                id="ph_no"
                name="ph_no"
                value={formData.ph_no}
                onChange={handleChange}
                placeholder="Enter church phone number"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="churchEmail">Church Email</Label>
              <Input
                type="email"
                id="churchEmail"
                name="churchEmail"
                value={formData.churchEmail}
                onChange={handleChange}
                placeholder="Enter church email"
              />
            </FormGroup>
            <FormGroup>
              <Label for="website">Website</Label>
              <Input
                type="text"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="Enter church website"
              />
            </FormGroup>
            <Button type="submit" color="success" disabled={isLoading}>
              Sign up
            </Button>
          </Form>
          {isSubmitted && <p>{signupMessage}</p>}
        </CardBody>
      </Card>
    </div>
  );
};

export default Signup;
