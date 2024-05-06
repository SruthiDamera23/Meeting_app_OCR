/**
 * This component is the edit task modal of the application. It contains form to edit a task.
 * 
 * @params: {props}
 * 
 * 
 */

import React, { useState, useEffect } from "react";
import {

  Form,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Container, Title, Card, Button, NavLink, Text, TextInput, Switch } from "@mantine/core";
import { tasks_create, task_view, tasks_update } from "../../api";
import { idID } from "@mui/material/locale";

const EditTaskModal = ({ isOpen, toggle, id }) => {
  const [task, getTask] = useState("");
  const [task_name, settask_name] = useState("");
  const [task_description, settask_description] = useState("");
  const [employee_name, setemployee_name] = useState("");
  const [start_date, setstart_date] = useState("");
  const [end_date, setend_date] = useState("");
  const [is_completed, setIsCompleted] = useState();
  const [meetingId, setMeetingId] = useState();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [formData, setFormData] = useState(

    {
      task_name: '',
      task_description: '',
      employee_name: '',
      start_date: '',
      end_date: '',
      priority: '',
      meeting_id: '',
      is_completed: '',
    }
  )


  useEffect(() => {
    console.log("Data data data", id);
    viewSingleTask();
  }, []);

  const [errors, setErrors] = useState({});


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '' // Clear any previous error for the changed input
    }));
  };
  // Handle changes to the priority dropdown
  const handlePriorityChange = (e) => {
    const selectedPriority = e.target.value;
    
    setFormData((prevFormData) => ({
      ...prevFormData,
      priority: selectedPriority
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      priority: '' // Clear any previous error for the changed input
    }));
  };
  

  const viewSingleTask = () => {
    
    // task_view(id)
    //   .then((req) => {
        // console.log(req);
        // const task = req.data;
        // console.log("Initial State: " + task.is_completed);
        // console.log("task");
        // console.log(task);
        // settask_name(task.task_name);
        // setemployee_name(task.employee_name);
        // setstart_date(task.start_date);
        // setend_date(task.end_date);
        // setPriority(task.priority);
        // settask_description(task.task_description);
        // setIsCompleted(task.is_completed);
        // setMeetingId(task.meeting_id);

        

      
        setFormData({
          task_id: id.task_id,
          task_name: id.task_name,
          task_description: id.task_description,
          employee_name: id.employee_name,
          start_date: id.start_date,
          end_date: id.end_date,
          priority: id.priority,
          meeting_id: id.meeting_id,
          is_completed: id.is_completed,
          created_by:id.created_by,
          church:id.church,
          is_delete:id.is_delete,
          meetings:id.meetings
        });

      // })
      // .catch((error) => {
      //   console.log(error);
      // });
  };

  // Toggle the dropdown state
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleIsCompleted = (event) => {
    const completeValue=event.target.value;
    // console.log("Before Toggle " + is_completed);
    // // setIsCompleted(!isCompleted);
    // setIsCompleted(!is_completed);
    // console.log("After Toggle " + is_completed);

    setFormData((prevFormData) => ({
      ...prevFormData,
      is_completed: !prevFormData.is_completed
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      is_completed: '' // Clear any previous error for the changed input
    }));
  };



  const handleSubmit = async(event) => {
    event.preventDefault();
    console.log("formData:")
    console.log(formData)
    const response = await tasks_update( formData.task_id, formData)
      .catch((error) => {
        console.error("Error updating tasks: ", error);
      })
      console.log(response.data.message);
      toggle();
  };


  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Edit Task</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <FormGroup>
            <Label for="task_name">Task Name</Label>
            <TextInput
              type="text"
              name="task_name"
              id="task_name"
              value={formData.task_name}
              // onChange={(event) => settask_name(event.target.value)}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="task_description">Task Description</Label>
            <TextInput
              type="textarea"
              name="task_description"
              id="task_description"
              placeholder="Enter task description"
              value={formData.task_description}
              // onChange={(event) => settask_description(event.target.value)}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="employee_name">Employee Name</Label>
            <TextInput
              type="text"
              name="employee_name"
              id="employee_name"
              value={formData.employee_name}
              onChange={handleChange}
              // onChange={(event) => setemployee_name(event.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="start_date">Start Date</Label>
            <TextInput
              type="date"
              name="start_date"
              id="start_date"
              value={formData.start_date}
              onChange={handleChange}
              // onChange={(event) => setstart_date(event.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="end_date">End Date</Label>
            <TextInput
              type="date"
              name="end_date"
              id="end_date"
              value={formData.end_date}
              onChange={handleChange}
              // onChange={(event) => setend_date(event.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="end_date">Is completed</Label>
            <Switch
              onChange={handleIsCompleted}
              label="Completed"
              checked={formData.is_completed}
            />
          </FormGroup>
          <FormGroup>
            <Label for="taskPriority">Task Priority</Label>
            <Dropdown isOpen={dropdownOpen} value={formData.priority} toggle={toggleDropdown} >
              <DropdownToggle caret>
                {formData.priority ? formData.priority : "Select priority"}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem value="low" onClick={handlePriorityChange}>
                  Low
                </DropdownItem>
                <DropdownItem value="medium" onClick={handlePriorityChange}>
                  Medium
                </DropdownItem>
                <DropdownItem value="high" onClick={handlePriorityChange}>
                  High
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button variant="filled" color="rgba(90, 211, 250, 1)" type="submit">
            Save Task
          </Button>{" "}
          <Button  variant="filled" color="rgba(214, 66, 66, 1)"onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default EditTaskModal;