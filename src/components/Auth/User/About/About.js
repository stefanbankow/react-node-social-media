import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  DialogActions,
  Button,
} from "@material-ui/core";
import React from "react";

const About = (props) => {
  return (
    <div>
      <Dialog fullWidth onClose={props.handleClose} open={props.dialogOpen}>
        <DialogTitle>About</DialogTitle>
        <DialogContent>
          <Typography variant="h6">
            Age:{" "}
            <Typography variant="body1">
              {props.age ? props.age : "Not specified"}
            </Typography>
          </Typography>
          <Typography variant="h6">
            Country:{" "}
            <Typography variant="body1">
              {props.country ? props.country : "Not specified"}
            </Typography>
          </Typography>
          <Typography variant="h6">
            About:{" "}
            <Typography variant="body1">
              {props.about ? props.about : "Not specified"}
            </Typography>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default About;
