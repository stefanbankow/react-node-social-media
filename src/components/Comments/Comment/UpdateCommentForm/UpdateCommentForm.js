import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  makeStyles,
  DialogActions,
  Button,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions/index";

const useStyles = makeStyles({
  input: {
    width: "100%",
  },
});

const UpdateCommentForm = (props) => {
  const [commentBody, setCommentBody] = useState(props.commentBody);
  const classes = useStyles();

  const { closeForm, handleClose } = props;
  useEffect(() => {
    if (closeForm) {
      handleClose();
    }
  }, [closeForm, handleClose]);

  const handleChange = (event) => {
    setCommentBody(event.target.value);
  };

  const handleUpdateComment = () => {
    const commentData = {
      content: commentBody,
    };
    props.onCommentUpdate(props.postId, props.commentId, commentData);
  };

  return (
    <div>
      <Dialog
        keepMounted={false}
        fullWidth
        maxWidth="sm"
        onClose={props.handleClose}
        open={props.dialogOpen}
      >
        <DialogTitle>Update comment</DialogTitle>
        <DialogContent>
          <div>
            <TextField
              className={classes.input}
              onChange={handleChange}
              label="Body"
              multiline
              rows={2}
              value={commentBody}
              name="content"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleUpdateComment}
            variant="contained"
            color="primary"
          >
            Update
          </Button>
          <Button variant="contained" onClick={props.handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    closeForm: state.comments.closeForm,
    isLoading: state.comments.isLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCommentUpdate: (postId, commentId, commentData) =>
      dispatch(actions.updateCommentAsync(postId, commentId, commentData)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateCommentForm);
