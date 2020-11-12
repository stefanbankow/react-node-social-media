import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  CircularProgress,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import Posts from "../../components/Posts/Posts";
import { connect } from "react-redux";
import { getUserProfileAsync } from "../../store/actions/index";
import NewPost from "../../components/Posts/NewPost/NewPost";
import About from "../../components/Auth/User/About/About";
import UserSettings from "../../components/Auth/User/UserSettings/UserSettings";

const useStyles = makeStyles(() => ({
  grow: {
    flexGrow: 1,
  },
  avatar: {
    margin: "15px auto",
    width: 175,
    height: 175,
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
  const { onMount, user, posts } = props;
  const { username } = props.match.params;
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  useEffect(() => {
    onMount(username);
  }, [onMount, posts, username]);

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

  return (
    <div>
      {props.user ? (
        <div>
          <Avatar className={classes.avatar}>U</Avatar>
          <Typography className={classes.username} variant="h3">
            {props.match.params.username}
          </Typography>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={handleAboutDialogOpen} variant="body1">
              About
            </Button>
            <About
              dialogOpen={aboutDialogOpen}
              handleClose={handleAboutDialogClosed}
              location={props.user.location}
              age={props.user.age}
              about={props.user.about}
            />
            {props.user._id === props.authUserId && (
              <React.Fragment>
                <Button onClick={handleSettingsDialogOpen} variant="body1">
                  Settings
                </Button>
                <UserSettings
                  dialogOpen={settingsDialogOpen}
                  handleClose={handleSettingsDialogClosed}
                />
              </React.Fragment>
            )}
          </div>
          <Grid container>
            <Grid item sm={2} />
            <Grid item sm={8}>
              <Posts user={props.user} posts={props.user.posts} />
            </Grid>
            <Grid item sm={2} />
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
    isLoading: state.user.isLoading,
    errors: state.user.errors,
    //Need posts in order to update the posts in a user's profile in real time
    posts: state.posts.posts,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onMount: (username) => dispatch(getUserProfileAsync(username)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
