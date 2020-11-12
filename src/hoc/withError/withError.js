import { Dialog, DialogTitle, DialogContent } from "@material-ui/core";
import React, { Component } from "react";

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
        if (
          error.response &&
          (error.response.status === 500 || error.response.status === 404)
        ) {
          this.setState({ error: error.message });
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
    };

    render() {
      return (
        <div>
          <Dialog open={this.state.error} onClose={this.handleConfirmError}>
            <DialogTitle>Error</DialogTitle>
            <DialogContent>{this.state.error}</DialogContent>
          </Dialog>
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  };
};

export default withError;
