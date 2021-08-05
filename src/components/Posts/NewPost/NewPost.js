import React, { useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/styles";

import NewPostForm from "./NewPostForm/NewPostForm";

const useStyles = makeStyles((theme) => ({
  fixedPosition: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
}));

const NewPost = (props) => {
  const classes = useStyles();
  const [formOpen, setFormOpen] = useState(false);

  //Had to split handleClick into two different handlers(one for open and one for close) because otherwise the form opened when opening your own user profile
  const handleOpen = () => {
    setFormOpen(true);
  };

  const handleCancel = () => {
    setFormOpen(false);
  };

  return (
    <div>
      {
        //Had to use these props so that the transition could function properly
      }
      <NewPostForm
        isOpen={formOpen}
        onOpen={handleOpen}
        onCancel={handleCancel}
      />

      <Tooltip title="Create a post">
        <Fab
          onClick={handleOpen}
          className={classes.fixedPosition}
          color="primary"
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </div>
  );
};

export default NewPost;
