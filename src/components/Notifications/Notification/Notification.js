import {
  ListItem,
  ListItemText,
  Divider,
  Slide,
  ListItemIcon,
} from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import CommentIcon from "@material-ui/icons/Comment";
import React from "react";
import ReactTimeAgo from "react-time-ago/commonjs/ReactTimeAgo";

const Notification = (props) => {
  const likeNotification = (
    <React.Fragment>
      <Slide in={true} direction={props.new ? "down" : "up"}>
        <ListItem button selected={!props.read}>
          <ListItemIcon>
            <FavoriteIcon />
          </ListItemIcon>
          <ListItemText
            secondary={
              <ReactTimeAgo
                date={props.createdAt}
                locale="en-US"
                timeStyle="round-minute"
              />
            }
          >
            <strong>{props.authorUsername}</strong> liked your post titled: "
            <strong>{props.onPost && props.onPost.title}</strong>"
          </ListItemText>
        </ListItem>
      </Slide>
      <Divider />
    </React.Fragment>
  );

  const commentNotification = (
    <React.Fragment>
      <Slide in={true} direction={props.new ? "down" : "up"}>
        <ListItem button selected={!props.read}>
          <ListItemIcon>
            <CommentIcon />
          </ListItemIcon>
          <ListItemText
            secondary={
              <ReactTimeAgo
                date={props.createdAt}
                locale="en-US"
                timeStyle="round-minute"
              />
            }
          >
            <strong>{props.authorUsername}</strong> commented on your post
            titled: "<strong>{props.onPost && props.onPost.title}</strong>"
          </ListItemText>
        </ListItem>
      </Slide>
      <Divider />
    </React.Fragment>
  );
  return (
    <div>{props.type === "like" ? likeNotification : commentNotification}</div>
  );
};

export default Notification;
