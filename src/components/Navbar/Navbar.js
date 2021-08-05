import React, { useState } from "react";
import { makeStyles, fade } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import NotificationsIcon from "@material-ui/icons/Notifications";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import DraftsIcon from "@material-ui/icons/Drafts";
import { Link, NavLink } from "react-router-dom";
import { Badge, Menu, MenuItem } from "@material-ui/core";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import ButtonBase from "@material-ui/core/ButtonBase";
import Notifications from "../Notifications/Notifications";
import Axios from "axios";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  titleLink: {
    "&:hover": {
      backgroundColor: fade("rgb(0,0,0)", 0.03),
      borderRadius: 3,
      textDecoration: "none",
    },
  },
  title: {
    padding: 3,
    backgroundColor: fade("rgb(0,0,0)", 0.0),
    color: theme.palette.text.primary,
    "&:hover": {
      backgroundColor: fade("rgb(0,0,0)", 0.01),
      borderRadius: 5,
    },
  },

  authButtonsRoot: {
    //The .MuiButton-text overwrite is the only way I found to change the color
    "& .active": {
      "& .MuiButton-text": {
        color: theme.palette.text.primary,
      },
    },
  },

  buttonLink: {
    textDecoration: "none",
    height: "100%",
    "&:hover": {
      textDecoration: "none",
    },
  },

  navButton: {
    textDecoration: "none",
    color: theme.palette.text.secondary,
  },
}));

const NavbarLayout = (props) => {
  const classes = useStyles();
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = (event) => {
    setUserMenuAnchorEl(null);
  };

  const handleRedirectToProfile = () => {
    props.history.push(`/users/${props.username}`);
    setUserMenuAnchorEl(null);
  };

  const handleRedirectToDrafts = () => {
    props.history.push("/drafts");
    setUserMenuAnchorEl(null);
  };

  const handleNotificationsOpen = () => {
    setNotificationsOpen(true);
  };

  const handleNotificationsClose = () => {
    setNotificationsOpen(false);
    if (
      props.notifications &&
      props.notifications.some((notification) => !notification.read)
    ) {
      const unreadNotificationIds = [];
      props.notifications.forEach((notification) => {
        !notification.read && unreadNotificationIds.push(notification._id);
      });

      Axios.patch("/notifications/read", {
        notifications: unreadNotificationIds,
      })
        .then()
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleSignOut = () => {
    props.onSignOut();
    setUserMenuAnchorEl(null);
    props.history.replace("/");
  };

  const userMenu = (
    <Menu
      anchorEl={userMenuAnchorEl}
      open={Boolean(userMenuAnchorEl)}
      onClose={handleUserMenuClose}
    >
      <MenuItem onClick={handleRedirectToProfile}>
        <AccountCircleIcon />
        Profile
      </MenuItem>
      <MenuItem onClick={handleRedirectToDrafts}>
        <DraftsIcon />
        Drafts
      </MenuItem>
      <MenuItem disabled={props.isLoading} onClick={handleSignOut}>
        <ExitToAppIcon />
        Sign out
      </MenuItem>
    </Menu>
  );

  const authButtons = (
    <div className={classes.authButtonsRoot}>
      <NavLink
        className={classes.buttonLink}
        to={{
          pathname: "/signup",
          //Using this to be able to go back to current page after login/signup
          state: { from: props.location },
        }}
      >
        <Button size="large" className={classes.navButton}>
          Sign up
        </Button>
      </NavLink>
      <NavLink
        className={classes.buttonLink}
        to={{
          pathname: "/login",
          state: { from: props.location },
        }}
      >
        {" "}
        <Button size={"large"} className={classes.navButton}>
          Sign in
        </Button>
      </NavLink>
    </div>
  );
  const userButtons = (
    <div>
      <IconButton>
        <Badge color="secondary" badgeContent={props.unreadNotificationsCount}>
          <NotificationsIcon onClick={handleNotificationsOpen} />
        </Badge>
      </IconButton>
      {/* <Link to={`/users/${props.username}`}></Link> */}
      <IconButton onClick={handleUserMenuOpen}>
        <AccountCircleIcon />
      </IconButton>
    </div>
  );
  return (
    <AppBar style={{ minHeight: "20px" }} position="sticky">
      <Toolbar>
        <Link
          className={classes.titleLink}
          to={{
            pathname: "/",
            state: { from: props.location },
          }}
        >
          <ButtonBase component={Typography}>
            <Typography variant="h6" className={classes.title}>
              Social Media
            </Typography>
          </ButtonBase>
        </Link>

        <div className={classes.grow}></div>

        {props.isAuthenticated ? userButtons : authButtons}
        <Notifications
          dialogOpen={notificationsOpen}
          handleClose={handleNotificationsClose}
        />
        {userMenu}
      </Toolbar>
    </AppBar>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.auth.isLoading,
    isAuthenticated: state.auth.isAuthenticated,
    token: state.auth.token,
    username: state.auth.username,
    notifications: state.notifications.notifications,
    unreadNotificationsCount: state.notifications.unreadNotificationsCount,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSignOut: () => dispatch(actions.signOutUserAsync()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavbarLayout);
