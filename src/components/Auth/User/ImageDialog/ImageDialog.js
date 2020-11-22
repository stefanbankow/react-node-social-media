import {
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  makeStyles,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import Axios from "axios";
import { connect } from "react-redux";
import React, { useState } from "react";
import { useEffect } from "react";
import * as actions from "../../../../store/actions/index";

const useStyles = makeStyles({
  imagePreviewEl: {
    objectFit: "fill",
    maxWidth: "100%",
    height: "auto",
  },
  inputEl: {
    display: "none",
  },
});

const ImageDialog = (props) => {
  const classes = useStyles();
  const [imgFile, setImgFile] = useState(null);
  const [newImg, setNewImg] = useState(null);

  const { dialogOpen, closeForm, handleClose } = props;

  useEffect(() => {
    if (!dialogOpen) {
      setImgFile(null);
      setNewImg(null);
    }
    closeForm && handleClose();
  }, [dialogOpen, closeForm, handleClose]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const image = new Image(500, 500);

    if (file) {
      const imageUrl = URL.createObjectURL(file);

      image.onload = function () {
        URL.revokeObjectURL(imageUrl);
      };

      image.src = imageUrl;

      setNewImg(image);
      setImgFile(file);
    }
  };

  const handleImageUpload = () => {
    props.onImageUpload(imgFile);
  };

  const uploadImgButtons = (
    <React.Fragment>
      {newImg && (
        <label>
          <Button
            color="secondary"
            disabled={props.isLoading}
            variant="contained"
            onClick={handleImageUpload}
            endIcon={<AddAPhotoIcon />}
          >
            Save
          </Button>
        </label>
      )}
      <input
        onChange={handleImageChange}
        id="profile-pic-change"
        className={classes.inputEl}
        accept="image/*"
        type="file"
      />
      <label htmlFor="profile-pic-change" style={{ display: "inline" }}>
        <Button
          variant="contained"
          color="primary"
          endIcon={<CameraAltIcon />}
          component="span"
        >
          Change
        </Button>
      </label>
    </React.Fragment>
  );

  return (
    <div>
      <Dialog open={props.dialogOpen} onClose={props.handleClose} fullWidth>
        <DialogTitle>Profile picture</DialogTitle>
        <DialogContent
          style={{
            display: "flex",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          {newImg ? (
            <img
              className={classes.imagePreviewEl}
              src={newImg.src}
              alt="Error loading"
            />
          ) : props.avatarSrc ? (
            <img
              className={classes.imagePreviewEl}
              src={`data:image/jpeg;base64,${props.avatarSrc}`}
              alt=""
            />
          ) : (
            <DialogContentText>
              This user hasn't uploaded a profile picture yet
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Typography color="error" variant="body2">
            {props.errors.profilePic}
          </Typography>
          {props.userId === props.authUserId && uploadImgButtons}
          <label>
            <Button variant="contained" onClick={props.handleClose}>
              Close
            </Button>
          </label>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    errors: state.user.errors,
    closeForm: state.user.closeForm,
    isLoading: state.user.isLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onImageUpload: (file) => dispatch(actions.changeProfilePictureAsync(file)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageDialog);
