import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {
  CardHeader,
  CircularProgress,
  FormControlLabel,
  Modal,
  TextField,
  Zoom,
  useMediaQuery,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { Checkbox } from "@material-ui/core";
import { connect } from "react-redux";

import * as actions from "../../../../store/actions/index";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    width: "70%",
    right: theme.spacing(2),
    bottom: theme.spacing(12),
  },
  rootMobile: {
    position: "fixed",
    width: "90%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  grow: {
    flexGrow: 1,
  },
  inputField: {
    width: "95%",
  },
  inputFieldMobile: {
    width: "95%",
    height: "100px",
    "& .MuiFormControl-root": {
      height: "100%",
    },
  },
  actionButton: {
    margin: "auto 5px",
  },
}));

/*I have since realised that this entire component could be done using the Dialog component which MUI provides, but I have already put in 
a lot of work in creating it, so I will leave it as it is for now. */

const NewPostForm = (props) => {
  const classes = useStyles();
  const smallScreen = !useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const [postFormInputs, setPostFormInputs] = useState({
    title: "",
    content: "",
  });
  const [isPublic, setIsPublic] = useState(true);

  const { closeForm, onCancel } = props;
  useEffect(() => {
    if (closeForm) {
      setPostFormInputs({
        title: "",
        content: "",
      });
      onCancel();
    }

    //ESLing warns me about not including onCancel in the dependencies, but including it causes an infinite loop, which I'm not sure how to fix
  }, [closeForm, onCancel]);

  const handlePublicChange = () => {
    setIsPublic((prevState) => !prevState);
  };

  const handleInputChange = (event) => {
    const field = event.target.name;
    const value = event.target.value;

    setPostFormInputs((prevState) => ({ ...prevState, [field]: value }));
  };

  const handlePostButtonClicked = () => {
    props.onCreatePost({ ...postFormInputs, public: isPublic });
  };

  const createPostCard = (
    <Zoom unmountOnExit in={props.isOpen}>
      <Card variant="outlined">
        <CardHeader title="Create a new post" />
        <CardContent>
          <TextField
            onChange={handleInputChange}
            value={postFormInputs.title}
            InputProps={{
              height: 50,
            }}
            className={classes.inputField}
            label="Title"
            name="title"
            error={props.errors.title}
            helperText={props.errors.title && props.errors.title.message}
          />
          <TextField
            onChange={handleInputChange}
            value={postFormInputs.content}
            className={classes.inputField}
            multiline
            rows={4}
            label="Body"
            name="content"
            error={props.errors.content}
            helperText={props.errors.content && props.errors.content.message}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isPublic}
                onChange={handlePublicChange}
                color="primary"
              />
            }
            label="Public"
          />
        </CardContent>
        <CardActions>
          <div className={classes.grow} />
          {props.postIsLoading ? (
            <CircularProgress />
          ) : (
            <div>
              <Button
                onClick={handlePostButtonClicked}
                className={classes.actionButton}
                variant="contained"
                color="primary"
              >
                Post
              </Button>
              <Button
                onClick={props.onCancel}
                className={classes.actionButton}
                variant="contained"
              >
                Cancel
              </Button>
            </div>
          )}

          <div className={classes.grow} />
        </CardActions>
      </Card>
    </Zoom>
  );

  const loginCard = (
    <Zoom in={props.isOpen}>
      <Card variant="outlined">
        <CardHeader
          style={{ textAlign: "center" }}
          title="You must be signed in to create a post"
        />
        <CardContent style={{ textAlign: "center" }}>
          <Typography variant="h6">
            <Link to="/login">Sign in</Link>
            <Typography>or</Typography>
            <Link to="/signup">Create an account</Link>
          </Typography>
        </CardContent>
      </Card>
    </Zoom>
  );

  return (
    <Modal closeAfterTransition open={props.isOpen} onClose={props.onCancel}>
      <div className={smallScreen ? classes.rootMobile : classes.root}>
        {/* Checks if the user is authenticated to either display the form for a new post or a card saying they need to login */}
        {props.isAuthenticated ? createPostCard : loginCard}
      </div>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    postIsLoading: state.posts.isLoading,
    errors: state.posts.errors,
    closeForm: state.posts.closeForm,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCreatePost: (postData) => dispatch(actions.createPostAsync(postData)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewPostForm);
