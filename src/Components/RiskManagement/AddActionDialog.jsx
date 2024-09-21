import React, { useEffect, useState } from 'react'
import DialogBox from '../Utils/DialogBox'
import { FormHelperText, TextField, Typography } from '@material-ui/core'
import { useStyle } from './RmUtils';
import { Autocomplete, Box, Button, Grid, Tooltip } from '@mui/material';
import { DateControl, Form, SelectControl, TextControl } from '../Utils/Control';
import { Controller, useForm } from 'react-hook-form';
import { getRegister } from '../../Service/RiskManagement/RiskRegister.service';
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
      {loading("risk")
        ? "Loading Risks..."
        : loading('owner')
          ? "Loading Owneres"
          : ""}
    </Typography>
  ),
});

const AddActionDialog = ({
  hasAccess,
  open,
  closeHandler,
  risks,
  riskVal,
  actionVal,
  isCreateAction,
  owners,
  onFormSubmit,
}) => {

  // Get loading status
  const { isLoading, startLoading, stopLoading } = useLoading({
    risk: false,
    owner: false
  });
  // Set loading state of risk options
  useEffect(() => {
    if (risks.length === 0) startLoading('risk')
    else if (risks.length > 0) stopLoading('risk');
  }, [risks])
  // Set loading state of risk owners
  useEffect(() => {
    if (owners.length === 0) startLoading('owner')
    else if (owners.length > 0) stopLoading('owner');
  }, [owners])

  // Loading status for dialog
  const [isFormLoading, setisFormLoading] = useState(false);

  const validation = {
    risk: { required: 'This field is required' },
    owner: { required: 'This field is required' },
    due_date: { required: 'This field is required' },
    action: { required: 'This field is required' },
    notes: { required: 'This field is required' },
  };

  const disabled = !hasAccess || Boolean(actionVal) || Boolean(riskVal)

  let formValues = {
    risk: (
      (riskVal && risks.find(risk => risk.val === riskVal["ID"])))
      ||
      (actionVal && risks.find(risk => risk.val === actionVal.risk.id)),
    owner: (riskVal && `${riskVal["Owner"]}`) || (actionVal && actionVal.risk.owner),
    due_date: actionVal ? new Date(actionVal.due_date) : null,
    action: actionVal && actionVal.task,
    notes: actionVal && actionVal.notes
  }

  // Get useForm Methods
  const { handleSubmit, getValues, setValue, control, reset } = useForm({
    defaultValues: formValues,
  });



  useEffect(() => {
    reset(formValues);
  }, [riskVal, actionVal])

  const onSubmit = async (values) => {
    setisFormLoading(true);
    await onFormSubmit(values, (isCreateAction && !actionVal));
    setisFormLoading(false);
  }


  const classes = useStyle();

  return (
    <DialogBox
      open={open}
      close={closeHandler}
      title={
        <Typography style={{ fontWeight: "bold" }}>
          {isCreateAction ? 'Add New Action' : 'Update Action'}
        </Typography>
      }
      loading={isFormLoading}
      bottomSeperator={true}
      className={classes.formContainer}
      content={
        <Box>
          <Form
            id="add-action-form"
            control={control}
            rules={validation}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Controller
                  name="risk"
                  control={control}
                  rules={validation.risk}
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <>
                      <Autocomplete
                        value={value}
                        onChange={(e, newVal) => !disabled && onChange(newVal)}
                        options={disabled ? [] : risks}
                        disabled={disabled}
                        noOptionsText={disabled ? "Already Selected !" : "No Options"}
                        // defaultValue={riskVal && risks.find(risk => risk.val === riskVal["ID"])}
                        getOptionLabel={(option) => option.text ? option.text : ""}
                        renderInput={(params) => (
                          // Added error prop here. This results in border becoming red if there's some error
                          <TextField error={error ? true : false} variant="outlined" label="Risk" {...params} />
                        )}
                        loading={isLoading("risk")}
                      />
                      {/* If error, show the error message */}
                      {error &&
                        <FormHelperText style={{ marginLeft: '14px' }} error={Boolean(error)}>
                          {error.message}
                        </FormHelperText>
                      }
                    </>
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <SelectControl
                  name="owner"
                  label="Owner"
                  variant="outlined"
                  options={owners}
                  loading={isLoading('owner')}
                  styleProps={{ fullWidth: true, }}
                  disabled={(!hasAccess || riskVal || actionVal) ? true : false}
                />
              </Grid>
              <Grid item xs={6}>
                <DateControl
                  name="due_date"
                  label="Due Date"
                  variant='outlined'
                  fullWidth
                  disabled={!hasAccess}
                />
              </Grid>
              <Grid item xs={12}>
                <FormInput
                  name="action"
                  label="Action"
                  disabled={!hasAccess}
                />
              </Grid>
              <Grid item xs={12}>
                <FormInput
                  name="notes"
                  label="Notes"
                  disabled={!hasAccess}
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
          disabled={isFormLoading}
        >
          CANCEL
        </Button>,
        <Tooltip
          placement="top-end"
          arrow
          title={!hasAccess && "You don't have write access!"}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            form="add-action-form"
            type="submit"
            disabled={!hasAccess || isFormLoading || isLoading()}
          >
            {isCreateAction ? 'ADD' : 'UPDATE'}
          </Button>,
        </Tooltip>
      ]}
    >

    </DialogBox>
  )
}

export default AddActionDialog