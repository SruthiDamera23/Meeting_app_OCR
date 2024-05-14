/**
 * This component is the dashboard page of the application.
 * @params: {props}
 */
import React, { useEffect, useState } from "react";
import '@mantine/core/styles.css';
import {
  Row,
  Col,
  Container
} from "reactstrap";

import { Title, Card, Button, NavLink, Text } from "@mantine/core";


import CircularProgress from '@mui/material/CircularProgress';
import { PieChart, pieChartDefaultProps } from "react-minimal-pie-chart";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { logout, meeting_view, tasks_view } from "../../api";
import DateAndTodoList from "./components/DateAndTodoList";
import TaskTable from "../taskAssignment/components/TaskTable";
import AppSidebar from "../../components/appSidebar";
import { ArrowDownward } from '@mui/icons-material';
import { login, getCookie, updateCookie } from "../../api";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Pie } from 'react-chartjs-2';

const Dashboard = () => {
  const navigate = useNavigate();
  const [priv, setPriv] = useState(null); // State to store priv use
  const [tasks, setTasks] = useState("");
  const [AllTasks, setAllTasks] = useState("");
  const [allMeetings, setAllMeetings] = useState();
  const [meeting, setMeetings] = useState("");

  const [activeTasks, setActiveTasks] = useState("");
  const [weekTasks, setWeekTasks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);
  const [showButton, setShowButton] = useState(true);
  const defaultLabelStyle = {
    fontSize: "5px",
    fontFamily: "sans-serif",
  };

  useEffect(() => {
    if(getCookie("user")==null && getCookie("priv")==null) {
      updateCookie("user","");
      updateCookie("priv","");
    }
  
  console.log(document.cookie);
  if (getCookie("user") == "" && getCookie("priv") == "") {
      navigate('/');
  }

    // Get priv user from cookies or wherever you're storing it
    const privUser = getCookie("priv");
    setPriv(privUser);
    

    const timeout = setTimeout(() => {
      viewAllMeeting();
      viewAllTasks();
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);


  const viewAllMeeting = async () => {
    const response =
      await meeting_view()
      .catch((error) => {
        console.log(error)
      });
      setAllMeetings(response.data);
    const privilege=getCookie("priv");
    if(privilege ==1){
      let wantedMeetingData=response.data;
    setMeetings(wantedMeetingData)
      

    } else if(privilege ==2){
      const church =getCookie("church");
      let wantedMeetingData=[];
      let tempMeetingsData=response.data;
      for (let i = 0; i < tempMeetingsData.length; i++) {
        if (tempMeetingsData[i].church+"" === church) {
            wantedMeetingData.push(tempMeetingsData[i]);
        }
    } 
    setMeetings(wantedMeetingData)
    }else if(privilege ==3){
      const church =getCookie("church");
      const id =getCookie("user-id");
      let wantedMeetingData=[];
      let tempMeetingsData=response.data;
      for (let i = 0; i < tempMeetingsData.length; i++) {
        if (tempMeetingsData[i].created_by+"" === id+"") {
            wantedMeetingData.push(tempMeetingsData[i]);
        }
    } 
    setMeetings(wantedMeetingData)
    }

    setIsLoading2(false);
  }

  const viewAllTasks = async () => {
    const response =
      await tasks_view()
      .catch((error) => {
        console.log(error)
      });
      
      console.log(response.data.results);
      setAllTasks(response.data.results);
      
    const privilege=getCookie("priv");
    if(privilege ==1){
     
    
      let wantedTaskData=response.data.results; 
    setTasks(wantedTaskData)
    setActiveTasks(wantedTaskData.length);
      
  
    } else if(privilege ==2){
      const church =getCookie("church");
      let wantedTaskData=[];
      let tempTasksData=response.data.results;
      for (let i = 0; i < tempTasksData.length; i++) {
        if (tempTasksData[i].church+"" === church) {
          wantedTaskData.push(tempTasksData[i]);
        }
    } 
    setTasks(wantedTaskData)
    setActiveTasks(wantedTaskData.length);
    }else if(privilege ==3){
      const church =getCookie("church");
      const id =getCookie("user-id");
      let wantedTaskData=[];
      let tempTasksData=response.data.results;
      for (let i = 0; i < tempTasksData.length; i++) {
        if (tempTasksData[i].created_by+"" === id+"") {
          wantedTaskData.push(tempTasksData[i]);
        }
    } 
    setTasks(wantedTaskData)
    setActiveTasks(wantedTaskData.length);
    }

    
          
          setIsLoading(false);
          for (var i = 0; i < tasks.length; i++) {
            const today = new Date();
            const date = today.getDate();
            const taskDate = Number(tasks[i].end_date.substring(8));
            const dateDiff = taskDate - date;
            if (dateDiff >= 0 && dateDiff <= 7) {
              setWeekTasks(weekTasks + 1);
            }
          }
          for (var i = 0; i < tasks.length; i++) {
            console.log(tasks[i].end_date);
          }
          console.log(tasks);
          console.log(tasks.length);
          setIsLoading(false);

          /*
           * This loop is hacky logic for calculating the number
           * of "Tasks due this week". In reality, it calculates
           * the number of tasks due in the next 7 days, unless
           * the month ends in 7 days or less, in which case it
           * calculates the number of tasks due before the end
           * of the month. It was quickly added as a lesser of
           * two evils, to replace a hard-coded dummy value which
           * had been being rendered in its place.
           */
          for (var i = 0; i < tasks.length; i++) {
            const today = new Date();
            const date = today.getDate();
            const taskDate = Number(tasks[i].end_date.substring(8));
            const dateDiff = taskDate - date;
            if (dateDiff >= 0 && dateDiff <= 7) {
              setWeekTasks(weekTasks + 1);
            }
          }
          for (var i = 0; i < tasks.length; i++) {
            console.log(tasks[i].end_date);
          }
          console.log(tasks);
          console.log(tasks.length);
  }
  var completed = Array.isArray(tasks) ? tasks.filter(function (el) {
    return el.is_completed === true;
  }) : [];

  var inProgress = Array.isArray(tasks) ? tasks.filter(function (el) {
    var current_date = new Date();
    var task_date = new Date(el.start_date);
    return task_date <= current_date;
  }) : [];

  var meetingProgress = Array.isArray(meeting) ? meeting.filter(function (el) {
    var current_date = new Date();
    var task_date = new Date(el.date);
    return task_date >= current_date;
  }) : [];

  var notYetStarted = Array.isArray(tasks) ? tasks.filter(function (el) {
    var current_date = new Date();
    var task_date = new Date(el.start_date);
    return task_date >= current_date;
  }) : [];

  var completed_length = completed === NaN ? 0 : completed.length;

  var inProgress_length = inProgress === NaN ? 0 : inProgress.length;

  var meetingProgress_length = meetingProgress === NaN ? 0 : meetingProgress.length;

  var notYetStarted_length = notYetStarted === NaN ? 0 : notYetStarted.length;

  const shiftSize = 7;

  const handleLogout = async () => {
    logout()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
    setShowButton(false);
  };

  return (
    <div style={{display: 'flex'}}>
      {isLoading ? (<CircularProgress className="circular-progress" />) :
        (
          <div>

            <AppSidebar />
            <Container style={{position: "relative", left: "15%"}} className="my-4">
              <Card className="my-card schedule-card">
              {showButton && (<Button className="scrollButton" color="primary" onClick={scrollToBottom}><ArrowDownward /></Button>)}
              <div className="ml-auto p-2 card-head-small">
              {priv && (
    <h1 style={{ fontSize: "20px" }}>
      {priv === "1" ? "Logged in as Superuser!!" : priv === "2" ? "Logged in as Admin!!" : priv === "3" ? "Logged in as Leader!!" : "Unknown Privilege"}
    </h1>
  )}
        </div>
              <Row className="fixed-height-dashboard-upper-cards">
                <Col md={6}>
                  <Card className="my-card my-card-height">
                    <Title order={5} className="card-head p-3">
                      High Priority tasks
                    </Title>
                    <Text className="p-3 card-body">
                      {isLoading ? <CircularProgress /> : <TaskTable rows={tasks} dashboard={true} />}
                    </Text>
                  </Card>

                </Col>
                <Col md={6}>
                  {/* <Card className="my-card pie-chart-progress">
                        <CardTitle tag="h5" className="p-3 card-head">
                          Progress Chart
                        </CardTitle>
                        <CardText className="p-3 card-body">
                          <PieChart
                              data={[
                                { title: "Completed", value: completed_length, color: "#E38627" },
                                { title: "In Progress", value: inProgress_length, color: "#C13C37" },
                                { title: "Not yet Started", value: notYetStarted_length, color: "#6A2135" },
                              ]}
                              radius={pieChartDefaultProps.radius - shiftSize}
                              segmentsShift={(index) => (index === 0 ? shiftSize : 0.5)}
                              label={({ dataEntry }) => dataEntry.value}
                              style={{ height: "200px" }}
                              labelStyle={{ ...defaultLabelStyle }}
                          />
                        </CardText>
                      </Card> */}
                  <Row className="fixed-height-dashboard-upper-cards">
                    <Col md={6}>
                      <Card className="my-card middle-order-card">
                        <Title order={5} className="p-3 card-head-small">
                          Active Tasks
                        </Title>
                        {/* <CardText className="p-3 card-text-number card-body">{tasks.length}</CardText>*/}
                        <Text className="p-3 card-text-number card-body">{activeTasks}</Text>
                      </Card>
                    </Col>

                    <Col md={6}>
                      <Card className="my-card middle-order-card">
                      <Title order={5} className="p-3 card-head-small">
                          Tasks due this week
                        </Title>
                        <Text className="p-3 card-text-number card-body">
                          {weekTasks}
                        </Text>
                      </Card>
                    </Col>
                  </Row>

                  <Row className="fixed-height-dashboard-upper-cards">
                    <Col md={12}>

                      <Card className="my-card">
                        <Text className="p-3 card-body">
                          {isLoading2 ? <CircularProgress /> : <DateAndTodoList data={meetingProgress[0]} />}
                        </Text>
                      </Card>
                    </Col>
                  </Row>




                  {/* <Card className="my-card middle-order-card">
                    <CardTitle tag="h5" className="p-3 card-head-small">
                      Upcoming Meetings
                    </CardTitle>
                    {isLoading2 ? <CircularProgress /> : (<CardText className="p-3 card-text-number card-body">{meetingProgress_length}</CardText>
                    )}
                  </Card> */}

                </Col>
              </Row>
              </Card>
            </Container>
          </div>
        )}
    </div>
  );
};

export default Dashboard;





//
// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Card, CardTitle, CardText, Button } from "reactstrap";
// import CircularProgress from '@mui/material/CircularProgress';
// import { PieChart, pieChartDefaultProps } from "react-minimal-pie-chart";
// import { useNavigate } from "react-router-dom";
// import { logout, meeting_view, tasks_view } from "../../api";
// import DateAndTodoList from "./components/DateAndTodoList";
// import TaskTable from "../taskAssignment/component/TaskTable";
// import Header from "../../components/header";
// import { ArrowDownward } from '@mui/icons-material';
//
// const Dashboard = () => {
//     const navigate = useNavigate();
//     const [tasks, getTasks] = useState("");
//     const [meeting, getMeeting] = useState("");
//     const [activeTasks, setActiveTasks] = useState("");
//     const [isLoading, setIsLoading] = useState(true);
//     const [isLoading2, setIsLoading2] = useState(true);
//     const [showButton, setShowButton] = useState(true);
//     const [tasksDueThisWeek, setTasksDueThisWeek] = useState(0); // Initialize with 0 for Task due this week.
//
//     const defaultLabelStyle = {
//         fontSize: "5px",
//         fontFamily: "sans-serif",
//     };
//
//     useEffect(() => {
//         const viewAllTasks = async () => {
//             await tasks_view()
//                 .then((req) => {
//                     const allTasks = req.data.results;
//                     //
//                     // // Calculate the end date of the upcoming week
//                     // const current_date = new Date();
//                     // const endOfWeek = new Date();
//                     // endOfWeek.setDate(current_date.getDate() + 7);
//                     //
//                     // // Filter out completed tasks based on the end date
//                     // const activeTasks = allTasks.filter((task) => {
//                     //     const task_date = new Date(task.end_date);
//                     //     return task_date >= current_date && task_date <= endOfWeek;
//                     // });
//
//                     getTasks(activeTasks);
//                     setActiveTasks(activeTasks.length);
//                     setTasksDueThisWeek(getTasksDueThisWeekCount(activeTasks));
//                     setIsLoading(false);
//                 })
//                 .catch((error) => {
//                     console.log(error);
//                 });
//
//             function getTasksDueThisWeekCount(tasks) {
//                 // Your implementation for calculating the count of tasks due this week
//             }
//             const tasksDueThisWeekCount = getTasksDueThisWeekCount(tasks);
//
//         };
//
//         const viewAllMeeting = async () => {
//             await meeting_view()
//                 .then((req) => {
//                     const meeting = req.data.results;
//                     getMeeting(meeting);
//                     setIsLoading2(false);
//                 })
//                 .catch((error) => {
//                     console.log(error);
//                 });
//         };
//
//         const timeout = setTimeout(() => {
//             viewAllMeeting();
//             viewAllTasks();
//         }, 1000);
//
//         return () => clearTimeout(timeout);
//     }, []);
//
//     var completed = Array.isArray(tasks)
//         ? tasks.filter(function (el) {
//             return el.is_completed === true;
//         })
//         : [];
//
//     var inProgress = Array.isArray(tasks)
//         ? tasks.filter(function (el) {
//             var current_date = new Date();
//             var task_date = new Date(el.start_date);
//             return task_date <= current_date;
//         })
//         : [];
//
//     var meetingProgress = Array.isArray(meeting)
//         ? meeting.filter(function (el) {
//             var current_date = new Date();
//             var task_date = new Date(el.date);
//             return task_date >= current_date;
//         })
//         : [];
//
//     var notYetStarted = Array.isArray(tasks)
//         ? tasks.filter(function (el) {
//             var current_date = new Date();
//             var task_date = new Date(el.start_date);
//             return task_date >= current_date;
//         })
//         : [];
//
//     var completed_length = completed === NaN ? 0 : completed.length;
//
//     var inProgress_length = inProgress === NaN ? 0 : inProgress.length;
//
//     var notYetStarted_length = notYetStarted === NaN ? 0 : notYetStarted.length;
//
//     const shiftSize = 7;
//
//     const handleLogout = async () => {
//         logout()
//             .then(() => {
//                 navigate("/");
//             })
//             .catch((error) => {
//                 console.log(error.response.data);
//             });
//     };
//
//     const scrollToBottom = () => {
//         window.scrollTo({
//             top: document.documentElement.scrollHeight,
//             behavior: 'smooth',
//         });
//         setShowButton(false);
//     };
//
//     // Calculate the end date of the upcoming week
//     const current_date = new Date();
//     const endOfWeek = new Date();
//     endOfWeek.setDate(current_date.getDate() + 7);
//
//     // Filter meetings that fall within the upcoming week
//     const upcomingMeetings = Array.isArray(meeting)
//         ? meeting.filter(function (el) {
//             const meeting_date = new Date(el.date);
//             return meeting_date >= current_date && meeting_date <= endOfWeek;
//         })
//         : [];
//
//     // Set the upcoming meetings count
//     const meetingProgress_length = upcomingMeetings.length;
//
//     return (
//         <div className="bgImage">
//             {isLoading ? (
//                 <CircularProgress className="circular-progress" />
//             ) : (
//                 <main>
//                     <Header />
//                     {showButton && (
//                         <Button
//                             className="scrollButton"
//                             color="primary"
//                             onClick={scrollToBottom}
//                         >
//                             <ArrowDownward />
//                         </Button>
//                     )}
//                     <Container className="my-4">
//                         <Row className="fixed-height-dashboard-upper-cards">
//                             <Col md={6}>
//                                 <Card className="my-card my-card-height">
//                                     <CardTitle tag="h5" className="card-head p-3">
//                                         High Priority tasks
//                                     </CardTitle>
//                                     <CardText className="p-3 card-body">
//                                         {isLoading ? (
//                                             <CircularProgress />
//                                         ) : (
//                                             <TaskTable rows={tasks} dashboard={true} />
//                                         )}
//                                     </CardText>
//                                 </Card>
//                             </Col>
//                             <Col md={4}>
//                                 <Card className="my-card pie-chart-progress">
//                                     <CardTitle tag="h5" className="p-3 card-head">
//                                         Progress Chart
//                                     </CardTitle>
//                                     <CardText className="p-3 card-body">
//                                         <PieChart
//                                             data={[
//                                                 { title: "Completed", value: completed_length, color: "#E38627" },
//                                                 { title: "In Progress", value: inProgress_length, color: "#C13C37" },
//                                                 { title: "Not yet Started", value: notYetStarted_length, color: "#6A2135" },
//                                             ]}
//                                             radius={pieChartDefaultProps.radius - shiftSize}
//                                             segmentsShift={(index) => (index === 0 ? shiftSize : 0.5)}
//                                             label={({ dataEntry }) => dataEntry.value}
//                                             style={{ height: "200px" }}
//                                             labelStyle={{ ...defaultLabelStyle }}
//                                         />
//                                     </CardText>
//                                 </Card>
//                                 <Card className="my-card">
//                                     <CardText className="p-3 card-body">
//                                         {isLoading2 ? <CircularProgress /> : <DateAndTodoList data={meetingProgress[0]} />}
//                                     </CardText>
//                                 </Card>
//                             </Col>
//                             <Col md={2}>
//                                 <Card className="my-card middle-order-card">
//                                     <CardTitle tag="h5" className="p-3 card-head-small">
//                                         Active Tasks
//                                     </CardTitle>
//                                     <CardText className="p-3 card-text-number card-body">
//                                         {tasks.length}
//                                     </CardText>
//                                 </Card>
//                                 <Card className="my-card middle-order-card">
//                                     <CardTitle tag="h5" className="p-3 card-head-small">
//                                         Tasks due
//                                     </CardTitle>
//                                     <CardText className="p-3 card-text-number card-body">
//                                         {tasksDueThisWeek}
//                                     </CardText>
//                                 </Card>
//                                 <Card className="my-card middle-order-card">
//                                     <CardTitle tag="h5" className="p-3 card-head-small">
//                                         Upcoming Meetings
//                                     </CardTitle>
//                                     {isLoading2 ? (
//                                         <CircularProgress />
//                                     ) : (
//                                         <CardText className="p-3 card-text-number card-body">
//                                             {meetingProgress_length}
//                                         </CardText>
//                                     )}
//                                 </Card>
//                             </Col>
//                         </Row>
//                     </Container>
//                     <footer className="bg-dark py-3">
//                         <Container>
//                             <p className="text-white text-center">Copyright © 2023</p>
//                         </Container>
//                     </footer>
//                 </main>
//             )}
//         </div>
//     );
// };
// export default Dashboard;
