import React, { useEffect } from "react";
import { connect } from "react-redux";
import Post from "./Post/Post";
import { makeStyles } from "@material-ui/core/styles/";
import axios from "axios";
import { Typography } from "@material-ui/core";
import withError from "../../hoc/withError/withError";

const useStyles = makeStyles({
  spinner: {
    color: "inherit",
    margin: "20px auto",
  },
  noPostsText: {
    marginTop: "25px",
  },
});

const Posts = (props) => {
  const classes = useStyles();

  //Destructuring to pass only the onMount prop as a "dependency" to useEffect
  /*   if (props.posts) {
    let posts = props.posts.map((post) => (
      <Post
        key={post._id}
        id={post._id}
        title={post.title}
        createdAt={post.createdAt}
        author={post.author.username}
        content={post.content}
      />
    ));
  } */

  return (
    <div style={{ margin: "auto", textAlign: "center", width: "95%" }}>
      {props.posts.map((post) => (
        <Post
          key={post._id}
          id={post._id}
          title={post.title}
          createdAt={post.createdAt}
          public={post.public}
          author={post.author.username || props.user.username}
          authorId={post.author._id || props.user._id}
          content={post.content}
        />
      ))}
      {props.posts && props.posts.length === 0 && (
        <Typography className={classes.noPostsText} variant="h6">
          Sorry, there are no posts to display at this time
        </Typography>
      )}
    </div>
  );
};

export default Posts;
