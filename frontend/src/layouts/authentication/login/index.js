/**
 * This component is the landing page of the application. It contains a form which is used to login a user.
 *
 * @params: {props}
 *
 *
 */
import React, { useState, useEffect} from "react";
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
import { FaUserAlt, FaLock } from "react-icons/fa";
import { login, getCookie } from "../../../api";
import "bootstrap/dist/css/bootstrap.min.css";

function Login(props) {

  useEffect(()=>{
    
    console.log(document.cookie);
    if(getCookie("user")!="" && getCookie("priv")!="") {
      console.log("not here");
      navigate('/dashboard');
    } 
  },[])
  const navigate = useNavigate();
  
  const handleSignUp = () => {
    navigate("/pricing_plan");
  };

  const history = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    priv: null, // Initialize priv state
    errors: {
      username: "",
      password: "",
      invalid:""
    },
  });

  const [error, setError] = useState(null);
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

  const validateForm = () => {
    const { username, password } = formData;
    const errors = {};

    // Check for errors and update the errors object accordingly
    if (!username) {
      errors.username = "Username is required.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    return errors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormData((prevState) => ({
        ...prevState,
        errors: { ...errors },
      }));
      return;
    }
   
    login(formData).then(response => {
      console.log(response.data)
      // Update formData state with priv value from response
      setFormData((prevState) => ({
        ...prevState,
        priv: response.data.priv
      }));

      document.cookie="user="+response.data.user;
      
      document.cookie="priv="+response.data.priv;
      document.cookie="church="+response.data.church;
     document.cookie="user-id="+response.data.user_id;
      console.log(document.cookie,"cokkiesss");
      console.log(response.data);
      navigate('/dashboard');
      })
      .catch((error) => {
        const errors = {};
        errors.invalid = error.response.data.message; 
        setFormData((prevState) => ({
          ...prevState,
          errors: { ...errors },
        }));
        setError(error.response.data.message);
        console.log(formData.errors.invalid);
      });
  };

  return (
    <div className="center-fullscreen">
      <Card className="vertical-card">
        <CardBody>
          <Card className="my-card">
            <CardBody className="my-card-body">
              <Form>
                <Card className="my-card">
                  <CardBody className="my-card-body">
                  {formData.errors.invalid && <div className="form-error">{formData.errors.invalid}</div>}
                    <Row>
            
                    
                      <FormGroup>
                      
                        <Label for="username" className="form-label">
                          Username
                        </Label>
                        {/* <FaUserAlt className="mr-2" /> */}
                        <Input
                          type="text"
                          className="form-input"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="Enter your username"
                          invalid={!!formData.errors.username}
                        />
                        
                        {formData.errors.username && <div >{formData.errors.username}</div>}
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
                          className="form-input"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                          invalid={!!formData.errors.password}
                        />
                        {formData.errors.password && <div className="invalid-feedback">{formData.errors.password}</div>}
                        <div className="text-right mt-2">
                          <a className="link-text" href="/forgot-password">
                            Forgot password?
                          </a>
                        </div>
                      </FormGroup>
                    </Row>
                  </CardBody>
                </Card>
              </Form>
              <Row>
                <div>
                  <Card className="outer-card">
                    <CardBody>
                      <Button className="my-button" color="success" onClick={handleSubmit}>
                        Sign In
                      </Button>{" "}
                      {< Button className="my-button" color="success" onClick={handleSignUp}>
                        Subscribe
  </Button>}
                    </CardBody>
                  </Card>
                </div>
              </Row>
            </CardBody>
          </Card>
        </CardBody>
      </Card>
    </div>
  );
}

export default Login;