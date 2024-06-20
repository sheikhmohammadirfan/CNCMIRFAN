import React, { useEffect, useState } from 'react'
import DialogBox from '../../Utils/DialogBox'
import { Box, Button, Checkbox, Divider, FormControlLabel, FormGroup, Grid, Slider, TextField, Typography } from '@material-ui/core'
import { DateControl, Form, RadioControl, SelectControl, TextControl } from '../../Utils/Control';
import { Controller, useForm } from 'react-hook-form';
import CustomAccordion from '../../Utils/CustomAccordion';
import { useStyle } from './RiskRegisterUtils';
import { Autocomplete } from '@mui/material';
import { source_options } from '../../../assets/data/RiskManagement/RiskRegisterFilters';
import SelectCategories from './SelectCategories';
import { cia_categories } from '../../../assets/data/RiskManagement/RiskRegisterFilters';
import SliderControl from './SliderControl';

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

// Accrodion title wrapper
const TitleWrapper = ({ text }) => (
  <Typography style={{ fontSize: "1rem", color: "rgba(0, 0, 0, 0.6)" }}>
    {text}
  </Typography>
);

// DEFAULT EXPORT FUNCTION
const RegisterDialog = ({
  open,
  closeHandler,
  rowIndex,
  row,
  autocompleteOptions: { categories, owners },
  getSliderValue,
  scores,
  onFormSubmit
}) => {

  const isCreateForm = () => rowIndex === -1;

  // Loading status for dialog
  const [isLoading, setisLoading] = useState(false);

  // state to handle inherent risk selector accordion open and close;
  const [inherentAccordion, setInherentAccordion] = useState(false)

  let formValues = row ? {
    scenario: JSON.parse(row.scenario).description,
    categories: categories.filter(category => JSON.parse(row.scenario).categories_id.includes(category.id)),
    confidentiality: row.cia.includes("Confidentiality"),
    integrity: row.cia.includes("Integrity"),
    availability: row.cia.includes("Confidentiality"),
    uncategorized: row.cia.includes("Uncategorized"),
    // getting slider values (0-100) from actual scores. 
    // Boolean flag is to check if score is of likelihood or impact
    inherent_likelihood: getSliderValue(
      scores.likelihoodScores.find(score => score.id === row["inherent_risk_likelihood_id"]).score,
      true
    ),
    inherent_impact: getSliderValue(
      scores.impactScores.find(score => score.id === row["inherent_risk_impact_id"]).score,
      false
    ),
    notes: row.notes,
    customId: row.custom_id,
  } : {}

  // Get useForm Methods
  const { handleSubmit, getValues, setValue, control, reset } = useForm({
    defaultValues: formValues,
  });

  // reset form fields whenever a row changes. reset is required as hook form caches default values. it won't change on its own
  useEffect(() => {
    reset(formValues)
  }, [row]);

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
    onFormSubmit(values);
  }

  const classes = useStyle();

  const getSliderMarks = (isLikelihoodRisk) => (
    isLikelihoodRisk ? scores.likelihoodScores.map(score => ({
      value: getSliderValue(score.score, true),
      label: score.score,
      name: score.name,
      desc: score.description
    })) :
      scores.impactScores.map(score => ({
        value: getSliderValue(score.score, false),
        label: score.score,
        name: score.name,
        desc: score.description
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
      loading={isLoading}
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
                <FormInput
                  name="scenario"
                  label="Scenario"
                />
              </Grid>
              <Grid item xs={12}>
                <SelectCategories
                  multiple={true}
                  name="categories"
                  label="Categories"
                  control={control}
                  rules={validation}
                  optionList={categories}
                  className={classes.customAutocomplete}
                />
              </Grid>
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
                      options={owners}
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
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DateControl
                      name="identified_date"
                      variant='outlined'
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DateControl
                      name="modified_date"
                      variant='outlined'
                      fullWidth
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <CustomAccordion
                  name="cia_categories"
                  summary={<TitleWrapper text="CIA Categories" />}
                  details={
                    <Box width="100%" display="flex" justifyContent="space-between">
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
                                  if (dataId === 0 && value === true) {
                                    setValue("confidentiality", false);
                                    setValue("integrity", false);
                                    setValue("availability", false);
                                  }
                                  // if some other checkbox was checked to true, uncheck "Uncategorized"
                                  else if (dataId !== 0 && value === true) setValue("uncategorized", false)
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
                  }
                  className={classes.customAccordion}
                  elevation={0}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomAccordion
                  name="inherent_risk"
                  summary={<TitleWrapper text="Inherent Risk" />}
                  className={classes.customAccordion}
                  elevation={0}
                  expanded={inherentAccordion}
                  onChange={(e, val) => setInherentAccordion(val)}
                  details={
                    <Box sx={{ width: "100%", }}>
                      <Typography className={classes.accordionSubTitle}>Likelihood</Typography>
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
                      <Typography className={classes.accordionSubTitle}>Impact</Typography>
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
                  }
                />
              </Grid>
              {/* Not showing residual risk field if it is not create form */}
              {!isCreateForm() &&
                <Grid item xs={12}>
                  <CustomAccordion
                    name="residual_risk"
                    summary={<TitleWrapper text="Residual Risk" />}
                    className={classes.customAccordion}
                    elevation={0}
                    details={
                      <Box sx={{ width: "100%", }}>
                        <Typography className={classes.accordionSubTitle}>Likelihood</Typography>
                        <Box className={classes.sliderContainer}>
                          <SliderControl
                            name="residual_likelihood"
                            control={control}
                            marks={getSliderMarks(true)}
                            classes={classes}
                            isCreateForm={isCreateForm()}
                          />
                        </Box>
                        <Typography className={classes.accordionSubTitle}>Impact</Typography>
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
                    }
                  />
                </Grid>
              }
              <Grid item xs={12}>
                <FormInput
                  name="notes"
                />
              </Grid>
              {!isCreateForm() &&
                <Grid item xs={12}>
                  <CustomAccordion
                    name="treatment_plan"
                    summary={<TitleWrapper text="Treatment Plan" />}
                    className={classes.customAccordion}
                    elevation={0}
                    details={
                      <Box sx={{ width: "100%", }}>
                        <Box>
                          <RadioControl
                            name="treatment_plan"
                            direction="column"
                            options={treatmentOptions}
                            styleProps={{ className: classes.radioControl }}
                          />
                        </Box>
                        <Typography style={{ marginTop: "10px" }} className={classes.accordionSubTitle}>Controls</Typography>
                        <Box>

                        </Box>
                      </Box>
                    }
                  />
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
        >
          {isCreateForm() ? "ADD" : "UPDATE"}
        </Button>,
      ]}
    >

    </DialogBox>
  )
}

export default RegisterDialog