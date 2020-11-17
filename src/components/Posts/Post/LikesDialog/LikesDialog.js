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
import React from "react";

const LikesDialog = (props) => {
  return (
    <div>
      <Dialog fullWidth open={props.dialogOpen} onClose={props.handleClose}>
        <DialogTitle>Likes</DialogTitle>
        <DialogContent>
          {props.likes.length === 0 ? (
            <DialogContentText>There are no likes yet</DialogContentText>
          ) : (
            <List>
              {props.likes.map((like) => (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>L</Avatar>
                  </ListItemAvatar>
                  <ListItemText>{like.by.username}</ListItemText>
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
