import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  ButtonBase,
  CircularProgress,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import Posts from "../../components/Posts/Posts";
import { connect } from "react-redux";
import { getUserProfileAsync, postsReset } from "../../store/actions/index";
import NewPost from "../../components/Posts/NewPost/NewPost";
import About from "../../components/Auth/User/About/About";
import UserSettings from "../../components/Auth/User/UserSettings/UserSettings";
import withError from "../../hoc/withError/withError";
import Axios from "axios";
import ImageDialog from "../../components/Auth/User/ImageDialog/ImageDialog";

const useStyles = makeStyles(() => ({
  grow: {
    flexGrow: 1,
  },
  avatarContainer: {
    height: 175,
    width: 175,
    cursor: "pointer",
    margin: "15px auto",
    position: "relative",

    "&:hover $avatarOverlay": {
      opacity: 0.5,
    },
    "&:hover $avatarOverlayText": {
      opacity: 1,
    },
  },
  avatarInputEl: { margin: "auto", display: "none" },
  avatar: {
    margin: "auto",
    width: 175,
    height: 175,
  },
  avatarOverlay: {
    position: "absolute",
    backgroundColor: "black",
    top: "0%",
    left: "0%",
    height: "100%",
    width: "100%",
    transition: "opacity 0.5s ease",
    opacity: 0,
  },
  avatarOverlayText: {
    position: "absolute",
    textAlign: "center",
    color: "white",
    top: "50%",
    left: "50%",
    width: "100%",
    transform: "translate(-50%, -50%)",
    transition: "opacity 0.5s ease",
    opacity: 0,
  },
  spinner: {
    marginTop: 25,
  },
  username: {
    textAlign: "center",
  },
  about: {
    justifyContent: "center",
  },
}));
const UserProfile = (props) => {
  const classes = useStyles();

  const { onMount, postsReset } = props;

  const { username } = props.match.params;
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [imgDialogOpen, setImgDialogOpen] = useState(false);

  useEffect(() => {
    postsReset();
    onMount(username);
  }, [onMount, postsReset, username]);

  const handleAboutDialogOpen = () => {
    setAboutDialogOpen(true);
  };

  const handleAboutDialogClosed = () => {
    setAboutDialogOpen(false);
  };

  const handleSettingsDialogOpen = () => {
    setSettingsDialogOpen(true);
  };

  const handleSettingsDialogClosed = () => {
    setSettingsDialogOpen(false);
  };

  const handleImageDialogOpen = () => {
    setImgDialogOpen(true);
  };

  const handleImageDialogClose = () => {
    setImgDialogOpen(false);
  };

  return (
    <div>
      {props.user ? (
        <div>
          <div
            onClick={handleImageDialogOpen}
            className={classes.avatarContainer}
          >
            <Avatar
              className={classes.avatar}
              src={`data:image/jpeg;base64,${props.user.avatar}`}
            />
            <Avatar className={classes.avatarOverlay}> </Avatar>
            <h6 className={classes.avatarOverlayText}>
              View{props.authUserId === props.user._id && "/Change"} profile
              picture
            </h6>
          </div>
          <ImageDialog
            dialogOpen={imgDialogOpen}
            handleClose={handleImageDialogClose}
            avatarSrc={props.user.avatar}
            userId={props.user._id}
            authUserId={props.authUserId}
          />

          <Typography className={classes.username} variant="h3">
            {props.match.params.username}
          </Typography>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={handleAboutDialogOpen}>About</Button>
            <About
              dialogOpen={aboutDialogOpen}
              handleClose={handleAboutDialogClosed}
              country={props.user.country}
              age={props.user.age}
              about={props.user.about}
            />
            {props.user._id === props.authUserId && (
              <React.Fragment>
                <Button onClick={handleSettingsDialogOpen}>Settings</Button>
                <UserSettings
                  dialogOpen={settingsDialogOpen}
                  handleClose={handleSettingsDialogClosed}
                />
              </React.Fragment>
            )}
          </div>
          <Grid container>
            <Grid item sm />
            <Grid style={{ flexGrow: 1 }} item sm={8}>
              {props.posts ? (
                <Posts user={props.user} posts={props.posts} />
              ) : (
                <CircularProgress />
              )}
            </Grid>
            <Grid item sm />
          </Grid>
          {props.user._id === props.authUserId && <NewPost />}
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <CircularProgress className={classes.spinner} size={90} />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    authUserId: state.auth.userId,
    errors: state.user.errors,
    posts: state.posts.posts,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onMount: (username) => dispatch(getUserProfileAsync(username)),
    postsReset: () => dispatch(postsReset()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withError(UserProfile, Axios));
