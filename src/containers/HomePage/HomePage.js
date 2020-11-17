import React, { useEffect } from "react";
import Posts from "../../components/Posts/Posts";
import { Grid, makeStyles, CircularProgress } from "@material-ui/core";
import NewPost from "../../components/Posts/NewPost/NewPost";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import withError from "../../hoc/withError/withError";
import axios from "axios";
//import { Waypoint } from "react-waypoint";

const useStyles = makeStyles({
  grow: {
    flexGrow: 1,
  },
  spinner: {
    margin: 25,
  },
});

const HomePage = (props) => {
  const classes = useStyles();

  const { onMount, postsReset } = props;

  useEffect(() => {
    postsReset();
    onMount();
  }, [onMount, postsReset]);

  /*   const handleBottomReached = (e) => {
    console.log("Bottom!");
  };

  const handleBottomLeft = (e) => {
    console.log("No Bottom!");
  }; */

  return (
    <div>
      <Grid container>
        <Grid style={{ flexGrow: 1 }} item sm={8}>
          {props.posts ? (
            <React.Fragment>
              <Posts posts={props.posts} />
              {/* <Waypoint
                onEnter={handleBottomReached}
                onLeave={handleBottomLeft}
              /> */}
            </React.Fragment>
          ) : (
            <div style={{ textAlign: "center" }}>
              <CircularProgress size={90} className={classes.spinner} />
            </div>
          )}
        </Grid>
      </Grid>
      <NewPost />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { posts: state.posts.posts };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onMount: () => dispatch(actions.getPostsAsync()),
    postsReset: () => dispatch(actions.postsReset()),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withError(HomePage, axios));
