import { Dialog, Tab, Tabs, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import ChangePassword from "./ChangePassword/ChangePassword";
import EditAbout from "./EditAbout/EditAbout";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const UserSettings = (props) => {
  const classes = useStyles();

  const [indexValue, setIndexValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setIndexValue(newValue);
  };
  return (
    <div>
      <Dialog
        className={classes.root}
        fullWidth
        open={props.dialogOpen}
        onClose={props.handleClose}
      >
        <Tabs
          indicatorColor="primary"
          className={classes.tabs}
          value={indexValue}
          onChange={handleTabChange}
          scrollButtons="on"
          variant="scrollable"
        >
          <Tab label="Edit About Info" />
          <Tab label="Change Password" />
        </Tabs>
        <EditAbout
          value={indexValue}
          index={0}
          handleClose={props.handleClose}
        />
        <ChangePassword
          value={indexValue}
          index={1}
          handleClose={props.handleClose}
        />
      </Dialog>
    </div>
  );
};

export default UserSettings;
