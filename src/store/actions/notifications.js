import axios from "axios";
import * as actionTypes from "./actionTypes";

export const notificationRequestInit = () => {
  return {
    type: actionTypes.NOTIFICATION_REQUEST_INIT,
  };
};

export const getNotificationsSuccess = (
  notifications,
  notificationCount,
  unreadNotificationCount
) => {
  return {
    type: actionTypes.GET_NOTIFICATIONS_SUCCESS,
    notifications,
    notificationCount,
    unreadNotificationCount,
  };
};

export const getNotificationsFailure = (errors) => {
  return {
    type: actionTypes.GET_NOTIFICATIONS_FAILURE,
    errors,
  };
};

export const getNotificationsAsync = () => {
  return (dispatch) => {
    dispatch(notificationRequestInit());
    axios
      .get("/notifications")
      .then((res) => {
        dispatch(
          getNotificationsSuccess(
            res.data.notifications,
            res.data.notificationCount,
            res.data.unreadNotificationCount
          )
        );
      })
      .catch((err) => {
        console.error(err);
        dispatch(getNotificationsFailure(err));
      });
  };
};

export const addNotificationsSuccess = (notifications) => {
  return {
    type: actionTypes.ADD_NOTIFICATIONS_SUCCESS,
    notifications,
  };
};

export const addNotificationsFailure = (errors) => {
  return {
    type: actionTypes.ADD_NOTIFICATIONS_FAILURE,
    errors,
  };
};

export const addNotificationsAsync = (lastNotiDate) => {
  return (dispatch) => {
    const paramsString = `before=${lastNotiDate}`;
    const urlParams = new URLSearchParams(paramsString);

    dispatch(notificationRequestInit());
    axios
      .get(`/notifications?${urlParams.toString()}`)
      .then((res) => {
        dispatch(addNotificationsSuccess(res.data.notifications));
      })
      .catch((err) => {
        console.error(err);
        dispatch(addNotificationsFailure(err));
      });
  };
};

//Handled by events
export const newNotification = (notification) => {
  return {
    type: actionTypes.NEW_NOTIFICATION,
    notification,
  };
};

export const readNotifications = () => {
  return {
    type: actionTypes.READ_NOTIFICATIONS,
  };
};

export const deleteOneNotification = (notificationId) => {
  return {
    type: actionTypes.DELETE_ONE_NOTIFICATION,
    notificationId,
  };
};

export const deleteNotifications = (notificationIds) => {
  return {
    type: actionTypes.DELETE_NOTIFICATIONS,
    notificationIds,
  };
};
