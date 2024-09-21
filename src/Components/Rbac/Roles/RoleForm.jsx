import React, { useMemo, useState } from 'react'
import useLoading from '../../Utils/Hooks/useLoading';
import { Controller, useForm } from 'react-hook-form';
import { useStyle } from './utils';
import DialogBox from '../../Utils/DialogBox';
import { Box, Button, Checkbox, Divider, FormControlLabel, Grid, Stack, Typography } from '@mui/material';
import { Form, TextControl } from '../../Utils/Control';
import { PERMISSIONS_MOCK } from '../../../assets/data/Rbac/Roles/datamock';

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
      {loading("permissions")
        ? "Loading Permissions..."
        : ""}
    </Typography>
  ),
});


// <------------------------------ COMPONENT ------------------------------->
const RoleForm = ({
  open,
  closeHandler,
  permissionsArray,
  row,
  onFormSubmit
}) => {

  const { isLoading, startLoading, stopLoading } = useLoading({
    roles: false,
  });

  // Loading status for dialog
  const [isFormLoading, setisFormLoading] = useState(false);

  const validation = {
    name: { required: "This field is required." },
  };

  const { name, id, ...permissions } = row || {};

  const formValues = useMemo(() => {
    const values = {}
    if (!row) return values;
    for (const p of permissions.permissions) {
      values[p.permission_name] = {
        id: p.id,
        permission_name: p.permission_name,
        checked: true,
      }
    }
    values['name'] = name;
    return values;
  }, [row])

  const { handleSubmit, control } = useForm({
    defaultValues: formValues,
  });

  // <-------------------------------- HANDLE FORM SUBMIT -------------------------------->
  const onSubmit = async (values) => {
    setisFormLoading(true);
    await onFormSubmit(values, row?.id || -1);
    setisFormLoading(false);
  }

  const classes = useStyle();

  return (
    <DialogBox
      open={open}
      close={closeHandler}
      title={
        <Typography style={{ fontWeight: "bold" }}>
          {row ? 'Edit Role' : "Create New Role"}
        </Typography>
      }
      loading={isFormLoading}
      bottomSeperator={true}
      className={classes.formContainer}
      content={
        <Box>
          <Form
            id="role-form"
            control={control}
            rules={validation}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormInput
                  name="name"
                  label="Name"
                  disabled={false}
                  rows={1}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  sx={{ pb: 1, color: '#8D8D8D' }}
                >
                  This role will be able to:
                </Typography>
                <Grid container>
                  {permissionsArray && permissionsArray.map((permission, index) => (
                    <Grid
                      key={index}
                      item
                      xs={4}
                    >
                      <FormControlLabel
                        label={permission.permission_name}
                        className={classes.permissionLabel}
                        control={
                          <Controller
                            name={permission.permission_name}
                            control={control}
                            render={({ field: { value, onChange } }) => {
                              return (
                                <Checkbox
                                  checked={value?.checked || false}
                                  onChange={(e, newVal) => {
                                    onChange({
                                      id: permission.id,
                                      permission_name: permission.permission_name,
                                      checked: e.target.checked,
                                    })
                                  }}
                                />
                              )
                            }}
                          />
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
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
          form="role-form"
          type="submit"
          disabled={isFormLoading || isLoading()}
        >
          {row ? 'EDIT' : "ADD"}
        </Button>,
      ]}
    />
  )
}

export default RoleForm