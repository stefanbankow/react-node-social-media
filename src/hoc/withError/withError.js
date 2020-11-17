import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
  Divider,
} from "@material-ui/core";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";

const withError = (WrappedComponent, axios) => {
  return class extends Component {
    state = {
      error: null,
    };

    componentDidMount() {
      this.reqInterceptor = axios.interceptors.request.use((req) => {
        this.setState({ error: null });
        return req;
      });

      this.resInterceptor = axios.interceptors.response.use(null, (error) => {
        if (error.response) {
          switch (error.response.status) {
            case 500:
              this.setState({
                error: {
                  code: "500 Internal Server Error",
                  message: "An internal server error occured",
                },
              });
              break;
            case 404:
              this.setState({
                error: {
                  code: "404 Not found",
                  message:
                    "The resource you are looking for could not be found",
                },
              });
              break;
            case 401:
              this.setState({
                error: {
                  code: "401 Unauthorized",
                  message:
                    "You do not have access to this resource, you can try logging in or signing up",
                },
              });
              break;
            default:
              break;
          }
        }
        throw error;
      });
    }

    componentWillUnmount() {
      axios.interceptors.request.eject(this.reqInterceptor);
      axios.interceptors.response.eject(this.resInterceptor);
    }

    handleConfirmError = () => {
      this.setState({
        error: null,
      });
      this.props.history.push("/");
    };

    render() {
      return (
        <div>
          <Dialog
            //Using Boolean() in order to comply with propTypes
            open={Boolean(this.state.error)}
            onClose={this.handleConfirmError}
          >
            <DialogTitle>
              {this.state.error && this.state.error.code}
            </DialogTitle>
            <DialogContent>
              {this.state.error && this.state.error.message}
              <p />
              <Divider />
              You will be redirected to the home page upon closing this dialog
            </DialogContent>
            <DialogActions>
              <Button color="secondary" onClick={this.handleConfirmError}>
                Back to Home Page
              </Button>
            </DialogActions>
          </Dialog>
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  };
};

export default withError;
