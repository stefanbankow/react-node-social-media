import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  CircularProgress,
} from "@material-ui/core";
import * as actions from "../../../../store/actions/index";
import { connect } from "react-redux";

const DeleteCommentConfirm = (props) => {
  const handleDelete = () => {
    props.onCommentDelete(props.postId, props.commentId);
  };
  return (
    <div>
      <Dialog open={props.dialogOpen} onClose={props.handleClose}>
        <DialogTitle>Are you sure you want to delete this comment?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This process is irreversible, once you delete a comment, it cannot
            be recovered.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {props.isLoading ? (
            <CircularProgress />
          ) : (
            <Button onClick={handleDelete} variant="contained" color="primary">
              Delete
            </Button>
          )}

          <Button variant="contained" onClick={props.handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.comments.isLoading,
    errors: state.comments.errors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCommentDelete: (postId, commentId) =>
      dispatch(actions.deleteCommentAsync(postId, commentId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteCommentConfirm);
