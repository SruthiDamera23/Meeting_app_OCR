/**
 * This component is the signup page of the application. It contains a form which is used to signup a user.
 *
 * @params: {props}
 *
 *
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { signup_approve, get_church_data } from '../../../api';
import { FaUserAlt, FaLock } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";





const Signup = () => {
  const [churchData,setChurchData]=useState([]);
  const history = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    church: "1",
    user_type: "1",
    
    errors: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });


  useEffect(()=>{
      get_church_data().then( response => {
      let tcd = [];
        for(let i=0;i<response.data.length;i++) {
        tcd.push([response.data[i].id, response.data[i].name]);
      }
      setChurchData(tcd);
      console.log(tcd);
      })
  },[])

  const [isSubmitted, setIsSubmitted] = useState("");
  const [signupMessage, setSignupMessage] = useState("");

  const initialFormData = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  };

  const validateForm = () => {
    const { first_name, last_name, email, password } = formData;
    const errors = {};
    console.log(first_name, last_name, email, password);

    // Check for errors and update the errors object accordingly
    if (!first_name) {
      errors.first_name = "First name is required.";
    }

    if (!last_name) {
      errors.last_name = "Last name is required.";
    }

    if (!email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Invalid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }

    return errors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      errors: {
        ...prevState.errors,
        [name]: "",
      },
    }));
  };

  const handleSubmit = (event) => {
    console.log(formData);
    event.preventDefault();
    setIsLoading(true); 

    // const errors = validateForm();
    // if (Object.keys(errors).length > 0) {
    //   setFormData((prevState) => ({
    //     ...prevState,
    //     errors: { ...errors },
    //   }));
    //   console.log(FormData.errors);
    //   return;
    // }

    signup_approve(formData)
      .then((response) => {
        console.log(response);
        console.log(response.data);
        setFormData(initialFormData);
        setIsSubmitted(true);
        setSignupMessage(alert("Your request is being processed. You'll receive confirmation once approved"));
        history('/');
      })
      .catch((error) => {
        console.log(error.response.data);
        // setError(error.response.data);
        setSignupMessage("Signup failed.");
      });
  };


  return (
    <div className="center-fullscreen">
      <Card className="vertical-card">
        <CardBody>
          <Card className="my-card">
            <CardBody className="my-card-body">
              <Form onSubmit={handleSubmit}>
                <Card className="my-card">
                  <CardBody className="my-card-body">
                    <Row>
                      <FormGroup>
                        <Label for="First Name" className="form-label">
                          First name
                        </Label>
                        <Input
                          type="text"
                          id="first_name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          placeholder="Enter your first name"
                          invalid={!!formData.errors.first_name}
                        />
                        {formData.errors.first_name && <div className="invalid-feedback">{formData.errors.first_name}</div>}
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup>
                        <Label for="username" className="form-label">
                          Last name
                        </Label>
                        <Input
                          type="text"
                          id="last_name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          placeholder="Enter your last name"
                          invalid={!!formData.errors.last_name}
                        />
                        {formData.errors.last_name && <div className="invalid-feedback">{formData.errors.last_name}</div>}
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup>
                        <Label for="username" className="form-label">
                          Email
                        </Label>
                        {/* <FaUserAlt className="mr-2" /> */}
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          invalid={!!formData.errors.last_name}
                          />
                          {formData.errors.email && <div className="invalid-feedback">{formData.errors.email}</div>}
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup>
                        <Label for="password" className="form-label">
                          {/* <FaLock className="mr-2" />  */}
                          Password
                        </Label>
                        <Input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                          invalid={!!formData.errors.last_name}
                          />
                          {formData.errors.password && <div className="invalid-feedback">{formData.errors.password}</div>}
                      </FormGroup>
                      <Row>
  <FormGroup>
    <Label for="user_type" className="form-label">
      User Type
    </Label>
    <Input
      type="select"
      id="user_type"
      name="user_type"
      value={formData.user_type}
      onChange={handleChange}
    >
      <option value="1">Superuser</option>
      <option value="2">Admin</option>
      <option value="3">Leader</option>
    </Input>
  </FormGroup>
  <Row>
  <FormGroup>
    <Label for="church" className="form-label">
      Church Name
    </Label>
    <Input
      type="select"
      id="church"
      name="church"
      value={formData.church}
      onChange={handleChange}
    >
    {churchData.map((item) => (
  <option key={item[0]} value={item[0]}>{item[1]}</option>
))}
      
    </Input>
  </FormGroup>
</Row>
</Row>
                      <div className="mt-2">
                        <a className="link-text" href="/">
                          Back to login
                        </a>
                      </div>
                    </Row>
                    <Row>
                    <div style={{display: "flex", justifyContent: "center"}}>
                      <Card className="outer-card">
                        <CardBody>
                          <Button type="submit" color="success" onClick={handleSubmit}>
                            Sign up
                          </Button>
                        </CardBody>
                      </Card>
                    </div>
                    </Row>
                  </CardBody>
                </Card>
              </Form>
            </CardBody>
          </Card>
          {isSubmitted && <p>{signupMessage}</p>}
        </CardBody>
      </Card>
    </div>
  );
};

export default Signup;
