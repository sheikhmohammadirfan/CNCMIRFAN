import {
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  makeStyles,
  Typography,
} from "@material-ui/core";
import DialogBox from "../Utils/DialogBox";
import React, { useEffect, useMemo, useState } from "react";
import { poam_header } from "../../assets/data/PoamData";
import {
  DateControl,
  Form,
  RadioControl,
  SliderControl,
  TextControl,
} from "../Utils/Control";
import CustomAccordion from "../Utils/CustomAccordion";
import SupportingDocuments from "./SupportingDocuments";
import { useForm, useWatch } from "react-hook-form";
import { validateID } from "./PoamUtils";
import { stringToMoment } from "../Utils/Utils";
import { Autocomplete } from "@material-ui/lab";
import { get } from "../../Service/CrudFactory";
import { values } from "lodash";

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
function FormDialog({
  poamID_data,
  rows,
  open,
  onClose,
  rowIndex,
  onSubmit,
  controls,
}) {
  const classes = useStyle();

  const isCreateForm = () => rowIndex === -1;
  const { prefix, maxValue } = poamID_data;

  const [isLoading, setisLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState({
    framework: false,
    controls: false,
  });

  const [frameworkList, setFrameworkList] = useState([]);
  const [controlsList, setControlsList] = useState([]);
  const [selectedFramework, setSelectedFramework] = useState(null);
  // Validate POA&M ID, on creating new row in table

  const sliderInput = [
    { value: 0, label: "Low" },
    { value: 50, label: "Moderate" },
    { value: 100, label: "High" },
  ];

  const validation = {
    "POAM ID": {
      validate: { valid: (val) => validateID(val, prefix, maxValue) },
      required: "This field is required.",
    },
  };

  const defaultValues = useMemo(() => {
    const values = {};
    for (const name of poam_header) {
      if (!name.toLowerCase().includes("date")) {
        if (isCreateForm()) {
          values[name] = name === "Controls" ? null : "";
        } else {
          values[name] =
            name === "Controls" ? null : rows[name]?.[rowIndex] ?? "";
        }
      } else {
        values[name] = stringToMoment(
          isCreateForm() ? "" : rows[name]?.[rowIndex]
        );
      }
    }

    if (isCreateForm()) {
      values["POAM ID"] = prefix + "-" + String(maxValue + 1).padStart(3, "0");
    }

    return values;
  }, [rows, rowIndex]);

  const methods = useForm({ defaultValues });
  const { handleSubmit, setValue, getValues, control } = methods;
  const controlsValue = useWatch({ name: "Controls", control });
  useEffect(() => {
    const fetchFramework = async () => {
      try {
        setOptionsLoading((prev) => ({ ...prev, framework: true }));
        const response = await get("/control/list-framework/");
        setFrameworkList(response?.data || []);
      } catch (error) {
      } finally {
        setOptionsLoading((prev) => ({ ...prev, framework: false }));
      }
    };
    fetchFramework();
  }, []);

  useEffect(() => {
    if (!isCreateForm() && frameworkList.length) {
      const matched = frameworkList.find(
        (f) => f.id === rows?.framework_id?.[rowIndex]
      );
      if (matched) {
        setValue("Framework", matched);
        setSelectedFramework(matched);
      }
    }
  }, [frameworkList, rowIndex]);

  useEffect(() => {
    const fetchControls = async () => {
      let url = "/control/list-controls";
      if (selectedFramework?.id) {
        url += `?framework_id=${selectedFramework.id}`;
      }
      try {
        setOptionsLoading((prev) => ({ ...prev, controls: true }));
        const res = await get(url);
        setControlsList(res?.data || []);
      } catch (err) {
        console.error("Error fetching controls", err);
      } finally {
        setOptionsLoading((prev) => ({ ...prev, controls: false }));
      }
    };
    fetchControls();
  }, [selectedFramework]);

  useEffect(() => {
    if (!isCreateForm() && controlsList.length) {
      const matched = controlsList.find(
        (c) => c.id === rows?.Controls?.[rowIndex]
      );
      if (matched) {
        setValue("Controls", matched);
      }
    }
  }, [controlsList, rowIndex]);

  const submitForm = async (data) => {
    setisLoading(true);
    const newFormatData = {};
    Object.keys(data).forEach((colName) => {
      let newColNameFormat =
        colName === "Last Vendor Check-in Date"
          ? "last_vendor_checkin_date"
          : colName.toLowerCase().replaceAll(" ", "_").replaceAll("-", "_");

      if (colName === "Controls") {
        newColNameFormat = "controls";
        newFormatData[newColNameFormat] = data["Controls"]?.id || null;
      } else if (colName === "Framework") {
        newFormatData["framework_id"] = data["Framework"]?.id || null;
      } else {
        newFormatData[newColNameFormat] = data[colName] || "";
      }
    });

    await onSubmit({
      ...newFormatData,
      jira_issues: rows.jira_issues?.[rowIndex] || {},
    });
    setisLoading(false);
  };

  return (
    <DialogBox
      open={open}
      title={
        <Typography style={{ fontWeight: "bold" }}>
          {isCreateForm() ? "Create New Row" : "Edit Row"}
        </Typography>
      }
      loading={isLoading}
      content={
        <Box>
          <Form
            id="create-poam-form"
            control={control}
            rules={isCreateForm() ? validation : {}}
            onSubmit={handleSubmit(submitForm)}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <FormInput
                  name="POAM ID"
                  label="POA&M ID"
                  disabled={!isCreateForm()}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Autocomplete
                  value={getValues("Framework") || null}
                  isOptionEqualToValue={(option, value) => {
                    return option?.id === value?.id;
                  }}
                  onChange={(e, v) => {
                    setValue("Framework", v);
                    setSelectedFramework(v);
                    setControlsList([]);
                    setValue("Controls", null);
                  }}
                  disablePortal
                  options={frameworkList}
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.name
                  }
                  noOptionsText={
                    optionsLoading.framework ? (
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        padding={0}
                      >
                        <CircularProgress size={24} />
                      </Box>
                    ) : (
                      "No options"
                    )
                  }
                  renderInput={(props) => (
                    <TextControl
                      {...props}
                      noControls
                      gutter={false}
                      variant="outlined"
                      name="Framework"
                      InputProps={{
                        ...props.InputProps,
                        endAdornment: (
                          <>
                            {optionsLoading.framework ? (
                              <InputAdornment position="end">
                                <CircularProgress color="inherit" size={20} />
                              </InputAdornment>
                            ) : null}
                            {props.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Autocomplete
                  value={controlsValue}
                  onChange={(e, v) => {
                    console.log("ONCCHANGE", v, values);
                    return setValue("Controls", v || "");
                  }}
                  disablePortal
                  options={controlsList}
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.abbreviation
                  }
                  isOptionEqualToValue={(option, value) =>
                    option?.id === value?.id
                  }
                  noOptionsText={
                    optionsLoading.controls ? (
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        padding={0}
                      >
                        <CircularProgress size={24} />
                      </Box>
                    ) : (
                      "No options"
                    )
                  }
                  renderInput={(props) => (
                    <TextControl
                      {...props}
                      noControls
                      gutter={false}
                      variant="outlined"
                      name="Controls"
                      //                       InputProps={{
                      //   ...props.InputProps,
                      //   endAdornment: (
                      //     <>
                      //       {optionsLoading.controls ? (
                      //         <InputAdornment position="end">
                      //           <CircularProgress color="inherit" size={20} />
                      //         </InputAdornment>
                      //       ) : null}
                      //       {props.InputProps.endAdornment}
                      //     </>
                      //   ),
                      // }}
                    />
                  )}
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
                    <DateControl
                      name="Original Detection Date"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <DateControl
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
                <DateControl name="Status Date" variant="outlined" fullWidth />
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
                        <DateControl
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
          {isCreateForm() ? "SAVE" : "UPDATE"}
        </Button>,
      ]}
      bottomSeperator={true}
    />
  );
}

export default function FormDialogWrapper(props) {
  return props.open ? <FormDialog {...props} /> : null;
}
