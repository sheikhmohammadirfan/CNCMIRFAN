import React, { useState } from "react";
import {
  Button,
  Avatar,
  Box,
  ButtonGroup,
  Grid,
  Typography,
  InputAdornment,
  Icon,
} from "@material-ui/core";
import DocumentTitle from "../Components/DocumentTitle";
import countries from "i18n-iso-countries";
import {
  DatepickerControl,
  SelectControl,
  PasswordControl,
  TextControl,
} from "../Components/Control";
// Importing desired language
import enLocale from "i18n-iso-countries/langs/en.json";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "60%",
    margin: `${theme.spacing(2)}px auto`,
    padding: theme.spacing(2),
    borderRadius: 6,
  },
  subtitle: {
    fontWeight: "bold",
    borderBottom: `${theme.spacing(2 / 3)}px solid ${theme.palette.grey[300]}`,
  },
}));

export default function Profile({ title }) {
  DocumentTitle(title);

  const classes = useStyles();

  countries.registerLocale(enLocale);
d
  const countryObj = countries.getNames("en", { select: "official" });
  const countryArray = Object.values(countryObj).map((value) => ({
    text: value,
    val: value,
  }));

  return (
    <Box>
      <Box className={classes.container}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid contrinar>
              <Typography variant="h6" className={classes.subtitle}>
                Personal Details
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextControl
                  variant="outlined"
                  size="small"
                  name="First Name"
                  gutter={false}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextControl
                  variant="outlined"
                  size="small"
                  name="Last Name"
                  gutter={false}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextControl
                  variant="outlined"
                  size="small"
                  name="Contact No."
                  gutter={false}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon>call</Icon>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <DatepickerControl
                  name="Date Of Birth"
                  size="small"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextControl
                  name="Room/Flat no, Street"
                  variant="outlined"
                  size="small"
                  fullWidth
                  gutter={false}
                />
              </Grid>
              <Grid item xs={8}>
                <TextControl
                  name="Area / Locality"
                  variant="outlined"
                  size="small"
                  fullWidth
                  gutter={false}
                />
              </Grid>
              <Grid item xs={4}>
                <TextControl
                  name="City"
                  variant="outlined"
                  size="small"
                  fullWidth
                  gutter={false}
                />
              </Grid>
              <Grid item xs={8}>
                <TextControl
                  name="State"
                  variant="outlined"
                  size="small"
                  fullWidth
                  gutter={false}
                />
              </Grid>
              <Grid item xs={4}>
                <TextControl
                  name="Pincode"
                  variant="outlined"
                  size="small"
                  fullWidth
                  gutter={false}
                />
              </Grid>
              <Grid item xs={6}>
                <SelectControl
                  name="Country"
                  options={countryArray}
                  variant="outlined"
                  styleProps={{ fullWidth: true, size: "small" }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} style={{ textAlign: "right" }}>
              <Button variant="outlined" color="primary">
                Update details
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid contrinar>
              <Typography variant="h6" className={classes.subtitle}>
                User Credentials
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Typography>Email:</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextControl
                  variant="outlined"
                  size="small"
                  name=""
                  value="mr.irshad@gmail.com"
                  disabled={true}
                  gutter={false}
                  fullWidth
                />
              </Grid>

              <Grid item xs={3}>
                <Typography>New password:</Typography>
              </Grid>
              <Grid item xs={9}>
                <PasswordControl
                  variant="outlined"
                  size="small"
                  name=""
                  gutter={false}
                  fullWidth
                />
              </Grid>

              <Grid item xs={3}>
                <Typography>Confirm password:</Typography>
              </Grid>
              <Grid item xs={9}>
                <PasswordControl
                  variant="outlined"
                  size="small"
                  name=""
                  gutter={false}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} style={{ textAlign: "right" }}>
                <Button variant="outlined" color="primary">
                  Change Password
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      {/* </ButtonGroup> */}
    </Box>
  );
}
