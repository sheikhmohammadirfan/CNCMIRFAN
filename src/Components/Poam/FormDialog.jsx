import { Box, Button, Grid, makeStyles, Typography } from "@material-ui/core";
import DialogBox from "../Utils/DialogBox";
import React, { useState } from "react";
import { poam_header } from "../../assets/data/PoamData";
import {
  DatepickerControl,
  SelectControl,
  Form,
  RadioControl,
  SliderControl,
  TextControl,
} from "../Control";
import CustomAccordion from "../Utils/CustomAccordion";
import SupportingDocuments from "./SupportingDocuments";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

// Style generator
const useStyle = makeStyles((theme) => ({
  form_root: {
    "& .MuiAccordion-root": {
      boxShadow: "none",
      border: `1px solid ${theme.palette.grey[400]}`,
    },
  },
}));

// Accrodion title wrapper
const TitleWrapper = ({ text }) => (
  <Typography variant="h6" style={{ fontWeight: "bold" }}>
    {text}
  </Typography>
);

// Custom input compoent
const FormInput = ({ ...rest }) => (
  <TextControl
    variant="outlined"
    gutter={false}
    fullWidth
    multiline
    maxRows={20}
    {...rest}
  />
);

// MAIN FORM COMPONENT
function FormDialog({ open, onClose, rowIndex, onSubmit, rows }) {
  const classes = useStyle();

  // Loading status for dialog
  const [isLoading, setisLoading] = useState(false);

  const controlsList = ["RA-5", "SA-9", "PF-07"];
  const sliderInput = [
    { value: 0, label: "Low" },
    { value: 50, label: "Moderate" },
    { value: 100, label: "High" },
  ];

  const defaultValues = {};

  for (var name of poam_header)
    defaultValues[name] =
      rowIndex === -1
        ? name.toLowerCase().includes("date")
          ? undefined
          : ""
        : rows[name][rowIndex];

  const { handleSubmit, control } = useForm({ defaultValues });

  const submitForm = async (data) => {
    setisLoading(true);
    await onSubmit(data);
    setisLoading(false);
  };

  return (
    <DialogBox
      open={open}
      title={
        <Typography style={{ fontWeight: "bold" }}>
          {rowIndex !== -1 ? "Edit Row" : "Create New Row"}
        </Typography>
      }
      loading={isLoading}
      content={
        <Box>
          <Form
            id="create-poam-form"
            control={control}
            onSubmit={handleSubmit(submitForm)}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormInput name="POAM ID" disabled />
              </Grid>

              <Grid item xs={12} sm={6}>
                <SelectControl
                  name="Controls"
                  variant="outlined"
                  styleProps={{ fullWidth: true }}
                  options={controlsList}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomAccordion
                  name="weakness"
                  summary={<TitleWrapper text="Weakness" />}
                  details={
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormInput name="Weakness Name" />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormInput name="Weakness Description" />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormInput name="Weakness Detector Source" />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormInput name="Weakness Source Identifier" />
                      </Grid>
                    </Grid>
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <FormInput name="Asset Identifier" />
              </Grid>

              <Grid item xs={12}>
                <FormInput name="Point of Contact" />
              </Grid>

              <Grid item xs={12}>
                <FormInput name="Resources Required" />
              </Grid>

              <Grid item xs={12}>
                <FormInput name="Overall Remediation Plan" />
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <DatepickerControl
                      name="Original Detection Date"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <DatepickerControl
                      name="Scheduled Completion Date"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <CustomAccordion
                  name="milestone"
                  summary={<TitleWrapper text="Milestone" />}
                  details={
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormInput name="Planned Milestones" />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormInput name="Milestone Changes" />
                      </Grid>
                    </Grid>
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatepickerControl
                  name="Status Date"
                  variant="outlined"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <CustomAccordion
                  name="vendor"
                  summary={<TitleWrapper text="Vendor" />}
                  details={
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <RadioControl
                          name="Vendor Dependency"
                          fullWidth
                          direction="row"
                          options={["Yes", "No"]}
                        />
                      </Grid>

                      <Grid item xs={12} sm={5}>
                        <DatepickerControl
                          name="Last Vendor Check-in Date"
                          variant="outlined"
                          fullWidth
                        />
                      </Grid>

                      <Grid item xs={12} sm={7}>
                        <FormInput name="Vendor Dependent Product Name" />
                      </Grid>
                    </Grid>
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <CustomAccordion
                  name="risk"
                  summary={<TitleWrapper text="Risk" />}
                  details={
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <RadioControl
                          name="Risk Adjustment"
                          direction="row"
                          fullWidth
                          options={["Yes", "No", "Pending"]}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box paddingX={1.5}>
                          <SliderControl
                            name="Original Risk Rating"
                            step={50}
                            markers={sliderInput}
                            returnLabel
                            fullWidth
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box paddingX={1.5}>
                          <SliderControl
                            name="Adjusted Risk Rating"
                            step={50}
                            markers={sliderInput}
                            returnLabel
                            fullWidth
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <RadioControl
                  name="False Positive"
                  direction="row"
                  fullWidth
                  options={["Yes", "No"]}
                />
              </Grid>

              <Grid item xs={12}>
                <RadioControl
                  name="Operational Requirement"
                  direction="row"
                  fullWidth
                  options={["Yes", "No", "Pending"]}
                />
              </Grid>

              <Grid item xs={12}>
                <FormInput name="Deviation Rationale" />
              </Grid>

              <Grid item xs={12}>
                <Box width={1}>
                  <CustomAccordion
                    name="Supporting Documents"
                    summary={<TitleWrapper text="Supporting Documents" />}
                    details={
                      <SupportingDocuments
                        name="Supporting Documents"
                        control={control}
                        options={[
                          {
                            text: "Remediation Evidence",
                            val: "Remediation Evidence",
                          },
                          {
                            text: "Deviation Request",
                            val: "Deviation Request",
                          },
                        ]}
                      />
                    }
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <FormInput name="Comments" />
              </Grid>

              <Grid item xs={12}>
                <RadioControl
                  name="Auto-Approve"
                  direction="row"
                  fullWidth
                  options={["Yes", "No"]}
                />
              </Grid>
            </Grid>
          </Form>
        </Box>
      }
      contentProp={{ className: classes.form_root }}
      actions={[
        <Button
          variant="outlined"
          color="secondary"
          size="large"
          onClick={onClose}
        >
          CANCEL
        </Button>,
        <Button
          variant="contained"
          color="secondary"
          size="large"
          form="create-poam-form"
          type="submit"
        >
          SUBMIT
        </Button>,
      ]}
      bottomSeperator={true}
    />
  );
}

export default FormDialog;
