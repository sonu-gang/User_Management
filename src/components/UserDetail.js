import { Button, Card, Grid } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Select, MenuItem } from "@mui/material";
import Header from "./Header";
import axios from "axios";

const UserDetail = () => {
  const intervalRef = useRef(null);

  const [isClockStart, setIsClockStart] = useState(true);

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState([]);
  const [watchStopTime, setWatchStopTime] = useState("");
  const [currentUserPosts, setCurrentUserPosts] = useState([]);
  const [selectedTimeZone, setSelectedTimeZone] = useState("Africa/Abidjan");
  const [allTimeZone, setAllTimeZone] = useState([]);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  useEffect(() => {
    const { postData, userData } = location.state;
    const currentUserDetails = userData.filter(
      (user) => user.id === parseInt(id)
    );
    setUserDetails(currentUserDetails);
    const currentUserPosts = postData.filter(
      (post) => post.userId === parseInt(id)
    );
    setCurrentUserPosts(currentUserPosts);
  }, []);

  useEffect(() => {
    axios
      .get("http://worldtimeapi.org/api/timezone")
      .then((response) => {
        setAllTimeZone(response.data);
        // setSelectedTimeZone(response.data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function getCurrentTime() {
    const now = new Date();
    const options = { timeZone: selectedTimeZone, timeStyle: "medium" };

    return now.toLocaleTimeString([], options);
  }

  useEffect(() => {
    let interval;
    if (isClockStart) {
      interval = setInterval(() => {
        setCurrentTime(getCurrentTime());
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [selectedTimeZone, isClockStart]);

  const handleBack = () => {
    navigate("/");
  };
  const handleToggleClock = () => {
    if (isClockStart) {
      setIsClockStart(false);
    } else {
      setIsClockStart(true);
    }
  };

  const handleSelectTimeZone = (event) => {
    setSelectedTimeZone(event.target.value);
  };

  return (
    <div>
      <Header />
      <div>
        <div className="back-button-container">
          <Button
            onClick={handleBack}
            variant="outlined"
            sx={{ marginTop: "10px" }}
          >
            Back
          </Button>
          <div className="clock-container">
            <Select
              value={selectedTimeZone}
              onChange={handleSelectTimeZone}
              sx={{ minWidth: "100px" }}
            >
              {allTimeZone.map((timezone) => (
                <MenuItem key={timezone} value={timezone}>
                  {timezone}
                </MenuItem>
              ))}
            </Select>
          </div>
          {/* <div>
            {currentTime.hours !== "" && (
              <Watch
                hours={currentTime.hours}
                minutes={currentTime.minutes}
                seconds={currentTime.seconds}
              />
            )}
          </div> */}
          <div>
            <p>Current Time {currentTime}</p>
          </div>

          <Button
            variant="outlined"
            sx={{ marginTop: "10px" }}
            onClick={handleToggleClock}
          >
            {isClockStart ? "Pause" : "Start"}
          </Button>
        </div>
      </div>
      <div>
        <Card className="user-detail-card">
          {console.log("detailsssssss", userDetails)}
          <div>
            <h4>Name-{userDetails[0]?.name}</h4>
            <h4>UserName-{userDetails[0]?.username}</h4>
          </div>
          <div>
            <h4>
              Address-
              {`${userDetails[0]?.address?.city} | ${userDetails[0]?.address?.street}`}
            </h4>
            <h4>
              Email-
              {`${userDetails[0]?.email} | Phone ${userDetails[0]?.phone}`}
            </h4>
          </div>
        </Card>
      </div>
      <div className="post-container">
        <Grid container spacing={2}>
          {currentUserPosts.map((post) => (
            <Grid item sx={12} sm={12} md={12} lg={6} xl={6}>
              <Card className="post-card">
                <h3>{post.title}</h3>
                <p>{post.body}</p>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default UserDetail;
