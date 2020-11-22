import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  DialogActions,
  DialogContentText,
  Divider,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import React from "react";

const LikesDialog = (props) => {
  return (
    <div>
      <Dialog fullWidth open={props.dialogOpen} onClose={props.handleClose}>
        <DialogTitle>Likes</DialogTitle>
        <DialogContent>
          {props.likes.length === 0 ? (
            <DialogContentText>
              There are no likes yet, be the first one to like this!
            </DialogContentText>
          ) : (
            <List>
              {props.likes.map((like) => (
                <ListItem key={like._id}>
                  <ListItemAvatar>
                    <Link to={`/users/${like.by.username}`}>
                      <Avatar
                        src={`data:image/jpeg;base64,${like.by.avatar}`}
                      />
                    </Link>
                  </ListItemAvatar>
                  <ListItemText>
                    <Link to={`/users/${like.by.username}`}>
                      {like.by.username}
                    </Link>
                  </ListItemText>
                  <Divider />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LikesDialog;
