import React, { useEffect, useState } from 'react'
import DialogBox from '../Utils/DialogBox'
import { Typography } from '@material-ui/core'
import { useStyle } from './RmUtils';
import { Box, Button, Grid } from '@mui/material';
import { DateControl, Form, SelectControl, TextControl } from '../Utils/Control';
import { useForm } from 'react-hook-form';
import { getRegister } from '../../Service/RiskManagement/RiskRegister.service';

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
  // Loading status for dialog
  const [isLoading, setisLoading] = useState(false);

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
    setisLoading(true);
    await onFormSubmit(values, (isCreateAction && !actionVal));
    setisLoading(false);
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
      loading={isLoading}
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
          disabled={isLoading}
        >
          {isCreateAction ? 'ADD' : 'UPDATE'}
        </Button>,
      ]}
    >

    </DialogBox>
  )
}

export default AddActionDialog