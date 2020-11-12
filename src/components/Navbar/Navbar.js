import React from "react";
import { makeStyles, fade } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import NotificationsIcon from "@material-ui/icons/Notifications";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { Link, NavLink } from "react-router-dom";
import { colors } from "@material-ui/core";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import ButtonBase from "@material-ui/core/ButtonBase";

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

  const handleSignOut = () => {
    props.onSignOut();
    props.history.replace("/");
  };

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
      <IconButton size="large">
        <NotificationsIcon />
      </IconButton>
      <Link to={`/${props.username}`}>
        <IconButton size="large">
          <AccountCircleIcon />
        </IconButton>
      </Link>
      <IconButton
        disabled={props.isLoading}
        onClick={handleSignOut}
        size="large"
      >
        <ExitToAppIcon />
      </IconButton>
    </div>
  );
  return (
    <AppBar style={{ minHeight: "20px" }} position="static">
      <Toolbar>
        <Link
          className={classes.titleLink}
          to={{ pathname: "/", state: { from: props.location } }}
        >
          <ButtonBase component={Typography}>
            <Typography variant="h6" className={classes.title}>
              Social Media
            </Typography>
          </ButtonBase>
        </Link>

        <div className={classes.grow}></div>

        {props.isAuthenticated ? userButtons : authButtons}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSignOut: () => dispatch(actions.signOutUserAsync()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavbarLayout);
