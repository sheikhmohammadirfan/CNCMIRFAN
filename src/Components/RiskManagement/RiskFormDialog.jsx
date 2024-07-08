import React, { useEffect, useMemo, useState } from 'react'
import DialogBox from '../Utils/DialogBox'
import { Box, Button, Checkbox, Divider, FormControlLabel, FormGroup, Grid, Slider, TextField, Typography } from '@material-ui/core'
import { DateControl, Form, RadioControl, SelectControl, TextControl } from '../Utils/Control';
import { Controller, useForm } from 'react-hook-form';
import CustomAccordion from '../Utils/CustomAccordion';
import { useStyle } from './RiskRegister/RiskRegisterUtils';
import { Autocomplete } from '@mui/material';
import { source_options } from '../../assets/data/RiskManagement/RiskRegister/RiskRegisterFilters';
import SelectCategories from './RiskRegister/SelectCategories';
import { cia_categories } from '../../assets/data/RiskManagement/RiskRegister/RiskRegisterFilters';
import SliderControl from './RiskRegister/SliderControl';
import useLoading from '../Utils/Hooks/useLoading';

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

// Status text based on loading value
const LoadingStatus = (loading) => ({
  prop: {
    style: { flexGrow: 1, fontStyle: "italic", paddingLeft: 8 },
  },
  element: (
    <Typography noWrap>
      {loading("library")
        ? "Loading Library..."
        : ""}
    </Typography>
  ),
});

