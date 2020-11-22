import React, { useEffect } from "react";
import { connect } from "react-redux";
import Post from "./Post/Post";
import { makeStyles } from "@material-ui/core/styles/";
import { CircularProgress, Typography } from "@material-ui/core";
import { Waypoint } from "react-waypoint";
import * as actions from "../../store/actions/index";

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
  const { posts } = props;
  useEffect(() => {}, [posts]);

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

  const handleBottomReached = (e) => {
    if (props.user) {
      props.onAddUserPosts(props.user._id, props.lastPostDate);
    } else {
      props.onAddPosts(props.lastPostDate);
    }
  };

  return (
    <div style={{ margin: "auto", textAlign: "center", width: "95%" }}>
      {props.posts.map((post) => (
        <Post
          isDraft={props.areDrafts}
          key={post._id}
          id={post._id}
          title={post.title}
          createdAt={post.createdAt}
          public={post.public}
          author={props.user ? props.user.username : post.author.username}
          authorId={props.user ? props.user._id : post.author._id}
          avatar={props.user ? props.user.avatar : post.author.avatar}
          content={post.content}
          likes={post.likes}
        />
      ))}
      {props.posts.length < props.totalPostCount && (
        <Waypoint onEnter={handleBottomReached}>
          <Typography variant="h6">
            <CircularProgress />
            <div />
            Loading more posts
          </Typography>
        </Waypoint>
      )}
      {props.posts && props.posts.length === 0 && (
        <Typography className={classes.noPostsText} variant="h6">
          Sorry, there are no {props.areDrafts ? "drafts" : "posts"} to display
          at this time
        </Typography>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.posts.isLoading,
    lastPostDate: state.posts.lastPostDate,
    totalPostCount: state.posts.totalPostCount,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddPosts: (lastPostDate) => dispatch(actions.addPostsAsync(lastPostDate)),
    onAddUserPosts: (userId, lastPostDate) =>
      dispatch(actions.addUserPostsAsync(userId, lastPostDate)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
