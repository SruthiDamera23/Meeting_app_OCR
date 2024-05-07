import {
  React,
  useState,
  useRef
} from "react";
import {
  CardText,
  Row,
  Col
} from "reactstrap";

import { Container,Card, Title, Button, NavLink, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { meeting_create } from '../../../api';
import DeleteMeetingModal from '../../../components/modals/DeleteMeetingModal';

/*
 * MeetingCard for displaying key details of a meeting -
 * "Schedule" page displays MeetingCards.
 */
const MeetingCard = (props) => {
  const [isMeetingMenuOpen, setIsMeetingMenuOpen] = useState(false);
  const [isDeleteMeetingModalOpen, setIsDeleteMeetingModalOpen] = useState(false);

  const anchorRef = useRef(null);
  const navigate = useNavigate();

  const viewMeeting = () => {
    navigate(
      "/schedule/meeting",
      {
        state: {
          meeting: props.meeting,
          clearForm: false
        }
      }
    );
  }

  const duplicateMeeting = () => {
    const meeting = {
      name: props.meeting.name,
      type: props.meeting.type,
      date: props.meeting.date,
      time: props.meeting.time,
      attendees: props.meeting.attendees,
      agenda: props.meeting.agenda,
      notes: props.meeting.notes,
      meeting_tasks: props.meeting.meeting_tasks
    };

    meeting_create(meeting)
      .then(() => {
        props.setMustGetMeetings(true);
      })
      .catch((error) => {
        console.error("Error creating meeting:", error);
      });
  }

  const toggleDeleteMeetingModal = () => {
    setIsDeleteMeetingModalOpen(!isDeleteMeetingModalOpen);
    props.setMustGetMeetings(true);
  }

  const toggleMeetingMenu = () => {
    setIsMeetingMenuOpen(!isMeetingMenuOpen);
  }

  const handleMeetingMenuClose = (e) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(e.target)
    ) {
      return;
    }

    setIsMeetingMenuOpen(false);
  };

  const formatDate = () => {
    const year = props.meeting.date.substring(0, 4);
    const month = Number(props.meeting.date.substring(5, 7));
    let day = props.meeting.date.substring(8);

    if (day[0] === "0") {
      day = day[1];
    }

    const monthStrs = [
      "Jan.",
      "Feb.",
      "Mar.",
      "Apr.",
      "May",
      "June",
      "July",
      "Aug.",
      "Sep.",
      "Oct.",
      "Nov.",
      "Dec."
    ];

    return monthStrs[month - 1] + " " + day + ", " + year;
  }

  const formatTime = () => {
    let hour = Number(props.meeting.time.substring(0, 2));
    const minute = (props.meeting.time.substring(3, 5));

    const isAm = hour < 12;
    const amPm = isAm ? "AM" : "PM";

    hour = hour % 12;

    if (hour === 0) {
      hour = 12;
    }

    return String(hour) + ":" + minute + " " + amPm;
  }

  return (
    <
      Card className="outer-card card-margin"
      onClick={toggleMeetingMenu}
    >
      <DeleteMeetingModal
        meeting={props.meeting}
        isOpen={isDeleteMeetingModalOpen}
        toggle={toggleDeleteMeetingModal}
      />
      <div>
        <div ref={anchorRef} />
        <div style={{minHeight: "32vh"}}>
          <Card className="outer-card meeting-card card-body">
            <Card.Section style={{  overflow: "auto"}}>
              <Title>
                <Row >
                  <Col>
                    <Text style={{padding:"20px",margin:"5px"}}>
                      <small>
                        {formatDate()}
                        <br />
                        {formatTime()}
                      </small>
                    </Text>
                  </Col>
                  <Col>
                  <Text style={{padding:"20px"}}>
                      {props.meeting.name}
                    </Text>
                  </Col>
                </Row>
              </Title>
            </Card.Section>
            <Card.Section className="my-card-body" style={{  overflow: "auto"}}>
              <div>
                <Popper
                  open={isMeetingMenuOpen}
                  anchorEl={anchorRef.current}
                  placement="bottom"
                  transition
                  disablePortal
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={handleMeetingMenuClose}>
                          <Container>
                            <MenuList>
                              <MenuItem onClick={viewMeeting}>View/Edit</MenuItem>
                              <MenuItem onClick={duplicateMeeting}>Duplicate</MenuItem>
                              <MenuItem onClick={toggleDeleteMeetingModal}>Delete</MenuItem>
                            </MenuList>
                          </Container>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </div>
              <Row>
                <Col>
                <Text style={{padding:"20px"}}>
                    <small>
                      {props.meeting.agenda}
                    </small>
                  </Text>
                </Col>
                <Col>
                <Text style={{padding:"20px"}}>
                    <small>
                      Invited: {props.meeting.attendees.length}
                    </small>
                  </Text>
                </Col>
              </Row>
            </Card.Section>
          </Card>
        </div>
      </div>
    </Card>
  )
}

export default MeetingCard;

