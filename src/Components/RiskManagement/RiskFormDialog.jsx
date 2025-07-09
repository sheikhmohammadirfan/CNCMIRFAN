import React, { useEffect, useMemo, useState } from "react";
import DialogBox from "../Utils/DialogBox";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Typography,
} from "@material-ui/core";
import {
  DateControl,
  Form,
  RadioControl,
  SelectControl,
  TextControl,
} from "../Utils/Control";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useStyle } from "./RiskRegister/RiskRegisterUtils";
import { Autocomplete, Tooltip } from "@mui/material";
import { source_options } from "../../assets/data/RiskManagement/RiskRegister/RiskRegisterFilters";
import SelectCategories from "./RiskRegister/SelectCategories";
import { cia_categories } from "../../assets/data/RiskManagement/RiskRegister/RiskRegisterFilters";
import SliderControl from "./RiskRegister/SliderControl";
import useLoading from "../Utils/Hooks/useLoading";
import { get } from "../../Service/CrudFactory";

// Add DETECTED_FROM_CHOICES constant
const DETECTED_FROM_CHOICES = [
  { val: 0, text: "Third-Party Risk Assessment" },
  { val: 1, text: "Internal Audit" },
  { val: 2, text: "External Audit" },
  { val: 3, text: "Vulnerability Scan" },
  { val: 4, text: "Security Assessment" },
  { val: 5, text: "User Report" },
  { val: 6, text: "Compliance Review" },
  { val: 7, text: "Penetration Testing" },
];

// Helper to map detected_from string to value
const getDetectedFromValue = (input) => {
  if (input === null || input === undefined) return null;
  // If already a number, return as is
  if (typeof input === "number") return input;
  // If string, try to match to DETECTED_FROM_CHOICES
  const found = DETECTED_FROM_CHOICES.find(
    (opt) => opt.text === input || String(opt.val) === String(input),
  );
  return found ? found.val : null;
};

// Custom input compoent
const FormInput = ({ ...rest }) => (
  <TextControl
    variant="outlined"
    gutter={false}
    fullWidth
    multiline
    {...rest}
  />
);

// Status text based on loading value
const LoadingStatus = (loading) => ({
  prop: {
    style: { flexGrow: 1, fontStyle: "italic", paddingLeft: 8 },
  },
  element: (
    <Typography noWrap>
      {loading("library") ? "Loading Library..." : ""}
    </Typography>
  ),
});

