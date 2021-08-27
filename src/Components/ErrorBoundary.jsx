import { Box, Button, Typography } from "@material-ui/core";
import React from "react";
import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDriverStateFromError(error) {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.log("Logging", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box>
          <Typography variant="h2">There was a problem</Typography>
          <Button variant="primary" onClick={this.state.history.push("/")}>
            Navigate Home!
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
