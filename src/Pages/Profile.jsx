import React, { useState } from "react";
import {
  Button,
  Avatar,
  Box,
  ButtonGroup,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { FormProvider, useForm } from "react-hook-form";
import { getUser } from "../Service/UserFactory";
import FormTextInput from "../Components/Form/FormTextInput";
import FormDropdown from "../Components/Form/FormDropdown";
import DocumentTitle from "../Components/DocumentTitle";
import countries from "i18n-iso-countries";
// Importing desired language
import enLocale from "i18n-iso-countries/langs/en.json";
import { FormDateInput } from "../Components/Form/FormDateInput";

const defaultValues = {
  firstName: "",
  lastName: "",
  newPassword: "",
  confirmPassword: "",
  mobilePhone: "",
  country: "",
  city: "",
};

const useStyle = makeStyles((theme) => ({
  nameBox: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "baseline",
    // columnGap: "3.2rem",
  },
  profileBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    // width: "60%",
    border: "1",
    borderBottomLeftRadius: "6px",
    borderBottomRightRadius: "6px",
    borderTop: `3px solid ${theme.palette.primary.main}`,
    padding: "0.6rem 1.15rem",
    boxShadow: "1px 2px 6px rgba(0,0,0,0.3)",
  },
}));

export default function Profile({ title }) {
  DocumentTitle(title);

  countries.registerLocale(enLocale);

  const classes = useStyle();
  const userDetails = getUser();
  const lastUpdated = new Date(userDetails.updated_at).toLocaleString(
    undefined,
    {
      timeZone: "Asia/Kolkata",
    }
  );
  const countryObj = countries.getNames("en", { select: "official" });
  const countryArray = Object.entries(countryObj).map(([key, value]) => {
    return {
      label: value,
      value: value,
    };
  });
  const methods = useForm({ defaultValues: defaultValues });
  const { handleSubmit, reset, register, control, watch } = methods;

  const onSubmit = (data) => console.log(data);

  return (
    <Box
      component="div"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexWrap="wrap"
      padding="1rem"
      // height="100%"
      // width="100%"
    >
      <Box component="div" className={classes.profileBox}>
        <FormProvider {...methods}>
          <Box
            style={{
              marginBottom: "1rem",
              borderBottom: "1px solid #aaa",
            }}
          >
            <Box component="div" className={classes.nameBox}>
              <FormTextInput
                type="text"
                name="firstName"
                label="First Name"
                control={control}
              />
              <FormTextInput
                type="text"
                name="lastName"
                label="Last Name"
                control={control}
              />
            </Box>
            <FormTextInput
              type="email"
              name="email"
              label="Email"
              control={control}
              defaultValue={userDetails.email}
              disabled={true}
            />
          </Box>
          <Box
            component="div"
            className={classes.nameBox}
            style={{ columnGap: "1.5rem" }}
          >
            <FormTextInput
              type="number"
              name="mobilePhone"
              label="Mobile Phone"
              control={control}
            />
            <FormDateInput
              name="birthDate"
              label="Birth Date"
              control={control}
            />
          </Box>

          {/* <FormTextInput
            type="password"
            name="newPassword"
            label="New Password"
            control={control}
          />
          <FormTextInput
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            control={control}
          /> */}
          <Box component="div" className={classes.nameBox}>
            <FormDropdown
              name="country"
              label="Country"
              control={control}
              options={countryArray}
            />

            <FormTextInput name="city" label="City" control={control} />
          </Box>
        </FormProvider>
        <Box component="label">Last Updated</Box>
        <Typography
          style={{
            color: "#aaa",
            borderBottom: "1px solid #000",
            marginBottom: "1rem",
          }}
        >
          {lastUpdated}
        </Typography>

        <Button
          type="submit"
          color="primary"
          variant="contained"
          style={{ marginLeft: "auto" }}
          onClick={() => handleSubmit(onSubmit)}
        >
          update
        </Button>
      </Box>
      {/* </ButtonGroup> */}
    </Box>
  );
}
