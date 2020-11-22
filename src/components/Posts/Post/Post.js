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
  ButtonBase,
  Tooltip,
} from "@material-ui/core";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
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
import PublishDraftConfirm from "./PublishDraftConfirm/PublishDraftConfirm";
import { useEffect } from "react";
import LikesDialog from "./LikesDialog/LikesDialog";

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
  draftButtons: {
    display: "flex",
    flexDirection: "column",
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

/*This component has slightly different design based on whether or not the post is still a draft or it is a published post.
  This makes the code here a little convoluted at places, but I prefer this to making a separate component for a draft since
  I would copy most of the code that is already here.
*/
const Post = (props) => {
  const classes = useStyles();
  const [expandedState, setExpandedState] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [confirmPublishDraftOpen, setConfirmPublishDraftOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [updatePostOpen, setUpdatePostOpen] = useState(false);
  const [likesOpen, setLikesOpen] = useState(false);
  let isLikedByUser = null;
  if (props.likes) {
    isLikedByUser = props.likes.some((like) => like.by._id === props.userId);
  }

  const { posts } = props;
  let currentPost = null;

  if (posts) {
    currentPost = posts.find((post) => post._id === props.id);
  }

  useEffect(() => {}, [currentPost]);

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

  const handleUpdatePostOpen = () => {
    setUpdatePostOpen(true);
  };
  const handleUpdatePostClose = () => {
    setUpdatePostOpen(false);
  };

  const handleConfirmPublishOpen = () => {
    setConfirmPublishDraftOpen(true);
  };
  const handleConfirmPublishClose = () => {
    setConfirmPublishDraftOpen(false);
  };

  const handleConfirmDeleteOpen = () => {
    setConfirmDeleteOpen(true);
  };
  const handleConfirmDeleteClose = () => {
    setConfirmDeleteOpen(false);
  };

  const handleLikesOpen = () => {
    setLikesOpen(true);
  };

  const handleLikesClose = () => {
    setLikesOpen(false);
  };

  const handleLike = () => {
    props.onLike(props.id);
  };

  const handleUnlike = () => {
    props.onUnlike(props.id);
  };

  const postButtons = (
    <React.Fragment>
      <Tooltip
        enterTouchDelay={!props.userId ? 0 : 1000}
        title={
          !props.userId ? "Sign in to like" : !isLikedByUser ? "Like" : "Unlike"
        }
      >
        <IconButton
          disabled={props.likeIsLoading}
          onClick={props.userId && (isLikedByUser ? handleUnlike : handleLike)}
          size="small"
          aria-label="like"
        >
          <Favorite color={isLikedByUser ? "primary" : "disabled"} />
        </IconButton>
      </Tooltip>

      <Tooltip title="See who likes this post">
        <ButtonBase
          onClick={handleLikesOpen}
          style={{ marginLeft: 0, width: 25 }}
        >
          <Typography variant="subtitle1">
            {props.likes && props.likes.length}
          </Typography>
        </ButtonBase>
      </Tooltip>

      <LikesDialog
        dialogOpen={likesOpen}
        handleClose={handleLikesClose}
        likes={props.likes}
      />

      <div style={{ display: "block" }} />

      <div className={classes.grow} />
      <Button onClick={handleExpandComments} color="inherit">
        {!expandedState ? "Show" : "Hide"} comments
        <div style={{ minWidth: 7.5 }} />
        <CommentIcon />
        <ExpandMoreIcon
          className={clsx(classes.expand, {
            [classes.expandOpen]: expandedState,
          })}
        />
      </Button>
    </React.Fragment>
  );

  const draftButtons = (
    <React.Fragment>
      <Button
        onClick={handleUpdatePostOpen}
        size="small"
        color="secondary"
        variant="contained"
      >
        Edit
      </Button>

      <Button
        onClick={handleConfirmDeleteOpen}
        size="small"
        variant="contained"
      >
        Delete
      </Button>
      <div className={classes.grow} />
      <IconButton onClick={handleExpandComments}>
        <CommentIcon />
        <ExpandMoreIcon
          className={clsx(classes.expand, {
            [classes.expandOpen]: expandedState,
          })}
        />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div className={classes.root}>
      <UpdatePostForm
        dialogOpen={updatePostOpen}
        handleClose={handleUpdatePostClose}
        postId={props.id}
        postTitle={props.title}
        postContent={props.content}
        public={props.public}
        isDraft={props.isDraft}
      />
      <DeletePostConfirm
        dialogOpen={confirmDeleteOpen}
        handleClose={handleConfirmDeleteClose}
        postId={props.id}
        isDraft={props.isDraft}
      />
      <PublishDraftConfirm
        dialogOpen={confirmPublishDraftOpen}
        handleClose={handleConfirmPublishClose}
        postId={props.id}
      />
      <Slide unmountOnExit in direction="up">
        <Card>
          <CardHeader
            avatar={
              <Link
                className={classes.usernameLink}
                to={`/users/${props.author}`}
              >
                <Avatar
                  aria-label="user"
                  src={`data:image/jpeg;base64,${props.avatar}`}
                  className={classes.avatar}
                />
              </Link>
            }
            title={
              <Link
                className={classes.usernameLink}
                to={`/users/${props.author}`}
              >
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
              props.isDraft ? (
                <Button
                  onClick={handleConfirmPublishOpen}
                  color="primary"
                  variant="contained"
                >
                  Publish
                </Button>
              ) : props.authorId === props.userId ? (
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
            {props.isDraft ? draftButtons : postButtons}
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
    posts: state.posts.posts,
    likeIsLoading: state.posts.likeIsLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetComments: (postId) => dispatch(actions.getCommentsAsync(postId)),
    onLike: (postId) => dispatch(actions.likeAsync(postId)),
    onUnlike: (postId) => dispatch(actions.unlikeAsync(postId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
