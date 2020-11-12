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
import mapPasswordReq from "../../../../../util/mapPasswordReq";
import * as actions from "../../../../../store/actions/index";
import { updateUserPasswordFailure } from "../../../../../store/actions/user";

const useStyles = makeStyles({
  dialogContent: {},
  input: {
    marginBottom: 10,
    margin: "auto",
  },
});

const ChangePassword = (props) => {
  const classes = useStyles();
  const [formInputs, setFormInputs] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

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

  const handleUpdateUserPassword = () => {
    if (formInputs.newPassword === formInputs.confirmNewPassword) {
      const reqBody = {
        oldPassword: formInputs.oldPassword,
        newPassword: formInputs.newPassword,
      };
      props.onPasswordUpdate(reqBody);
    } else {
      props.onPasswordUpdateFailure({
        password: { message: "Passwords must match" },
        confirmNewPassword: { message: "Passwords must match" },
      });
    }
  };

  return (
    <div role="tabpanel" hidden={props.value !== props.index}>
      {props.value === props.index && (
        <React.Fragment>
          <DialogContent className={classes.dialogContent}>
            <div>
              <TextField
                error={props.errors.oldPassword}
                helperText={
                  props.errors.oldPassword && props.errors.oldPassword.message
                }
                fullWidth
                className={classes.input}
                onChange={handleChange}
                type="password"
                value={formInputs.age}
                name="oldPassword"
                label="Old Password"
              />
            </div>
            <div>
              <TextField
                error={props.errors.password}
                helperText={
                  props.errors.password &&
                  mapPasswordReq(props.errors.password.message).map((error) => (
                    <div>{error}</div>
                  ))
                }
                fullWidth
                className={classes.input}
                onChange={handleChange}
                type="password"
                value={formInputs.age}
                name="newPassword"
                label="New Password"
              />
            </div>
            <div>
              <TextField
                error={props.errors.confirmNewPassword}
                helperText={
                  props.errors.confirmNewPassword &&
                  props.errors.confirmNewPassword.message
                }
                fullWidth
                className={classes.input}
                onChange={handleChange}
                type="password"
                value={formInputs.age}
                name="confirmNewPassword"
                label="Confirm New Password"
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleUpdateUserPassword}
              variant="contained"
              color="primary"
            >
              Change password
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
    onPasswordUpdate: (reqBody) =>
      dispatch(actions.updateUserPasswordAsync(reqBody)),
    onPasswordUpdateFailure: (errors) =>
      dispatch(updateUserPasswordFailure(errors)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
