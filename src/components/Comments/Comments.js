import {
  makeStyles,
  Divider,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import React from "react";
import AddCommentForm from "./AddCommentForm/AddCommentForm";
import Comment from "./Comment/Comment";
import { connect } from "react-redux";

const useStyles = makeStyles({
  root: {},
  commentsRoot: {
    width: "90%",
    margin: "auto",
  },
  commentsBackground: {
    backgroundColor: "#eee",
    maxHeight: "350px",
    overflow: "auto",
    display: "flex",
    flexDirection: "column-reverse",
  },
  spinnerBackground: {
    backgroundColor: "#eee",
    display: "flex",
  },
  spinner: {
    margin: "10px auto 10px auto",
  },
});

const Comments = (props) => {
  const classes = useStyles();
  const currentPost = props.posts.find((post) => post.id === props.postId);

  let spinner = (
    <div className={classes.spinnerBackground}>
      <CircularProgress size={50} className={classes.spinner} />
    </div>
  );

  let comments = spinner;

  if (currentPost) {
    comments = (
      <div className={classes.commentsBackground}>
        <div className={classes.commentsRoot}>
          {currentPost.comments.length > 0 ? (
            currentPost.comments.map((comment) => (
              <Comment
                key={comment._id}
                id={comment._id}
                author={comment.author.username}
                authorId={comment.author._id}
                avatar={comment.author.avatar}
                createdAt={comment.createdAt}
                content={comment.content}
                postId={comment.onPost}
              />
            ))
          ) : (
            <Typography style={{ margin: 15 }} variant="body1">
              There are no comments yet, be the first to add one!
            </Typography>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className={classes.root}>
      <Divider />
      {comments}
      <AddCommentForm postId={props.postId} />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    posts: state.comments.posts,
    isLoading: state.comments.isLoading,
  };
};

export default connect(mapStateToProps)(Comments);
