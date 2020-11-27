import {
  AppBar,
  Dialog,
  IconButton,
  List,
  Slide,
  Toolbar,
  Typography,
  makeStyles,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { forwardRef } from "react";
import { connect } from "react-redux";
import Notification from "./Notification/Notification";
import { Waypoint } from "react-waypoint";
import { addNotificationsAsync } from "../../store/actions/index";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
}));

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Notifications = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const smallScreen = !useMediaQuery(theme.breakpoints.up("sm"));

  const handleAddMoreNotifications = () => {
    props.onAddMoreNotifications(props.lastNotiDate);
  };
  return (
    <div>
      <Dialog
        fullScreen
        open={props.dialogOpen}
        onClose={props.handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar} color="secondary">
          <Toolbar>
            <Typography variant="h6">Notifications</Typography>
            <div style={{ flexGrow: 1 }} />
            <IconButton onClick={props.handleClose}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        {!props.notifications ? (
          <CircularProgress />
        ) : props.notifications.length > 0 ? (
          <List>
            {props.notifications.map((notification) => (
              <Notification
                key={notification._id}
                id={notification._id}
                authorId={notification.by._id}
                authorUsername={notification.by.username}
                read={notification.read}
                type={notification.type}
                onPost={notification.onPost}
                createdAt={notification.createdAt}
                new={notification.new}
              />
            ))}
            {props.notificationCount > props.notifications.length && (
              <Waypoint onEnter={handleAddMoreNotifications}>
                <Typography
                  style={{ textAlign: "center", marginTop: 10 }}
                  variant="h6"
                >
                  <CircularProgress color="secondary" />
                  <div />
                  Loading more notifications
                </Typography>
              </Waypoint>
            )}
          </List>
        ) : (
          <Typography
            style={{ margin: "auto", padding: "40", textAlign: "center" }}
            variant="h6"
          >
            You don't have any {smallScreen && <br />}notifications yet
          </Typography>
        )}
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    notifications: state.notifications.notifications,
    notificationCount: state.notifications.notificationCount,
    lastNotiDate: state.notifications.lastNotificationDate,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddMoreNotifications: (lastNotiDate) =>
      dispatch(addNotificationsAsync(lastNotiDate)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
