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
      owner: "select an option",
    },
  });

  const handleFormSubmit = (data) => {
    const formattedData = {
      id: 7,
      "NAME / CATEGORY": {
        name: data.name,
        category:
          data.category === "Select an option" ? "Unknown" : data.category,
      },
      "INHERENT RISK":
        data.inherentRisk === "Select an option"
          ? "Unknown"
          : data.inherentRisk,
      "SECURITY OWNER": data.owner === "" ? "Owner Unassigned" : data.source,
      "LAST REVIEWED": "",
      "SECURITY REVIEW": {
        due_date: "",
        status: "",
      },
    };

    onSubmit(formattedData);
    reset();
    onClose();
  };

  const FormInput = ({ name, label, rules, error, helperText, ...rest }) => (
    <Controller
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
              <FormInput name="website" label="Vendor Website" />
            </Grid>
            <Grid item xs={12}>
              <SelectControl
                name="category"
                label="Category"
                variant="outlined"
                options={categories}
                styleProps={{ fullWidth: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <SelectControl
                name="source"
                label="Source"
                variant="outlined"
                options={sources}
                styleProps={{ fullWidth: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <SelectControl
                name="inherentRisk"
                label="Inherent Risk"
                variant="outlined"
                options={categories}
                styleProps={{ fullWidth: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <SelectControl
                name="owner"
                label="Owner"
                variant="outlined"
                options={owners}
                styleProps={{ fullWidth: true }}
              />
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
