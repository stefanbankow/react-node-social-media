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
import { deletePostAsync } from "../../../../store/actions/index";
import { connect } from "react-redux";

const DeletePostConfirm = (props) => {
  const handleDelete = () => {
    props.onPostDelete(props.postId);
  };
  return (
    <div>
      <Dialog open={props.dialogOpen} onClose={props.handleClose}>
        <DialogTitle>Are you sure you want to delete this post?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This process is irreversible, once you delete a post, it cannot be
            recovered.
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
    isLoading: state.posts.isLoading,
    errors: state.posts.errors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onPostDelete: (postId) => dispatch(deletePostAsync(postId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeletePostConfirm);
