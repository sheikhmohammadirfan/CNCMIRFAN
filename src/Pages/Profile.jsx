import React, { useState } from "react";
import { Button, Avatar, Box, ButtonGroup } from "@material-ui/core";
import { FormProvider, useForm } from "react-hook-form";
import FormTextInput from "../Components/Form/FormTextInput";
import FormDropdown from "../Components/Form/FormDropdown";
import DocumentTitle from "../Components/DocumentTitle";
import countries from "i18n-iso-countries";
// Importing desired language
import enLocale from "i18n-iso-countries/langs/en.json";

const defaultValues = {
  name: "",
  newPassword: "",
  confirmPassword: "",
  country: "",
};

export default function Profile({ title }) {
  DocumentTitle(title);

  countries.registerLocale(enLocale);

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
      justifyContent="space-between"
      flexWrap="wrap"
      padding="1rem"
      height="100%"
      width="100%"
    >
      <Box
        component="div"
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        width="50%"
      >
        <FormProvider {...methods}>
          <FormTextInput
            type="email"
            name="name"
            label="Name"
            control={control}
          />
          <FormTextInput
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
          />
          <FormDropdown
            name="country"
            label="Country"
            control={control}
            options={countryArray}
          />
        </FormProvider>
        {/* <ButtonGroup fullWidth style={{ marginTop: "auto" }}> */}
        {/* <Button color="primary" variant="outlined">
          save
        </Button> */}
        <Button
          type="submit"
          color="primary"
          variant="contained"
          onClick={handleSubmit(onSubmit)}
        >
          update
        </Button>
        {/* </ButtonGroup> */}
      </Box>
    </Box>
  );
}
