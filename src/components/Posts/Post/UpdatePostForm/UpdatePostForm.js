import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  makeStyles,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Button,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { updatePostAsync } from "../../../../store/actions";
import * as actions from "../../../../store/actions/index";

const useStyles = makeStyles({
  input: {
    width: "100%",
  },
});

const UpdatePostForm = (props) => {
  const [formInputs, setFormInputs] = useState({
    title: props.postTitle,
    content: props.postContent,
  });
  const [publicState, setPublicState] = useState(props.public);
  const classes = useStyles();

  const { closeForm, closeDraftForm, handleClose } = props;
  useEffect(() => {
    if (closeForm || closeDraftForm) {
      handleClose();
    }
  }, [closeForm, closeDraftForm, handleClose]);

  const handleChange = (event) => {
    //Have to set these in constants (or variables because they cant be accessed im the callback function otherwise)
    const name = event.target.name;
    const value = event.target.value;

    setFormInputs((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCheckboxChange = () => {
    setPublicState((prevState) => !prevState);
  };

  const handleUpdatePost = () => {
    const postData = {
      ...formInputs,
      public: publicState,
    };
    props.onPostUpdate(props.postId, postData);
  };

  const handleUpdateDraft = () => {
    const postData = {
      ...formInputs,
    };
    props.onDraftUpdate(props.postId, postData);
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
        <DialogTitle>Update post</DialogTitle>
        <DialogContent>
          <div>
            <TextField
              className={classes.input}
              onChange={handleChange}
              label="Title"
              variant="standard"
              value={formInputs.title}
              name="title"
            />
          </div>
          <div>
            <TextField
              className={classes.input}
              onChange={handleChange}
              label="Body"
              multiline
              rows={5}
              value={formInputs.content}
              name="content"
            />
          </div>
          {!props.isDraft && (
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={publicState}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Public"
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          {props.isDraft ? (
            <Button
              onClick={handleUpdateDraft}
              variant="contained"
              color="primary"
            >
              Save
            </Button>
          ) : (
            <Button
              onClick={handleUpdatePost}
              variant="contained"
              color="primary"
            >
              Update
            </Button>
          )}

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
    closeForm: state.posts.closeForm,
    closeDraftForm: state.drafts.closeForm,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onPostUpdate: (postId, postData) =>
      dispatch(updatePostAsync(postId, postData)),
    onDraftUpdate: (draftId, reqBody) =>
      dispatch(actions.updateDraftAsync(draftId, reqBody)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePostForm);
