import React from "react";
import {
  Grid,
  Typography,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";
import Posts from "../../components/Posts/Posts";
import { connect } from "react-redux";
import withError from "../../hoc/withError/withError";
import axios from "axios";
import * as actions from "../../store/actions/index";
import { useEffect } from "react";
import NewPost from "../../components/Posts/NewPost/NewPost";

const useStyles = makeStyles({
  grow: {
    flexGrow: 1,
  },
  spinner: {
    margin: 25,
  },
});

const DraftsPage = (props) => {
  const classes = useStyles();
  const { onMount } = props;

  useEffect(() => {
    onMount();
  }, [onMount]);

  return (
    <div>
      <Grid container>
        <Grid style={{ flexGrow: 1 }} item sm={8}>
          <Typography style={{ margin: "10px 15px" }} variant="h3">
            Drafts
          </Typography>
          {props.drafts ? (
            <React.Fragment>
              <Posts posts={props.drafts} areDrafts />
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
  return { drafts: state.drafts.drafts };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onMount: () => dispatch(actions.getDraftsAsync()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withError(DraftsPage, axios));
