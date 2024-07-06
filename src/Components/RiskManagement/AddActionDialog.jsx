import React, { useEffect, useState } from 'react'
import DialogBox from '../Utils/DialogBox'
import { Typography } from '@material-ui/core'
import { useStyle } from './RmUtils';
import { Box, Button, Grid } from '@mui/material';
import { DateControl, Form, SelectControl, TextControl } from '../Utils/Control';
import { useForm } from 'react-hook-form';
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

  let formValues = {
    risk: (riskVal && `${riskVal["ID"]}`) || (actionVal && actionVal.risk.id),
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
                <SelectControl
                  name="risk"
                  label="Risk"
                  variant="outlined"
                  options={risks}
                  loading={isLoading('risk')}
                  styleProps={{
                    fullWidth: true,
                  }}
                  disabled={(riskVal || actionVal) ? true : false}
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
                  disabled={(riskVal || actionVal) ? true : false}
                />
              </Grid>
              <Grid item xs={6}>
                <DateControl
                  name="due_date"
                  label="Due Date"
                  variant='outlined'
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <FormInput
                  name="action"
                  label="Action"
                />
              </Grid>
              <Grid item xs={12}>
                <FormInput
                  name="notes"
                  label="Notes"
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
          form="add-action-form"
          type="submit"
          disabled={isFormLoading || isLoading()}
        >
          {isCreateAction ? 'ADD' : 'UPDATE'}
        </Button>,
      ]}
    >

    </DialogBox>
  )
}

export default AddActionDialog