// DEFAULT EXPORT FUNCTION
const RiskFormDialog = ({
  hasAccess,
  open,
  closeHandler,
  rowIndex,
  row,
  viaLibrary,
  library,
  isLibraryRow = false,
  autocompleteOptions: { categories, owners },
  getSliderValue: { getLikelihoodSliderValue, getImpactSliderValue },
  scores,
  onFormSubmit,
}) => {
  // Get loading status
  const { isLoading, startLoading, stopLoading } = useLoading({
    library: false,
    categories: false,
  });

  const [selectedFramework, setSelectedFramework] = useState(null);
  const [frameworkList, setFrameworkList] = useState([]);

  // Set loading state of library
  useEffect(() => {
    if (!viaLibrary) return;
    else if (library.length === 0) startLoading("library");
    else if (library.length > 0) stopLoading("library");
  }, [library, viaLibrary]);

  // <-----------------------------FRAMEWORK FETCHER--------------------------------->
  useEffect(() => {
    const fetchFramework = async () => {
      const response = await get("/control/list-framework/");
      setFrameworkList(response?.data);
    };
    fetchFramework();
  }, []);

  useEffect(() => {
    if (!row || frameworkList.length === 0) return;

    const matchingFramework = frameworkList.find(
      (fw) =>
        fw.name === row.Framework || fw.name === row.applicable_framework_name,
    );

    if (matchingFramework) {
      setSelectedFramework(matchingFramework);
      setValue("Framework", matchingFramework);
    } else if (row.Framework) {
      // If it's a free-form value not in the list
      setSelectedFramework(row.Framework);
      setValue("Framework", row.Framework);
    }
  }, [frameworkList, row]);

  const isCreateForm = () => rowIndex === -1 || isLibraryRow;

  // Loading status for dialog
  const [isFormLoading, setisFormLoading] = useState(false);

  // Checking if scenario is a object in string form by trying to parse it, and returning description
  const scenarioDescription = useMemo(() => {
    if (!row) return "";
    return row["Scenario"];
  }, [row]);

  const categoriesList_l = useMemo(() => {
    if (!row || !isLibraryRow) return;
    return row["Categories"];
  }, [row]);

  const categoriesList = useMemo(() => {
    if (!row || isLibraryRow) return;
    return scenarioDescription
      ? JSON.parse(scenarioDescription).categories_id || []
      : [];
  }, [row]);

  const frameworkId =
    row?.applicable_framework ??
    scenarioDescription?.applicable_framework ??
    row?.["Applicable Framework Id"] ??
    (typeof row?.Framework === "object" && row.Framework?.id) ??
    (typeof row?.Framework === "string"
      ? frameworkList.find((fw) => fw.name === row.Framework)?.id
      : null);

  // Set up detected_from initial value
  let detectedFromInitial = null;
  if (row && row.detected_from !== undefined && row.detected_from !== null) {
    detectedFromInitial = getDetectedFromValue(row.detected_from);
  } else if (
    row &&
    row["Detected From"] !== undefined &&
    row["Detected From"] !== null
  ) {
    detectedFromInitial = getDetectedFromValue(row["Detected From"]);
  } else {
    detectedFromInitial = null;
  }

  let formValues = row
    ? isLibraryRow
      ? {
          scenario: scenarioDescription,
          categories: categoriesList_l,
          confidentiality: false,
          integrity: false,
          availability: false,
          uncategorized: true,
          inherent_likelihood: isLibraryRow
            ? getLikelihoodSliderValue(
                scores.likelihoodScores.length > 0 &&
                  scores.likelihoodScores[0].score,
              )
            : getLikelihoodSliderValue(
                scores.likelihoodScores.find(
                  (score) => score.id === row["Inherent Risk Likelihood Id"],
                ).score,
              ),
          inherent_impact: isLibraryRow
            ? getImpactSliderValue(
                scores.impactScores.length > 0 && scores.impactScores[0].score,
              )
            : getImpactSliderValue(
                scores.impactScores.find(
                  (score) => score.id === row["Inherent Risk Impact Id"],
                ).score,
              ),
          residual_likelihood: getLikelihoodSliderValue(
            scores.likelihoodScores.length > 0 &&
              scores.likelihoodScores[0].score,
          ),
          residual_impact: getImpactSliderValue(
            scores.impactScores.length > 0 && scores.impactScores[0].score,
          ),
          notes: "Notes" in row ? row["Notes"] : "",
          // Add applicable_framework to form values for library row
          applicable_framework: frameworkId,
          Framework:
            frameworkList.find((fw) => fw.id === frameworkId) ??
            frameworkList.find(
              (fw) => fw.name === row?.["Applicable Framework Name"],
            ) ??
            row?.Framework ??
            "",
          detected_from: detectedFromInitial,
        }
      : {
          scenario: scenarioDescription
            ? JSON.parse(scenarioDescription).description || ""
            : "",
          categories: categories.filter((c) => categoriesList.includes(c.id)),
          confidentiality: row["CIA"]?.includes(
            cia_categories.find((cat) => cat.name === "confidentiality").id,
          ),
          integrity: row["CIA"]?.includes(
            cia_categories.find((cat) => cat.name === "integrity").id,
          ),
          availability: row["CIA"]?.includes(
            cia_categories.find((cat) => cat.name === "availability").id,
          ),
          uncategorized: row["CIA"]?.includes(
            cia_categories.find((cat) => cat.name === "uncategorized").id,
          ),
          inherent_likelihood: isLibraryRow
            ? getLikelihoodSliderValue(
                scores.likelihoodScores.length > 0 &&
                  scores.likelihoodScores[0].score,
              )
            : getLikelihoodSliderValue(
                scores.likelihoodScores.find(
                  (score) => score.id === row["Inherent Risk Likelihood Id"],
                ).score,
              ),
          inherent_impact: isLibraryRow
            ? getImpactSliderValue(
                scores.impactScores.length > 0 && scores.impactScores[0].score,
              )
            : getImpactSliderValue(
                scores.impactScores.find(
                  (score) => score.id === row["Inherent Risk Impact Id"],
                ).score,
              ),
          residual_likelihood:
            row["Residual Risk Likelihood Id"] === null
              ? null
              : getLikelihoodSliderValue(
                  scores.likelihoodScores.find(
                    (score) => score.id === row["Residual Risk Likelihood Id"],
                  )?.score || scores.likelihoodScores[0].score,
                ),
          residual_impact:
            row["Residual Risk Impact Id"] === null
              ? null
              : getImpactSliderValue(
                  scores.impactScores.find(
                    (score) => score.id === row["Residual Risk Impact Id"],
                  )?.score || scores.impactScores[0].score,
                ),
          notes: "Notes" in row ? row["Notes"] : "",
          identified_date: row["Identified Date"] || null,
          modified_date: row["Modified Date"] || null,
          treatment_plan: row["Treatment"]
            ? JSON.parse(row["Treatment"]).type || -1
            : -1,
          source: scenarioDescription
            ? JSON.parse(scenarioDescription).source_type
            : null,
          owner: row["Owner"],
          // Add applicable_framework to form values for non-library row
          applicable_framework: frameworkId,
          Framework:
            frameworkList.find((fw) => fw.id === frameworkId) ??
            frameworkList.find(
              (fw) => fw.name === row?.["Applicable Framework Name"],
            ) ??
            row?.Framework ??
            "",
          detected_from: detectedFromInitial,
        }
    : {
        inherent_likelihood: getLikelihoodSliderValue(
          scores.likelihoodScores.length > 0 &&
            scores.likelihoodScores[0].score,
        ),
        inherent_impact: getImpactSliderValue(
          scores.impactScores.length > 0 && scores.impactScores[0].score,
        ),
        // Add applicable_framework to default form values
        applicable_framework: null,
        detected_from: null,
      };

  // Get useForm Methods
  const {
    handleSubmit,
    getValues,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: formValues,
  });

  // Watch scenario for scenario id
  const watchedScenarioId = useWatch({ control, name: "scenario" });
  const watchedFramework = useWatch({ control, name: "Framework" });

  useEffect(() => {
    if (!isCreateForm()) {
      let detectedFromValue = null;
      if (
        row &&
        row.detected_from !== undefined &&
        row.detected_from !== null
      ) {
        detectedFromValue = getDetectedFromValue(row.detected_from);
      } else if (
        row &&
        row["Detected From"] !== undefined &&
        row["Detected From"] !== null
      ) {
        detectedFromValue = getDetectedFromValue(row["Detected From"]);
      }
      setValue("detected_from", detectedFromValue);
    }
    // eslint-disable-next-line
  }, [row, setValue, open]);

  useEffect(() => {
    if (row && frameworkList.length > 0) {
      reset(formValues);
    }
    // eslint-disable-next-line
  }, [row, frameworkList, open]);

  useEffect(() => {
    const values = getValues();
    const noneSelected =
      !values.availability &&
      !values.confidentiality &&
      !values.integrity &&
      !values.uncategorized;

    if (noneSelected) {
      setValue("uncategorized", true);
    }
    // eslint-disable-next-line
  }, []);

  // When scenario changes, update the framework and applicable_framework in the form
  useEffect(() => {
    if (!viaLibrary || !watchedScenarioId) return;

    const selected = library.find((item) => item.id === watchedScenarioId);
    if (!selected) return;

    const frameworkName = selected.applicable_framework_name;
    const frameworkId = selected.applicable_framework;

    setValue("Framework", frameworkName);
    setValue("applicable_framework", frameworkId); // Set the framework id in the form
  }, [watchedScenarioId, viaLibrary, library, setValue]);

  // When framework changes, update the applicable_framework in the form
  useEffect(() => {
    if (!watchedFramework) {
      setValue("applicable_framework", null);
      return;
    }
    if (typeof watchedFramework === "object" && watchedFramework.id) {
      setValue("applicable_framework", watchedFramework.id);
    } else if (
      typeof watchedFramework === "string" &&
      frameworkList.length > 0
    ) {
      const found = frameworkList.find((fw) => fw.name === watchedFramework);
      setValue("applicable_framework", found ? found.id : null);
    } else {
      setValue("applicable_framework", null);
    }
    // eslint-disable-next-line
  }, [watchedFramework, frameworkList, library]);

  // Add validation for detected_from if needed
  const validation = {
    scenario: { required: "This field is required." },
    categories: { required: "This field is required." },
    inherent_likelihood: { required: "Select a number" },
    inherent_impact: { required: "Select a number" },
    uncategorized: {
      validate: {
        invalid: () => {
          return (
            getValues("uncategorized") ||
            getValues("confidentiality") ||
            getValues("integrity") ||
            getValues("availability") ||
            "Select at least one CIA Category"
          );
        },
      },
    },
    detected_from: { required: "This field is required." },
  };

  const onSubmit = async (values, isApprove = false) => {
    setisFormLoading(true);
    let payload = {
      ...values,
    };

    // Always include scenario_id if available (for edit/update)
    if (!isCreateForm()) {
      // For viaLibrary, scenario is likely the id, for manual edit it's a string, so be careful
      let scenarioId = null;
      if (viaLibrary) {
        scenarioId = values.scenario; // should be id
      } else if (row && row["Scenario"]) {
        try {
          scenarioId = JSON.parse(row["Scenario"]).id;
        } catch {
          scenarioId = null;
        }
      }
      if (scenarioId) {
        payload.scenario_id = scenarioId;
      }
    }

    // If editing (not create) and row.approved is not true, add is_approved: true to payload
    if (
      !isCreateForm() &&
      !isLibraryRow &&
      (!row || row["Approved"] === false)
    ) {
      if (isApprove) {
        payload.is_approved = true;
      }
    }
    await onFormSubmit(payload);
    setisFormLoading(false);
  };

  const classes = useStyle();

  const getSliderMarks = (isLikelihoodRisk) =>
    isLikelihoodRisk
      ? scores.likelihoodScores.map((score) => ({
          value: getLikelihoodSliderValue(score.score),
          label: score.score,
          name: score.likelihood_name,
          desc: score.likelihood_description,
        }))
      : scores.impactScores.map((score) => ({
          value: getImpactSliderValue(score.score),
          label: score.score,
          name: score.impact_name,
          desc: score.impact_description,
        }));

  // Create component to show text & caption
  const OptionText = ({ text, caption }) => (
    <Box>
      <Typography className={classes.labelTitle}>{text}</Typography>
      <Typography className={classes.labelCaption}>{caption}</Typography>
    </Box>
  );

  const treatmentOptions = [
    {
      val: "Mitigate",
      text: (
        <OptionText
          text="Mitigate"
          caption="Mitigate the risk, by adding some control points or implementing something"
        />
      ),
    },
    {
      val: "Transfer",
      text: (
        <OptionText
          text="Transfer"
          caption="Mitigate the risk, by adding some control points or implementing something"
        />
      ),
    },
    {
      val: "Avoid",
      text: (
        <OptionText
          text="Avoid"
          caption="Mitigate the risk, by adding some control points or implementing something"
        />
      ),
    },
    {
      val: "Accept",
      text: (
        <OptionText
          text="Accept"
          caption="Mitigate the risk, by adding some control points or implementing something"
        />
      ),
    },
  ];

  // Handler for Update button
  const handleUpdate = (e) => {
    e.preventDefault();
    handleSubmit((values) => onSubmit(values, false))();
  };

  // Handler for Approve & Update button
  const handleApproveAndUpdate = (e) => {
    e.preventDefault();
    handleSubmit((values) => onSubmit(values, true))();
  };

  return (
    <DialogBox
      open={open}
      close={closeHandler}
      title={
        <Typography style={{ fontWeight: "bold" }}>
          {isCreateForm() ? "Create New Risk" : "Edit Risk"}
        </Typography>
      }
      loading={isFormLoading}
      bottomSeperator={true}
      className={classes.formContainer}
      content={
        <Box>
          <Form
            id="risk-form"
            control={control}
            rules={validation}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {viaLibrary ? (
                  <SelectControl
                    name="scenario"
                    label="Scenario"
                    variant="outlined"
                    loading={isLoading("library")}
                    options={
                      library.map((row) => ({
                        val: row.id,
                        text: row.scenario,
                      })) || []
                    }
                    styleProps={{ fullWidth: true }}
                    disabled={!hasAccess}
                  />
                ) : (
                  <FormInput
                    name="scenario"
                    label="Scenario"
                    disabled={!hasAccess || isLibraryRow}
                    maxRows={5}
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  value={getValues("Framework") || selectedFramework}
                  onChange={(e, v) => {
                    setValue("Framework", v);
                    setSelectedFramework(v);
                    // Set applicable_framework when framework changes
                    if (v && typeof v === "object" && v.id) {
                      setValue("applicable_framework", v.id);
                    } else if (
                      typeof v === "string" &&
                      frameworkList.length > 0
                    ) {
                      const found = frameworkList.find((fw) => fw.name === v);
                      setValue("applicable_framework", found ? found.id : null);
                    } else {
                      setValue("applicable_framework", null);
                    }
                  }}
                  disablePortal
                  disabled={!hasAccess || isLibraryRow || viaLibrary}
                  options={frameworkList}
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.name
                  }
                  freeSolo
                  renderInput={(props) => (
                    <TextControl
                      {...props}
                      noControls
                      gutter={false}
                      variant="outlined"
                      name="Framework"
                      value={getValues("Framework")}
                      onChange={(e) => {
                        setValue("Framework", e.target.value || "");
                        // Set applicable_framework when typing
                        if (frameworkList.length > 0) {
                          const found = frameworkList.find(
                            (fw) => fw.name === e.target.value,
                          );
                          setValue(
                            "applicable_framework",
                            found ? found.id : null,
                          );
                        } else {
                          setValue("applicable_framework", null);
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Detected From field */}
              {!isLibraryRow && (
                <Grid item xs={12}>
                  <Controller
                    name="detected_from"
                    control={control}
                    render={({ field }) => (
                      <SelectControl
                        {...field}
                        name="detected_from"
                        label="Detected From"
                        variant="outlined"
                        options={DETECTED_FROM_CHOICES}
                        styleProps={{ fullWidth: true }}
                        disabled={!hasAccess}
                        rules={validation.detected_from}
                        value={
                          field.value !== undefined && field.value !== null
                            ? field.value
                            : ""
                        }
                        onChange={(e) => {
                          // e.target.value is a number or string
                          let val = e.target.value;
                          // If value is string, try to convert to number if possible
                          if (
                            typeof val === "string" &&
                            !isNaN(Number(val)) &&
                            val !== ""
                          ) {
                            val = Number(val);
                          }
                          field.onChange(val);
                        }}
                      />
                    )}
                  />
                  {!!errors.detected_from && (
                    <Typography variant="caption" className={classes.errorText}>
                      {errors.detected_from.message}
                    </Typography>
                  )}
                </Grid>
              )}

              {/* Dont show categories if adding via library */}
              {!viaLibrary && (
                <Grid item xs={12}>
                  <SelectCategories
                    multiple={true}
                    name="categories"
                    label="Categories"
                    control={control}
                    rules={validation}
                    optionList={categories}
                    className={classes.customAutocomplete}
                    disabled={!hasAccess || isLibraryRow}
                  />
                </Grid>
              )}
              {/* Not showing owner, source, identified and modified date fields if it is not a create risk  */}
              {!isCreateForm() && (
                <>
                  <Grid item xs={6}>
                    <SelectControl
                      name="owner"
                      label="Owner"
                      variant="outlined"
                      options={owners.map((o) => ({ val: o.id, text: o.text }))}
                      styleProps={{ fullWidth: true }}
                      disabled={!hasAccess}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <SelectControl
                      name="source"
                      label="Source"
                      variant="outlined"
                      options={source_options}
                      styleProps={{ fullWidth: true }}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DateControl
                      name="identified_date"
                      label="Identified Date"
                      variant="outlined"
                      fullWidth
                      disabled={!hasAccess}
                      disablePast={true}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DateControl
                      name="modified_date"
                      label="Modified Date"
                      variant="outlined"
                      fullWidth
                      disabled
                      disablePast={true}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <Box
                  className={`${classes.subInputsContainer} ${
                    !!errors.uncategorized ? "error" : ""
                  }`}
                >
                  <Typography className={classes.inputSubtitle}>
                    CIA Categories
                  </Typography>
                  <Divider />
                  <Box
                    padding="16px"
                    width="100%"
                    display="flex"
                    justifyContent="space-between"
                  >
                    {cia_categories.map((category, index) => (
                      <FormControlLabel
                        key={index}
                        label={category.text}
                        className={classes.ciaLabel}
                        control={
                          <Controller
                            name={category.name}
                            control={control}
                            rules={validation.uncategorized}
                            render={({ field: { value, onChange } }) => {
                              const handleChange = (e, value) => {
                                // CONTROLLING "UNCATEGORIZED" CHECKBOX
                                // getting id of category who's value was changed
                                let dataId = parseInt(
                                  e.target.getAttribute("data-id"),
                                );
                                // If "Uncategorized" was checked to true, set all other cia categories to unchecked (false)
                                if (dataId === 1 && value === true) {
                                  setValue("confidentiality", false);
                                  setValue("integrity", false);
                                  setValue("availability", false);
                                }
                                // if some other checkbox was checked to true, uncheck "Uncategorized"
                                else if (dataId !== 1 && value === true)
                                  setValue("uncategorized", false);
                                onChange(value);
                              };
                              return (
                                <Checkbox
                                  checked={value || false}
                                  onChange={(e, newVal) =>
                                    handleChange(e, newVal)
                                  }
                                  className={classes.ciaCheckbox}
                                  inputProps={{
                                    "data-id": category.id,
                                  }}
                                  disabled={!hasAccess}
                                />
                              );
                            }}
                          />
                        }
                      />
                    ))}
                  </Box>
                </Box>
                {!!errors.uncategorized && (
                  <Typography
                    variant="caption"
                    className={`${classes.subInputSubtitle} ${classes.errorText}`}
                  >
                    Select atleast one CIA Categories
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Box className={classes.subInputsContainer}>
                  <Typography className={classes.inputSubtitle}>
                    Inherent Risk
                  </Typography>
                  <Divider />
                  <Box className={classes.riskSliderContainer}>
                    <Typography className={classes.subInputSubtitle}>
                      Likelihood Score
                    </Typography>
                    <Box className={classes.sliderContainer}>
                      <SliderControl
                        name="inherent_likelihood"
                        control={control}
                        rules={validation}
                        marks={getSliderMarks(true)}
                        classes={classes}
                        isCreateForm={isCreateForm()}
                        disabled={!hasAccess}
                      />
                    </Box>
                    <Typography className={classes.subInputSubtitle}>
                      Impact Score
                    </Typography>
                    <Box className={classes.sliderContainer}>
                      <SliderControl
                        name="inherent_impact"
                        control={control}
                        rules={validation}
                        marks={getSliderMarks(false)}
                        classes={classes}
                        isCreateForm={isCreateForm()}
                        disabled={!hasAccess}
                      />
                    </Box>
                  </Box>
                </Box>
              </Grid>
              {!isCreateForm() && (
                <Grid item xs={12}>
                  <Box className={classes.subInputsContainer}>
                    <Typography className={classes.inputSubtitle}>
                      Residual Risk
                    </Typography>
                    <Divider />
                    <Box className={classes.riskSliderContainer}>
                      <Typography className={classes.subInputSubtitle}>
                        Likelihood
                      </Typography>
                      <Box className={classes.sliderContainer}>
                        <SliderControl
                          name="residual_likelihood"
                          control={control}
                          marks={getSliderMarks(true)}
                          classes={classes}
                          isCreateForm={isCreateForm()}
                          disabled={!hasAccess}
                        />
                      </Box>
                      <Typography className={classes.subInputSubtitle}>
                        Impact
                      </Typography>
                      <Box className={classes.sliderContainer}>
                        <SliderControl
                          name="residual_impact"
                          control={control}
                          marks={getSliderMarks(false)}
                          classes={classes}
                          isCreateForm={isCreateForm()}
                          disabled={!hasAccess}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              )}
              <Grid item xs={12}>
                <FormInput name="notes" rows={3} disabled={!hasAccess} />
              </Grid>
              {!isCreateForm() && (
                <Grid item xs={12}>
                  <Box className={classes.subInputsContainer} sx={{ pb: 2 }}>
                    <Typography className={classes.inputSubtitle}>
                      Treatment Plan
                    </Typography>
                    <Box className={classes.treatmentInputContainer}>
                      <RadioControl
                        name="treatment_plan"
                        hideLabel={true}
                        direction="column"
                        options={treatmentOptions}
                        styleProps={{ className: classes.radioControl }}
                        radioProps={{
                          disabled: !hasAccess,
                        }}
                      />
                    </Box>
                    <Box></Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Form>
        </Box>
      }
      actions={[
        LoadingStatus(isLoading),
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={closeHandler}
          disabled={isFormLoading}
        >
          CANCEL
        </Button>,
        !isCreateForm() && (
          <Tooltip
            placement="top-end"
            arrow
            title={!hasAccess && "You don't have write access!"}
          >
            <span>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleUpdate}
                disabled={!hasAccess || isFormLoading || isLoading()}
              >
                UPDATE
              </Button>
            </span>
          </Tooltip>
        ),
        !isCreateForm() &&
          row &&
          row["Approved"] === false &&
          !isLibraryRow && (
            <Tooltip
              placement="top-end"
              arrow
              title={!hasAccess && "You don't have write access!"}
            >
              <span>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={handleApproveAndUpdate}
                  disabled={!hasAccess || isFormLoading || isLoading()}
                >
                  APPROVE & UPDATE
                </Button>
              </span>
            </Tooltip>
          ),
        isCreateForm() && (
          <Tooltip
            placement="top-end"
            arrow
            title={!hasAccess && "You don't have write access!"}
          >
            <span>
              <Button
                variant="contained"
                color="primary"
                size="large"
                form="risk-form"
                type="submit"
                disabled={!hasAccess || isFormLoading || isLoading()}
              >
                ADD
              </Button>
            </span>
          </Tooltip>
        ),
      ]}
    ></DialogBox>
  );
};

export default RiskFormDialog;
