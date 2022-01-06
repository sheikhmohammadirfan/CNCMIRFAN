import { Box, Button, Grid, makeStyles, Typography } from "@material-ui/core";
import DialogBox from "../Utils/DialogBox";
import React, { useState } from "react";
import { poam_header } from "../../assets/data/PoamData";
import {
  DatepickerControl,
  DropdownControl,
  RadioControl,
  SliderControl,
  TextControl,
  useForm,
} from "../Control";
import CustomAccordion from "../Utils/CustomAccordion";
import SupportingDocuments from "./SupportingDocuments";

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

  const defaultValue = {};

  for (var name of poam_header)
    defaultValue[name] = rowIndex === -1 ? "" : rows[name][rowIndex];

  const { value, handleInputChange } = useForm(defaultValue);

  return (
    <DialogBox
      open={open}
      onClose={onClose}
      title={
        <Typography style={{ fontWeight: "bold" }}>
          {rowIndex !== -1 ? "Edit Row" : "Create New Row"}
        </Typography>
      }
      loading={isLoading}
      content={
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormInput
              name="POAM ID"
              value={value["POAM ID"]}
              disabled={true}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DropdownControl
              name="Controls"
              value={value["Controls"]}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
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
                    <FormInput
                      name="Weakness Name"
                      value={value["Weakness Name"]}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormInput
                      name="Weakness Description"
                      value={value["Weakness Description"]}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormInput
                      name="Weakness Detector Source"
                      value={value["Weakness Detector Source"]}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormInput
                      name="Weakness Source Identifier"
                      value={value["Weakness Source Identifier"]}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
              }
            />
          </Grid>

          <Grid item xs={12}>
            <FormInput
              name="Asset Identifier"
              value={value["Asset Identifier"]}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <FormInput
              name="Point of Contact"
              value={value["Point of Contact"]}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <FormInput
              name="Resources Required"
              value={value["Resources Required"]}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <FormInput
              name="Overall Remediation Plan"
              value={value["Overall Remediation Plan"]}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DatepickerControl
                  name="Original Detection Date"
                  value={value["Original Detection Date"]}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatepickerControl
                  name="Scheduled Completion Date"
                  value={value["Scheduled Completion Date"]}
                  onChange={handleInputChange}
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
                    <FormInput
                      name="Planned Milestones"
                      value={value["Planned Milestones"]}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormInput
                      name="Milestone Changes"
                      value={value["Milestone Changes"]}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DatepickerControl
              name="Status Date"
              value={value["Status Date"]}
              onChange={handleInputChange}
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
                      value={value["Vendor Dependency"]}
                      onChange={handleInputChange}
                      fullWidth
                      direction="row"
                      options={["Yes", "No"]}
                    />
                  </Grid>

                  <Grid item xs={12} sm={5}>
                    <DatepickerControl
                      name="Last Vendor Check-in Date"
                      value={value["Last Vendor Check-in Date"]}
                      onChange={handleInputChange}
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={7}>
                    <FormInput
                      name="Vendor Dependent Product Name"
                      value={value["Vendor Dependent Product Name"]}
                      onChange={handleInputChange}
                    />
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
                      value={value["Risk Adjustment"]}
                      onChange={handleInputChange}
                      direction="row"
                      fullWidth
                      options={["Yes", "No", "Pending"]}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box paddingX={1.5}>
                      <SliderControl
                        name="Original Risk Rating"
                        value={value["Original Risk Rating"]}
                        onChange={handleInputChange}
                        step={50}
                        markers={sliderInput}
                        fullWidth
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box paddingX={1.5}>
                      <SliderControl
                        name="Adjusted Risk Rating"
                        value={value["Adjusted Risk Rating"]}
                        onChange={handleInputChange}
                        step={50}
                        markers={sliderInput}
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
              value={value["False Positive"]}
              onChange={handleInputChange}
              direction="row"
              fullWidth
              options={["Yes", "No"]}
            />
          </Grid>

          <Grid item xs={12}>
            <RadioControl
              name="Operational Requirement"
              value={value["Operational Requirement"]}
              onChange={handleInputChange}
              direction="row"
              fullWidth
              options={["Yes", "No", "Pending"]}
            />
          </Grid>

          <Grid item xs={12}>
            <FormInput
              name="Deviation Rationale"
              value={value["Deviation Rationale"]}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Box width={1}>
              <CustomAccordion
                name="Supporting Documents"
                summary={<TitleWrapper text="Supporting Documents" />}
                details={
                  <SupportingDocuments
                    value={value["Supporting Documents"]}
                    onChange={(value) =>
                      handleInputChange({
                        target: { name: "Supporting Documents", value },
                      })
                    }
                    options={[
                      {
                        text: "Remediation Evidence",
                        val: "Remediation Evidence",
                      },
                      { text: "Deviation Request", val: "Deviation Request" },
                    ]}
                  />
                }
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <FormInput
              name="Comments"
              value={value["Comments"]}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <RadioControl
              name="Auto-Approve"
              value={value["Auto-Approve"]}
              onChange={handleInputChange}
              direction="row"
              fullWidth
              options={["Yes", "No"]}
            />
          </Grid>
        </Grid>
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
          onClick={() => {
            setisLoading(true);
            onSubmit(value);
          }}
        >
          SUBMIT
        </Button>,
      ]}
      bottomSeperator={true}
    />
  );
}

export default FormDialog;
