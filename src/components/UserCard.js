import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Card, Grid } from "@mui/material";
import "../App.css";
import { useNavigate } from "react-router-dom";

const UserCard = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [cardData, setCardData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getAllUser();

    getAllPosts();

    const userPromise = axios.get("https://jsonplaceholder.typicode.com/users");
    const postPromise = axios.get("https://jsonplaceholder.typicode.com/posts");

    Promise.all([userPromise, postPromise])
      .then((responses) => {
        const userResponse = responses[0].data;
        const postResponse = responses[1].data;

        const data = [];
        for (let i = 0; i < userResponse.length; i++) {
          let obj = {};
          obj["name"] = userResponse[i].name;
          obj["id"] = userResponse[i].id;
          const filteredData = postResponse.filter(
            (post) => post.userId === userResponse[i].id
          );
          obj["postCount"] = filteredData.length;
          data.push(obj);
        }
        setCardData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const getAllUser = async () => {
    try {
      const url = "https://jsonplaceholder.typicode.com/users";

      const response = await axios.get(url);
      setUsers(response.data);
      console.log("userData", response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const getAllPosts = async () => {
    try {
      const url = "https://jsonplaceholder.typicode.com/posts";
      const response = await axios.get(url);
      setPosts(response.data);

      console.log("postData", response.data);
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleRedirect = (data) => {
    console.log("data from redirect", data);
    navigate(`/profile/${data.id}`, {
      state: { userData: users, postData: posts },
    });
  };

  return (
    <>
      <Header />
      <div className="grid-container">
        <Grid container rowSpacing={6}>
          {cardData?.map((card, index) => (
            <Grid
              item
              sx={12}
              sm={12}
              md={6}
              lg={4}
              xl={3}
              className="grid-item-container"
            >
              <Card
                key={card?.id}
                className="card-conatiner"
                onClick={() => handleRedirect(card)}
              >
                <div className="card-text">
                  <h3>Name:{card?.name}</h3>
                  <h3>Posts:{card?.postCount}</h3>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </>
  );
};

export default UserCard;
