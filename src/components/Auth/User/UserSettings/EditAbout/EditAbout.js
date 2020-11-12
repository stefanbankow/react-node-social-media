import {
  DialogContent,
  DialogTitle,
  DialogActions,
  makeStyles,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../../../../../store/actions/index";

const useStyles = makeStyles({
  dialogContent: {},
  input: {
    marginBottom: 10,
    margin: "auto",
  },
});

const EditAbout = (props) => {
  const classes = useStyles();
  const { user } = props;
  const [formInputs, setFormInputs] = useState({
    age: user.age || "",
    about: user.about || "",
    location: user.location || "",
  });
  const [error, setError] = useState(null);

  const { closeForm, handleClose } = props;

  useEffect(() => {
    if (closeForm) {
      handleClose();
    }
  }, [closeForm, handleClose]);

  const handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;

    setFormInputs((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleUpdateUserAbout = () => {
    if (
      formInputs.age !== user.age ||
      formInputs.location !== user.location ||
      formInputs.about !== user.about
    ) {
      const reqBody = {
        age: formInputs.age,
        about: formInputs.about,
        location: formInputs.location,
      };
      props.onUserUpdate(reqBody);
      props.closeForm && props.handleClose();
    } else {
      setError("You must change at least one field if you want to update");
    }
  };

  return (
    <div role="tabpanel" hidden={props.value !== props.index}>
      {props.value === props.index && (
        <React.Fragment>
          <DialogContent className={classes.dialogContent}>
            <div>
              <TextField
                error={error}
                fullWidth
                className={classes.input}
                onChange={handleChange}
                type="number"
                value={formInputs.age}
                name="age"
                label="Age"
              />
            </div>
            <div>
              <TextField
                error={error}
                fullWidth
                className={classes.input}
                onChange={handleChange}
                value={formInputs.location}
                name="location"
                label="Location"
              />
            </div>
            <div>
              <TextField
                error={error}
                fullWidth
                className={classes.input}
                onChange={handleChange}
                multiline
                rows={5}
                value={formInputs.about}
                name="about"
                label="About you"
              />
            </div>
            <Typography style={{ textAlign: "center" }} color="error">
              {error}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleUpdateUserAbout}
              variant="contained"
              color="primary"
            >
              Edit
            </Button>
            <Button variant="contained" onClick={props.handleClose}>
              Close
            </Button>
          </DialogActions>
        </React.Fragment>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    isLoading: state.user.isLoading,
    errors: state.user.errors,
    closeForm: state.user.closeForm,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUserUpdate: (reqBody) => dispatch(actions.updateUserAboutAsync(reqBody)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditAbout);
