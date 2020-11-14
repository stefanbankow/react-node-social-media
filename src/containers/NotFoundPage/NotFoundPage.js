import { Button } from "@material-ui/core";
import React from "react";

const NotFoundPage = (props) => {
  const handleRedirect = () => {
    props.history.replace("/");
  };
  return (
    <div>
      <h1 style={{ margin: "10px 20px 10px 20px" }}>404 Not found</h1>
      <h5 style={{ margin: "10px 20px 10px 20px" }}>
        The resource you were looking for could not be found
      </h5>
      <Button
        onClick={handleRedirect}
        variant="outlined"
        style={{ margin: 20 }}
        color="secondary"
      >
        Back to home page
      </Button>
    </div>
  );
};

export default NotFoundPage;
