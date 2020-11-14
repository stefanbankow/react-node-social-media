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

const PublishDraftConfirm = (props) => {
  const handleDraftPublish = () => {
    props.onDraftPublish(props.postId);
  };
  return (
    <div>
      <Dialog open={props.dialogOpen} onClose={props.handleClose}>
        <DialogTitle>Are you sure you want to publish this post?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Publishing lets every user see the post and comment on it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {props.isLoading ? (
            <CircularProgress />
          ) : (
            <Button
              onClick={handleDraftPublish}
              variant="contained"
              color="primary"
            >
              Publish
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
    onDraftPublish: (draftId) => dispatch(actions.publishDraftAsync(draftId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PublishDraftConfirm);
