import {
    React,
    useState
  } from "react";
  import {
    Row
  } from "reactstrap";
  import { Container, Title, Card, Button, NavLink, Text } from "@mantine/core";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import moment from 'moment';
import EditTaskModal from "../../../components/modals/EditTaskModal";
import DeleteTaskModal from "../../../components/modals/DeleteTaskModal";
import InformationModal from "../../../components/modals/InformationModal";

const TaskCard = (props) => {

    const [showIconButtons, setShowIconButtons] = useState(false);
    const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
    const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
    const [isInformationModalOpen, setIsInformationModalOpen] = useState(false);
    const [taskId, setTaskId] = useState();

    const toggleEditTaskModal = () => {
        setShowIconButtons(false);
        setIsInformationModalOpen(false);
        setIsEditTaskModalOpen(!isEditTaskModalOpen);
        props.setMustGetTasks(!props.mustGetTasks);
      };

      const toggleDeleteTaskModal = () => {
        setShowIconButtons(false);
        setIsInformationModalOpen(false);
        setIsDeleteTaskModalOpen(!isDeleteTaskModalOpen);
        props.setMustGetTasks(!props.mustGetTasks);

      };

      const toggleInformationModal = () => {
        setTaskId(props.task.task_id);
        setShowIconButtons(false);
        setIsInformationModalOpen(!isInformationModalOpen);
      };

      const onCardClick = () => {
        setTaskId(props.task.task_id);
        toggleInformationModal();
      }

      const onEditClick = () => {
        console.log(`Editing row ${props.task.task_id}`);
        setTaskId(props.task.task_id);
        toggleEditTaskModal(props.task);
      };

      const onDeleteClick = () => {
        setTaskId(props.task.task_id);
        toggleDeleteTaskModal();
      };

      return (
        <
            Card className="outer-card card-margin"
            onClick = {onCardClick}
            onMouseEnter = {() => setShowIconButtons(true)}
            onMouseLeave = {() => setShowIconButtons(false)}
        >
          <
              InformationModal
              id = {taskId}
              edit_task ={EditTaskModal}
              task = {props.task}
              isOpen={
                  isInformationModalOpen &&
                  !isEditTaskModalOpen &&
                  !isDeleteTaskModalOpen
              }
              toggle={toggleInformationModal}
          />

          <
              EditTaskModal
              id = {props.task}
              isOpen={isEditTaskModalOpen}
              toggle={toggleEditTaskModal}

          />

          <
              DeleteTaskModal
              id = {props.task}
              //task = {props.task}
              isOpen={isDeleteTaskModalOpen}
              toggle={toggleDeleteTaskModal}
              // setMustGetTasks={props.setMustGetTasks}
          />
          <Card.Section>
            <Card className="outer-card meeting-card" style={{padding:"30px"}}>
              <Card.Section Style={{padding:"30px",overflow:"auto"}}>
                <Title>
                  <Row style={{padding:"15px"}}>
                    <Text>
                    &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
                    {props.task.task_name}

                  <IconButton  style={{float:'right'}} size="small" onClick={onDeleteClick}>
                    <DeleteIcon/>
                  </IconButton>
                  <IconButton style={{float:'right'}} size="small" onClick={onEditClick}>
                    <EditIcon />
                  </IconButton>

                    </Text>
                  </Row >
                </Title>
              </Card.Section>

              <div className="my-card-body"  Style={{overflow:"auto"}}>
                <Row style={{padding:"15px"}}>
                  <Text>
                    <small>
                      {props.task.end_date}
                    </small>
                  </Text>
                </Row>
              </div>
            </Card>
          </Card.Section>
        </Card>
      )
}

export default TaskCard;

