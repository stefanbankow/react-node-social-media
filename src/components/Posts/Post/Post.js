import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
  Typography,
  Slide,
  Menu,
  MenuItem,
  Fade,
} from "@material-ui/core";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Favorite } from "@material-ui/icons";
import CommentIcon from "@material-ui/icons/Comment";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import DeletePostConfirm from "./DeletePostConfirm/DeletePostConfirm";
import UpdatePostForm from "./UpdatePostForm/UpdatePostForm";
import ReactTimeAgo from "react-time-ago";
import Comments from "../../Comments/Comments";
import * as actions from "../../../store/actions/index";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  root: {
    width: "100%",
    margin: "20px auto",
    textAlign: "left",
  },
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
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
}));

const Post = (props) => {
  const classes = useStyles();
  const [expandedState, setExpandedState] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [updatePostOpen, setUpdatePostOpen] = useState(false);

  const handleExpandComments = () => {
    setExpandedState((prevState) => {
      return !prevState;
    });
    !expandedState && props.onGetComments(props.id);
  };

  const handleOpenMenu = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const handleConfirmDeleteOpen = () => {
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDeleteClose = () => {
    setConfirmDeleteOpen(false);
  };

  const handleUpdatePostOpen = () => {
    setUpdatePostOpen(true);
  };

  const handleUpdatePostClose = () => {
    setUpdatePostOpen(false);
  };

  return (
    <div className={classes.root}>
      <DeletePostConfirm
        dialogOpen={confirmDeleteOpen}
        handleClose={handleConfirmDeleteClose}
        postId={props.id}
      />
      <UpdatePostForm
        dialogOpen={updatePostOpen}
        handleClose={handleUpdatePostClose}
        postId={props.id}
        postTitle={props.title}
        postContent={props.content}
        public={props.public}
      />
      <Slide unmountOnExit in direction="up">
        <Card>
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
            subheader={
              <ReactTimeAgo
                date={props.createdAt}
                locale="en-US"
                timeStyle="round-minute"
              />
            }
            //If the author of the post and the logged user match, give show the options menu, otherwise dont show anything there
            action={
              props.authorId === props.userId ? (
                <div>
                  <IconButton onClick={handleOpenMenu}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={handleCloseMenu}
                    TransitionComponent={Fade}
                  >
                    <MenuItem onClick={handleUpdatePostOpen}>Update</MenuItem>
                    <MenuItem onClick={handleConfirmDeleteOpen}>
                      Delete
                    </MenuItem>
                  </Menu>
                </div>
              ) : null
            }
          />
          <CardContent>
            <Typography variant="h5" color="textPrimary" component="p">
              {props.title}
            </Typography>
            <Typography variant="body1" color="textSecondary" component="p">
              {props.content}
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton aria-label="like">
              <Favorite color="primary" />
            </IconButton>
            <IconButton aria-label="see comments">
              <CommentIcon />
            </IconButton>
            <div className={classes.grow} />
            <Button onClick={handleExpandComments} color="inherit">
              {!expandedState ? "See" : "Hide"} comments
              <ExpandMoreIcon
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expandedState,
                })}
              />
            </Button>
          </CardActions>
          <Collapse in={expandedState} unmountOnExit>
            <Comments postId={props.id} />
          </Collapse>
        </Card>
      </Slide>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.auth.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetComments: (postId) => dispatch(actions.getCommentsAsync(postId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
