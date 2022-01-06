import { Box, Button, CircularProgress, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
  gapi_signin,
  GAPI_SIGNIN_STATUS,
  gapi_signout,
  showPicker,
} from "../Service/GAPI";

function Drive() {
  const [googleStatus, setGoogleStatus] = useState(GAPI_SIGNIN_STATUS);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setGoogleStatus(GAPI_SIGNIN_STATUS);
      setloading(false);
    }, 3000);
  }, []);

  return (
    <Box padding={2} textAlign="center">
      <Button
        variant="contained"
        color="primary"
        style={{ minWidth: "50%" }}
        onClick={async () => {
          if (!loading) {
            setloading(true);
            if (!googleStatus) {
              const status = await gapi_signin();
              console.log("GAPI", status);
              setTimeout(() => {
                setGoogleStatus(true);
                setloading(false);
              }, 2000);
            } else {
              showPicker();
              setloading(false);
            }
          }
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : googleStatus ? (
          "Pick GDRIVE file"
        ) : (
          "LOGIN GOOGLE ACCOUNT"
        )}
      </Button>

      <br />
      <br />

      <Typography>No file selected.</Typography>

      <br />
      <br />
      {googleStatus && (
        <Button
          variant="outlined"
          color="secondary"
          style={{ minWidth: "50%" }}
          onClick={() => {
            gapi_signout();
            setGoogleStatus(false);
          }}
        >
          Sign out
        </Button>
      )}
    </Box>
  );
}

export default Drive;
