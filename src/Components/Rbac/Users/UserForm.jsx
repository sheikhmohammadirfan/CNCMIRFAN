import React, { useState } from 'react'
import DialogBox from '../../Utils/DialogBox'
import { Box, Button, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Typography } from '@mui/material'
import { useStyle } from './utils';
import { Form, TextControl } from '../../Utils/Control';
import { Controller, useForm } from 'react-hook-form';
import useLoading from '../../Utils/Hooks/useLoading';
import AutocompleteControl from '../../Utils/Control/Autocomplete.control';
import colorShader from '../../Utils/ColorShader';

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

// MAIN COMPONENT
const UserForm = ({
  open,
  closeHandler,
  rowIndex,
  row,
  rolesList,
  onFormSubmit
}) => {

  // Get loading status
  const { isLoading, startLoading, stopLoading } = useLoading({
    roles: false,
  });

  // Loading status for dialog
  const [isFormLoading, setisFormLoading] = useState(false);

  const validation = {
    first_name: { required: "This field is required." },
    last_name: { required: "This field is required." },
    email: { required: "This field is required." },
    role: { required: "This field is required" },
    status: { required: "This field is required" }
  };

  const formValues = (row) ? {
    first_name: row.first_name,
    last_name: row.last_name,
    email: row.email,
    role: { id: row.roles[0]?.id, label: row.roles[0]?.name },
    status: `${row.status}`
  } : {}

  const { handleSubmit, getValues, setValue, control, reset, formState: { errors } } = useForm({
    defaultValues: formValues,
  });

  // <-------------------------------- HANDLE FORM SUBMIT -------------------------------->
  const onSubmit = async (values) => {
    setisFormLoading(true);
    await onFormSubmit(values, row && row.id);
    setisFormLoading(false);
  }

  const classes = useStyle();

  return (
    <DialogBox
      open={open}
      close={closeHandler}
      title={
        <Typography style={{ fontWeight: "bold" }}>
          {row ? "Edit User" : "Create New User"}
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
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <FormInput
                  name="first_name"
                  label="First Name"
                  rows={1}
                />
              </Grid>
              <Grid item xs={6}>
                <FormInput
                  name="last_name"
                  label="Last Name"
                  rows={1}
                />
              </Grid>
              <Grid item xs={12}>
                <FormInput
                  name="email"
                  label="Email"
                  disabled={Boolean(row)}
                  rows={1}
                />
              </Grid>
              <Grid item xs={12}>
                <AutocompleteControl
                  name='role'
                  label='Role'
                  control={control}
                  rules={validation}
                  multiple={false}
                  optionList={rolesList}
                  disabled={false}
                />
              </Grid>
              {row &&
                <Grid item xs={12}>
                  <Box p={2} bgcolor='#f4f4f4' borderRadius={1}>
                    <FormControl sx={{ flexDirection: 'row', alignItems: 'center', columnGap: 4, }}>
                      <FormLabel sx={{ '&.Mui-focused': { color: colorShader('000000', 0.6) } }}>Status: </FormLabel>
                      <Controller
                        control={control}
                        name="status"
                        render={({ field: { value, onChange } }) => {
                          return (
                            <RadioGroup row value={value || null} onChange={onChange}>
                              <FormControlLabel value={1} control={<Radio size='small' />} label="Active" />
                              <FormControlLabel value={0} control={<Radio size='small' />} label="Inactive" />
                            </RadioGroup>
                          )
                        }}
                      />
                    </FormControl>
                  </Box>
                  {errors?.status}
                </Grid>}
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
          {row ? "EDIT" : "ADD"}
        </Button>,
      ]}
    />
  )
}

export default UserForm
