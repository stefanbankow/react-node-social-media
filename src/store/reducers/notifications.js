import * as actionTypes from "../actions/actionTypes";

const initialState = {
  notifications: null,
  isLoading: false,
  errors: {},
  lastNotificationDate: null,
  unreadNotificationsCount: 0,
  notificationCount: 0,
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.NOTIFICATION_REQUEST_INIT:
      return {
        ...state,
        isLoading: true,
        errors: {},
      };
    case actionTypes.GET_NOTIFICATIONS_SUCCESS:
      if (action.notificationCount > 0) {
        return {
          ...state,
          isLoading: false,
          notifications: [...action.notifications],
          unreadNotificationsCount: action.unreadNotificationCount,
          lastNotificationDate:
            action.notifications[action.notifications.length - 1].createdAt,
          notificationCount: action.notificationCount,
        };
      }
      return {
        ...state,
        isLoading: false,
        notifications: [],
      };

    case actionTypes.GET_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.errors,
      };
    case actionTypes.ADD_NOTIFICATIONS_SUCCESS:
      //This is done to simulate that notifications are marked as read while scrolling, when in reality they read upon closing the dialog
      const readNotifications = [...state.notifications];
      readNotifications.forEach((notification) => (notification.read = true));
      return {
        ...state,
        isLoading: false,
        notifications: [...state.notifications, ...action.notifications],
        lastNotificationDate:
          action.notifications[action.notifications.length - 1].createdAt,
        notificationCount: action.notificationCount,
      };

    case actionTypes.ADD_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.errors,
      };

    //Actions triggered by events
    case actionTypes.NEW_NOTIFICATION:
      if (state.notifications) {
        action.notification.new = true;
        return {
          ...state,
          notifications: [action.notification, ...state.notifications],
          notificationCount: state.notificationCount + 1,
          unreadNotificationsCount: state.unreadNotificationsCount + 1,
        };
      } else {
        return state;
      }
    case actionTypes.READ_NOTIFICATIONS:
      if (state.notifications) {
        let newNotifications = [...state.notifications];
        newNotifications.forEach((notification) => {
          notification.read = true;
        });

        return {
          ...state,
          notifications: newNotifications,
          unreadNotificationsCount: 0,
        };
      } else {
        return state;
      }
    case actionTypes.DELETE_ONE_NOTIFICATION:
      let updatedNotifications = [...state.notifications];

      let notificationToDelete = updatedNotifications.find(
        (notification) => notification._id === action.notificationId
      );
      updatedNotifications = updatedNotifications.filter(
        (notification) => notification._id !== action.notificationId
      );
      if (notificationToDelete && notificationToDelete.read === false) {
        return {
          ...state,
          notifications: updatedNotifications,
          notificationCount: updatedNotifications.length,
          unreadNotificationsCount: state.unreadNotificationsCount - 1,
        };
      } else {
        return {
          ...state,
          notifications: updatedNotifications,
          notificationCount: updatedNotifications.length,
        };
      }

    case actionTypes.DELETE_NOTIFICATIONS:
      let updatedNotifications2 = [...state.notifications];
      let unreadCount = 0;

      let notisToDel = updatedNotifications2.filter((notification) =>
        action.notificationIds.includes(notification._id)
      );

      notisToDel.forEach((notification) => {
        if (!notification.read) {
          unreadCount++;
        }
      });

      updatedNotifications2 = updatedNotifications2.filter(
        (notification) => !action.notificationIds.includes(notification._id)
      );

      return {
        ...state,
        notifications: updatedNotifications2,
        notificationCount: updatedNotifications2.length,
        unreadNotificationsCount: state.unreadNotificationsCount - unreadCount,
      };

    default:
      return state;
  }
};

export default notificationReducer;
