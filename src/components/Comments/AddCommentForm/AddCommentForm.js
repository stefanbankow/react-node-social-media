import {
  Button,
  TextField,
  makeStyles,
  Grid,
  Paper,
  Tooltip,
  CircularProgress,
} from "@material-ui/core";
import React, { useState } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";

const useStyles = makeStyles({
  root: {
    alignItems: "center",
    margin: 15,
    textAlign: "center",
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  textInput: {
    marginBottom: 5,
    width: "100%",
  },
});
const AddCommentForm = (props) => {
  const classes = useStyles();
  const [commentBody, setCommentBody] = useState("");

  const handleChange = (event) => {
    setCommentBody(event.target.value);
  };

  const handleSubmit = () => {
    props.onCreateComment(props.postId, commentBody);
    setCommentBody("");
  };
  return (
    <div className={classes.root}>
      <Grid container>
        <Grid style={{ width: "100%" }} sm={9} item>
          <TextField
            error={props.errors.content}
            helperText={props.errors.content && props.errors.content.message}
            value={
              commentBody.length === 0 && !props.userId
                ? "You must be signed in to add a comment"
                : commentBody
            }
            onChange={handleChange}
            size="small"
            type="text"
            variant="outlined"
            name="body"
            label="Comment"
            disabled={!props.userId}
            className={classes.textInput}
          />
        </Grid>
        <Grid item sm={3}>
          {props.isLoading ? (
            <CircularProgress />
          ) : (
            <Button
              onClick={handleSubmit}
              className={classes.button}
              color="primary"
              variant="contained"
              disabled={!props.userId || commentBody.length === 0}
            >
              Comment
            </Button>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.auth.userId,
    isLoading: state.comments.isLoading,
    success: state.comments.success,
    errors: state.comments.errors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCreateComment: (postId, commentBody) =>
      dispatch(actions.createCommentAsync(postId, commentBody)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddCommentForm);
