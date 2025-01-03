import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Container,
  TextField,
  InputAdornment,
  positions,
  Grid,
  Tooltip,
} from "@mui/material";

import LikeButton from "./LikeButton";
function Forums() {
  const [goalPosts, setGoalPosts] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState("?");
  const [refreshKey, setRefreshKey] = useState(0);
  const [submit, setSubmit] = useState(false);
  const [goalOptions, setGoalOptions] = useState([
    "Physical Health",
    "Finances",
    "Personal Development",
    "Mental Health",
    "Career",
  ]);

  const handleClick = ({ target: { value } }) => {
    console.log(value);
    setSelectedGoal(value);
    const removeSpaces = value.split(" ").join("");
    axios
      .get("/api/forums", { params: { forumName: removeSpaces } })
      .then((posts) => {
        console.log(posts.data);
        setGoalPosts(posts.data);
        setRefreshKey((prevKey) => prevKey + 1);
      })
      .catch((error) => {
        console.error(
          error,
          `error getting ${removeSpaces} forums from server`
        );
      });
  };

  const handleSubmit = (msg) => {
    const refresh = selectedGoal;
    setSubmit(!submit);
    axios
      .post("api/forums", {
        message: msg.get("msg"),
        selectedGoal,
      })
      .then((data) => {
        console.log(data);
        setRefreshKey((prevKey) => prevKey + 1);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (selectedGoal !== "?" && selectedGoal !== "posting...") {
      const value = selectedGoal;
      const removeSpaces = value.split(" ").join("");
      axios
        .get("/api/forums", { params: { forumName: removeSpaces } })
        .then((posts) => {
          console.log(posts.data);
          setGoalPosts(posts.data);
          setRefreshKey((prevKey) => prevKey + 1);
        })
        .catch((error) => {
          console.error(
            error,
            `error getting ${removeSpaces} forums from server`
          );
        });
    }
  }, [submit, selectedGoal]);

  return (
    <div key={refreshKey}>
      <Box
        sx={() => ({
          background: "transparent",
          backdropFilter: "blur(12px)",
          border: "1px solid",
          borderRadius: "24px",
          padding: "2rem",
          overflow: "hidden",
          position: "relative",
          fontSize: "35px",
        })}
        align="center"
      >
        {" "}
        Join a Discussion on Similar Goals!{" "}
      </Box>
      <br />
      <div align="center">
        {goalOptions.map((goal) => {
          return (
            <Button
              className="glass-btn"
              type="button"
              onClick={handleClick}
              key={goal}
              goal={goal}
              value={goal}
            >
              {goal}
            </Button>
          );
        })}
      </div>
      <br />
      <Box align="center" component="form" action={handleSubmit}>
        <label>Say Something Positive!</label>
        <br />
        <TextField
          sx={(theme) => ({
            bgcolor: "#fff",
          })}
          type="text"
          id="msg"
          name="msg"
          placeholder="Spread love!"
        />
        <br />
        <Button type="submit" variant="outlined">
          {" "}
          Submit Post To {selectedGoal}{" "}
        </Button>
      </Box>
      <br></br>
      <div key={refreshKey}>
        {goalPosts.map((post, i) => {
          return (
            <Box align="center" key={refreshKey} container spacing={5}>
              <Grid item xs={10}>
                <Box
                  sx={() => ({
                    bgcolor: 'rgb(255, 255, 255)',
                    opacity: 0.85, 
                    color: "grey.800",
                    border: "2px solid",
                    borderColor: "black",
                    p: 2,
                    borderRadius: 2,
                    fontSize: "0.875rem",
                    fontWeight: "700",
                    top: 0,
                    left: "43%",
                    zIndex: "modal",
                  })}
                  id={selectedGoal}
                >
                  <div align="left">
                    <h4 style={{ color: 'black' }} id={post._id}>{post.forumName}</h4>
                    <br/>
                    <h4 style={{ color: 'black' }} className={post._id}><em>{post.message}</em></h4>
                  </div>
                  <br></br>
                  <LikeButton selectedGoal={selectedGoal} post={post} />
                </Box>
              </Grid>
              <div style={{ height: '2px' }} /> 
            </Box>
          );
        })}
      </div>
    </div>
  );
}

export default Forums;
