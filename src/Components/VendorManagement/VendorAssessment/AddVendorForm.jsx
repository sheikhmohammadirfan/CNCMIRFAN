import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Divider,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { SelectControl, TextControl } from "../../Utils/Control";

const AddVendorForm = ({
  open,
  onClose,
  onSubmit,
  categories,
  sources,
  riskLevels,
  owners,
}) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      website: "",
      category: "Select an option",
      source: "Select an option",
      inherentRisk: "Select an option",
      owner: "Select an option",
    },
  });

  const handleFormSubmit = async (data) => {
    const formattedData = {
      vendor_name: data.name,
      category:
        data.category === "Select an option" ? "Unknown" : data.category,
      source: data.source === "Select an option" ? "Unknown" : data.source,
      inherent_risk:
        data.inherentRisk === "Select an option"
          ? "Unknown"
          : data.inherentRisk,
      number_of_accounts: 102,
      date_discovered: new Date(),
      website: data.website ? data.website : "Unknown",
      auth_method: "SSO",
      linked_apps: null,
      managed: true,
    };
    const status = await onSubmit(formattedData);
    if (status) {
      reset();
      onClose();
    }
  };

  const FormInput = ({ name, label, rules, error, helperText, ...rest }) => (
    <Controller
      sx={{ fullWidth: true }}
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <TextControl
          fullWidth
          variant="outlined"
          label={label}
          error={error}
          helperText={helperText}
          InputLabelProps={{ shrink: true }}
          {...field}
          {...rest}
        />
      )}
    />
  );

  const FormSelect = ({ name, label, options, ...rest }) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <SelectControl
          styleProps={{ fullWidth: true }}
          variant="outlined"
          label={label}
          options={options}
          {...field}
        />
      )}
    />
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add Vendor</DialogTitle>
      <Divider />
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          noValidate
          autoComplete="off"
        >
          <Typography variant="subtitle1" gutterBottom>
            Basic details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormInput
                name="name"
                label="Vendor Name"
                rules={{ required: "Vendor name is required" }}
                error={!!errors.name}
                helperText={errors.name ? errors.name.message : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                name="website"
                label="Vendor Website"
                rules={{ required: "Vendor website is required" }}
                error={!!errors.website}
                helperText={errors.website ? errors.website.message : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <FormSelect
                name="category"
                label="Category"
                options={categories}
                rules={{ required: "Vendor categories is required" }}
                error={!!errors.category}
                helperText={errors.category ? errors.category.message : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <FormSelect name="source" label="Source" options={sources} />
            </Grid>
            <Grid item xs={12}>
              <FormSelect
                name="inherentRisk"
                label="Inherent Risk Level"
                options={riskLevels}
              />
            </Grid>
            <Grid item xs={12}>
              <FormSelect name="owner" label="Owner" options={owners} />
            </Grid>
          </Grid>

          <DialogActions>
            <Button variant="outlined" onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button variant="contained" type="submit" color="primary">
              Add Vendor
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddVendorForm;