// DEFAULT EXPORT FUNCTION
const RiskFormDialog = ({
  open,
  closeHandler,
  rowIndex,
  row,
  viaLibrary,
  library,
  isLibraryRow = false,
  autocompleteOptions: { categories, owners },
  getSliderValue,
  scores,
  onFormSubmit
}) => {

  // Get loading status
  const { isLoading, startLoading, stopLoading } = useLoading({
    library: false,
    categories: false,
  });
  // Set loading state of library
  useEffect(() => {
    if (!viaLibrary) return;
    else if (library.length === 0) startLoading('library')
    else if (library.length > 0) stopLoading('library');
  }, [library, viaLibrary])

  const isCreateForm = () => rowIndex === -1 || isLibraryRow;

  // Loading status for dialog
  const [isFormLoading, setisFormLoading] = useState(false);

  // state to handle inherent risk selector accordion open and close;
  const [inherentAccordion, setInherentAccordion] = useState(false)

  // Checking if scenario is a object in string form by trying to parse it, and returning description
  const scenarioDescription = useMemo(() => {
    if (!row) return ""
    return row["Scenario"];
  }, [row])

  const categoriesList_l = useMemo(() => {
    if (!row || !isLibraryRow) return;
    return row["Categories"];
  }, [row]);


  const categoriesList = useMemo(() => {
    if (!row || isLibraryRow) return;
    return scenarioDescription ? (JSON.parse(scenarioDescription).categories_id || []) : [];
  }, [row])

  let formValues = row
    ? isLibraryRow ? {
      scenario: scenarioDescription,
      categories: categoriesList_l,
      // Get id for a single cia category, and check if it is in the row data that is selected.
      confidentiality: row["CIA"]?.includes(cia_categories.find(cat => cat.name === "confidentiality").id),
      integrity: row["CIA"]?.includes(cia_categories.find(cat => cat.name === "integrity").id),
      availability: row["CIA"]?.includes(cia_categories.find(cat => cat.name === "availability").id),
      uncategorized: row["CIA"]?.includes(cia_categories.find(cat => cat.name === "uncategorized").id),
      // getting slider values (0-100) from actual scores. 
      // Boolean flag is to check if score is of likelihood or impact
      // If it is library row, set default risk value to 1 (slider value 0)
      inherent_likelihood: isLibraryRow
        ? getSliderValue(
          scores.likelihoodScores.length > 0 && scores.likelihoodScores[0].score,
          true
        )
        : getSliderValue(
          scores.likelihoodScores.find(score => score.id === row["Inherent Risk Likelihood Id"]).score,
          true
        ),
      inherent_impact: isLibraryRow
        ? getSliderValue(
          scores.impactScores.length > 0 && scores.impactScores[0].score,
          false
        )
        : getSliderValue(
          scores.impactScores.find(score => score.id === row["Inherent Risk Impact Id"]).score,
          false
        ),
      // Setting default slider values of residual risk scores to 1 (One) 
      // Here it is assumed first score object is the lowest score
      residual_likelihood: getSliderValue(
        scores.likelihoodScores.length > 0 && scores.likelihoodScores[0].score,
        true
      ),
      residual_impact: getSliderValue(
        scores.impactScores.length > 0 && scores.impactScores[0].score,
        false
      ),
      notes: "Notes" in row ? row["Notes"] : "",
      customId: "Custom Id" in row ? row["Custom Id"] : ""
    } : {
      scenario: scenarioDescription ? (JSON.parse(scenarioDescription).description || "") : "",
      categories: categories.filter(c => categoriesList.includes(c.id)),
      // Get id for a single cia category, and check if it is in the row data that is selected.
      confidentiality: row["CIA"]?.includes(cia_categories.find(cat => cat.name === "confidentiality").id),
      integrity: row["CIA"]?.includes(cia_categories.find(cat => cat.name === "integrity").id),
      availability: row["CIA"]?.includes(cia_categories.find(cat => cat.name === "availability").id),
      uncategorized: row["CIA"]?.includes(cia_categories.find(cat => cat.name === "uncategorized").id),
      // getting slider values (0-100) from actual scores. 
      // Boolean flag is to check if score is of likelihood or impact
      // If it is library row, set default risk value to 1 (slider value 0)
      inherent_likelihood: isLibraryRow
        ? getSliderValue(
          scores.likelihoodScores.length > 0 && scores.likelihoodScores[0].score,
          true
        )
        : getSliderValue(
          scores.likelihoodScores.find(score => score.id === row["Inherent Risk Likelihood Id"]).score,
          true
        ),
      inherent_impact: isLibraryRow
        ? getSliderValue(
          scores.impactScores.length > 0 && scores.impactScores[0].score,
          false
        )
        : getSliderValue(
          scores.impactScores.find(score => score.id === row["Inherent Risk Impact Id"]).score,
          false
        ),
      // Setting default slider values of residual risk scores to 1 (One) 
      // Here it is assumed first score object is the lowest score
      residual_likelihood: getSliderValue(
        scores.likelihoodScores.find(score => score.id === row["Residual Risk Likelihood Id"])?.score || scores.likelihoodScores[0].score,
        true
      ),
      residual_impact: getSliderValue(
        scores.impactScores.find(score => score.id === row["Residual Risk Impact Id"])?.score || scores.impactScores[0].score,
        false
      ),
      notes: "Notes" in row ? row["Notes"] : "",
      customId: "Custom Id" in row ? row["Custom Id"] : "",
      identified_date: row["Identified Date"] || null,
      modified_date: row["Modified Date"] || null,
      treatment_plan: row["Treatment"] ? (JSON.parse(row["Treatment"]).type || -1) : -1,
      source: scenarioDescription ? (JSON.parse(scenarioDescription).source_type) : null,
      owner: row["Owner"]
    }
    : {
      // Setting default slider values to 1 (One) 
      // Here it is assumed first score object is the lowest score
      inherent_likelihood: getSliderValue(
        scores.likelihoodScores.length > 0 && scores.likelihoodScores[0].score,
        true
      ),
      inherent_impact: getSliderValue(
        scores.impactScores.length > 0 && scores.impactScores[0].score,
        false
      )
    }

  // Get useForm Methods
  const { handleSubmit, getValues, setValue, control, reset } = useForm({
    defaultValues: formValues,
  });

  // reset form fields whenever a row changes. 
  // reset is required as hook form caches default values. it won't change on its own
  useEffect(() => {
    reset(formValues)
  }, [open]);

  const validation = {
    scenario: { required: "This field is required." },
    categories: { required: "This field is required." },
    inherent_likelihood: { required: "Select a number" },
    inherent_impact: { required: "Select a number" },
    customId: { required: "This field is required." },
  };

  const handleSliderError = (error) => {
    setInherentAccordion(true);
  }

  const onSubmit = async (values) => {
    setisFormLoading(true);
    await onFormSubmit(values);
    setisFormLoading(false);
  }

  const classes = useStyle();

  const getSliderMarks = (isLikelihoodRisk) => (
    isLikelihoodRisk ? scores.likelihoodScores.map(score => ({
      value: getSliderValue(score.score, true),
      label: score.score,
      name: score.likelihood_name,
      desc: score.likelihood_description
    })) :
      scores.impactScores.map(score => ({
        value: getSliderValue(score.score, false),
        label: score.score,
        name: score.impact_name,
        desc: score.impact_description
      }))
  )

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
  ]

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
                {viaLibrary ?
                  <SelectControl
                    name="scenario"
                    label="Scenario"
                    variant="outlined"
                    loading={isLoading("library")}
                    options={library.map(row => ({ val: row.id, text: row.scenario })) || []}
                    styleProps={{ fullWidth: true, }}
                  /> :
                  <FormInput
                    name="scenario"
                    label="Scenario"
                    disabled={isLibraryRow}
                  />
                }
              </Grid>
              {/* Dont show categories if adding via library */}
              {!viaLibrary &&
                <Grid item xs={12}>
                  <SelectCategories
                    multiple={true}
                    name="categories"
                    label="Categories"
                    control={control}
                    rules={validation}
                    optionList={categories}
                    className={classes.customAutocomplete}
                    disabled={isLibraryRow}
                  />
                </Grid>}
              {/* Not showing owner, source, identified and modified date fields if it is not a create risk  */}
              {!isCreateForm() && (
                <>
                  <Grid item xs={6}>
                    {/* <Autocomplete
                          id="tags-outlined"
                          name="Owner"
                          options={owners}
                          value={selectedOwner}
                          onChange={(e, newVal) => setSelectedOwner(newVal)}
                          getOptionLabel={(option) => option.text ? option.text : ""}
                          filterSelectedOptions
                          renderInput={(params) => (
                            <FormInput
                              {...params}
                              name="Owner"
                            />
                          )}
                        /> */}
                    <SelectControl
                      name="owner"
                      label="Owner"
                      variant="outlined"
                      options={owners.map(o => ({ val: o.id, text: o.text }))}
                      styleProps={{ fullWidth: true, }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    {/* <Autocomplete
                          id="tags-outlined"
                          name="Source"
                          options={source_options}
                          value={selectedSource}
                          onChange={(e, newVal) => setSelectedSource(newVal)}
                          getOptionLabel={(option) => option.name ? option.name : ""}
                          filterSelectedOptions
                          renderInput={(params) => (
                            <FormInput
                              {...params}
                              name="Source"
                            />
                          )}
                        /> */}
                    <SelectControl
                      name="source"
                      label="Source"
                      variant="outlined"
                      options={source_options}
                      styleProps={{ fullWidth: true, }}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DateControl
                      name="identified_date"
                      label="Identified Date"
                      variant='outlined'
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DateControl
                      name="modified_date"
                      label="Modified Date"
                      variant='outlined'
                      fullWidth
                      disabled
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <Box className={classes.subInputsContainer}>
                  <Typography className={classes.inputSubtitle}>CIA Categories</Typography>
                  <Divider />
                  <Box padding="16px" width="100%" display="flex" justifyContent="space-between">
                    {cia_categories.map((category, index) => (
                      <FormControlLabel
                        key={index}
                        label={category.text}
                        className={classes.ciaLabel}
                        control={
                          <Controller
                            name={category.name}
                            control={control}
                            render={({ field: { value, onChange } }) => {
                              const handleChange = (e, value) => {
                                // CONTROLLING "UNCATEGORIZED" CHECKBOX
                                // getting id of category who's value was changed
                                let dataId = parseInt(e.target.getAttribute("data-id"));
                                // If "Uncategorized" was checked to true, set all other cia categories to unchecked (false)
                                if (dataId === 1 && value === true) {
                                  setValue("confidentiality", false);
                                  setValue("integrity", false);
                                  setValue("availability", false);
                                }
                                // if some other checkbox was checked to true, uncheck "Uncategorized"
                                else if (dataId !== 1 && value === true) setValue("uncategorized", false)
                                onChange(value);
                              }
                              return (
                                <Checkbox
                                  checked={value || false}
                                  onChange={(e, newVal) => handleChange(e, newVal)}
                                  className={classes.ciaCheckbox}
                                  inputProps={{
                                    'data-id': category.id
                                  }}
                                />
                              )
                            }}
                          />
                        }
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box className={classes.subInputsContainer}>
                  <Typography className={classes.inputSubtitle}>Inherent Risk</Typography>
                  <Divider />
                  <Box className={classes.riskSliderContainer}>
                    <Typography className={classes.subInputSubtitle}>Likelihood Score</Typography>
                    <Box className={classes.sliderContainer}>
                      <SliderControl
                        name="inherent_likelihood"
                        control={control}
                        rules={validation}
                        // Boolean flag is to check if score is of likelihood or impact
                        marks={getSliderMarks(true)}
                        classes={classes}
                        handleError={handleSliderError}
                        isCreateForm={isCreateForm()}
                      />
                    </Box>
                    <Typography className={classes.subInputSubtitle}>Impact Score</Typography>
                    <Box className={classes.sliderContainer}>
                      <SliderControl
                        name="inherent_impact"
                        control={control}
                        rules={validation}
                        // Boolean flag is to check if score is of likelihood or impact
                        marks={getSliderMarks(false)}
                        classes={classes}
                        handleError={handleSliderError}
                        isCreateForm={isCreateForm()}
                      />
                    </Box>
                  </Box>
                </Box>
              </Grid>
              {/* Not showing residual risk field if it is not create form */}
              {(!isCreateForm()) &&
                <Grid item xs={12}>
                  <Box className={classes.subInputsContainer}>
                    <Typography className={classes.inputSubtitle}>Residual Risk</Typography>
                    <Divider />
                    <Box className={classes.riskSliderContainer}>
                      <Typography className={classes.subInputSubtitle}>Likelihood</Typography>
                      <Box className={classes.sliderContainer}>
                        <SliderControl
                          name="residual_likelihood"
                          control={control}
                          marks={getSliderMarks(true)}
                          classes={classes}
                          isCreateForm={isCreateForm()}
                        />
                      </Box>
                      <Typography className={classes.subInputSubtitle}>Impact</Typography>
                      <Box className={classes.sliderContainer}>
                        <SliderControl
                          name="residual_impact"
                          control={control}
                          marks={getSliderMarks(false)}
                          classes={classes}
                          isCreateForm={isCreateForm()}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              }
              <Grid item xs={12}>
                <FormInput
                  name="notes"
                />
              </Grid>
              {(!isCreateForm()) &&
                <Grid item xs={12}>
                  <Box className={classes.subInputsContainer}>
                    <Typography className={classes.inputSubtitle}>Treatment Plan</Typography>
                    <Box className={classes.treatmentInputContainer}>
                      <RadioControl
                        name="treatment_plan"
                        hideLabel={true}
                        direction="column"
                        options={treatmentOptions}
                        styleProps={{ className: classes.radioControl }}
                      />
                    </Box>
                    <Typography className={classes.inputSubtitle}>Controls</Typography>
                    <Box>

                    </Box>
                  </Box>
                </Grid>
              }
              <Grid item xs={12}>
                <FormInput
                  name="customId"
                />
              </Grid>
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
        >
          CANCEL
        </Button>,
        <Button
          variant="contained"
          color="primary"
          size="large"
          form="risk-form"
          type="submit"
          disabled={isFormLoading || isLoading()}
        >
          {(isCreateForm()) ? "ADD" : "UPDATE"}
        </Button>,
      ]}
    >

    </DialogBox>
  )
}

export default RiskFormDialog