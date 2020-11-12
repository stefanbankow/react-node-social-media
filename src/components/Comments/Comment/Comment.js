import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  makeStyles,
} from "@material-ui/core";
import React from "react";
import ReactTimeAgo from "react-time-ago";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { connect } from "react-redux";
import { useState } from "react";
import DeleteCommentConfirm from "./DeleteCommentConfirm/DeleteCommentConfirm";
import UpdateCommentForm from "./UpdateCommentForm/UpdateCommentForm";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: "secondary",
  },
  usernameLink: {
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.dark,
      textDecoration: "none",
    },
  },
}));

const Comment = (props) => {
  const classes = useStyles();

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [updateFormOpen, setUpdateFormOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const handleOpenMenu = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const handleUpdateFormOpen = () => {
    setUpdateFormOpen(true);
  };

  const handleUpdateFormClose = () => {
    setUpdateFormOpen(false);
  };

  const handleConfirmDeleteOpen = () => {
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDeleteClose = () => {
    setConfirmDeleteOpen(false);
  };
  return (
    <div>
      <DeleteCommentConfirm
        dialogOpen={confirmDeleteOpen}
        handleClose={handleConfirmDeleteClose}
        postId={props.postId}
        commentId={props.id}
      />
      <UpdateCommentForm
        dialogOpen={updateFormOpen}
        handleClose={handleUpdateFormClose}
        postId={props.postId}
        commentId={props.id}
        commentBody={props.content}
      />
      <CardHeader
        avatar={
          <Link className={classes.usernameLink} to={`/${props.author}`}>
            <Avatar aria-label="user" className={classes.avatar}>
              P
            </Avatar>{" "}
          </Link>
        }
        title={
          <Link className={classes.usernameLink} to={`/${props.author}`}>
            {props.author}
          </Link>
        }
        //avatar={<Avatar>U</Avatar>}
        //title={props.author}
        subheader={
          <ReactTimeAgo
            date={props.createdAt}
            locale="en-US"
            timeStyle="round-minute"
          />
        }
        action={
          props.author === props.authUsername && (
            <IconButton onClick={handleOpenMenu}>
              <MoreVertIcon />
            </IconButton>
          )
        }
      />
      <Menu
        anchorEl={menuAnchor}
        onClose={handleCloseMenu}
        open={Boolean(menuAnchor)}
      >
        <MenuItem onClick={handleUpdateFormOpen}>Update</MenuItem>
        <MenuItem onClick={handleConfirmDeleteOpen}>Delete</MenuItem>
      </Menu>
      <CardContent>
        <Typography>{props.content}</Typography>
      </CardContent>
      <Divider />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    authUsername: state.auth.username,
  };
};
export default connect(mapStateToProps)(Comment);
