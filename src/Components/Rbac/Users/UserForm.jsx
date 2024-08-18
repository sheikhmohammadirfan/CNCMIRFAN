import React, { useState } from 'react'
import DialogBox from '../../Utils/DialogBox'
import { Box, Button, Grid, Typography } from '@mui/material'
import { useStyle } from './utils';
import { Form, TextControl } from '../../Utils/Control';
import { useForm } from 'react-hook-form';
import useLoading from '../../Utils/Hooks/useLoading';
import AutocompleteControl from '../../Utils/Control/Autocomplete.control';

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
      {loading("roles")
        ? "Loading Roles..."
        : ""}
    </Typography>
  ),
});

const dummyRoles = [
  {
    id: 1,
    label: 'Admin'
  },
  {
    id: 2,
    label: 'Super Admin'
  }
]

const UserForm = ({
  open,
  closeHandler,
  rowIndex,
  row,
  onFormSubmit
}) => {

  // Get loading status
  const { isLoading, startLoading, stopLoading } = useLoading({
    roles: false,
  });

  // Loading status for dialog
  const [isFormLoading, setisFormLoading] = useState(false);

  const validation = {
    name: { required: "This field is required." },
    email: { required: "This field is required." },
    department: { required: "This field is required" },
    role: { required: "This field is required" },
  };

  const formValues = (row) ? {
    name: row.name,
    email: row.email,
    role: JSON.parse(row.role)
  } : {}

  const { handleSubmit, getValues, setValue, control, reset, formState: { errors } } = useForm({
    defaultValues: formValues,
  });

  // <-------------------------------- HANDLE FORM SUBMIT -------------------------------->
  const onSubmit = async (values) => {
    setisFormLoading(true);
    await onFormSubmit(values);
    setisFormLoading(false);
  }

  const classes = useStyle();

  return (
    <DialogBox
      open={open}
      close={closeHandler}
      title={
        <Typography style={{ fontWeight: "bold" }}>
          {"Create New User"}
        </Typography>
      }
      loading={isFormLoading}
      bottomSeperator={true}
      className={classes.formContainer}
      content={
        <Box>
          <Form
            id="user-form"
            control={control}
            rules={validation}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormInput
                  name="name"
                  label="Name"
                  disabled={false}
                  maxRows={5}
                />
              </Grid>
              <Grid item xs={6}>
                <FormInput
                  name="email"
                  label="Email"
                  disabled={false}
                  maxRows={5}
                />
              </Grid>
              <Grid item xs={12}>
                <AutocompleteControl
                  name='role'
                  label='Role'
                  control={control}
                  rules={validation}
                  multiple={true}
                  optionList={dummyRoles}
                  disabled={false}
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
        <Button
          variant="contained"
          color="primary"
          size="large"
          form="user-form"
          type="submit"
          disabled={isFormLoading || isLoading()}
        >
          {"ADD"}
        </Button>,
      ]}
    />
  )
}

export default UserForm