import {
  DialogContent,
  DialogActions,
  makeStyles,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import allCountries from "../../../../../util/allCountries";

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
    country: user.country || "",
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
      formInputs.country !== user.country ||
      formInputs.about !== user.about
    ) {
      const reqBody = {
        age: formInputs.age,
        about: formInputs.about,
        country: formInputs.country,
      };
      setError(null);
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
                error={
                  error ||
                  (props.errors && props.errors.age) ||
                  Object.keys(props.errors).length > 0
                }
                helperText={props.errors.age && props.errors.age.message}
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
                select
                error={error || Object.keys(props.errors).length > 0}
                fullWidth
                className={classes.input}
                onChange={handleChange}
                value={formInputs.country}
                name="country"
                label="Country"
              >
                {allCountries.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country === "" ? "None" : country}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div>
              <TextField
                error={error || Object.keys(props.errors).length > 0}
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
              {Object.keys(props.errors).length > 0
                ? props.errors.message
                : error}
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
