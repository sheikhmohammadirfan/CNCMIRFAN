import React, { useState } from 'react'
import DialogBox from '../../Utils/DialogBox'
import { makeStyles } from '@material-ui/core'
import { Box, Button, Grid, Icon, List, ListItem, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material';
import { Form, SelectControl, TextControl } from '../../Utils/Control';
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
    maxRows={20}
    {...rest}
  />
);

const useStyle = makeStyles(theme => ({
  formContainer: {
    "& .MuiPaper-root": {
      minWidth: '600px',
    },
    "& .MuiDialogContent-root": {
      padding: "24px",
    }
  },
  controlListContainer: {
    padding: '18.5px 14px',
    border: '1px solid rgba(0, 0, 0, 0.23)'
  },
  controlListHead: {
    fontSize: '0.95rem',
    color: '#444'
  },
  controlItem: {
    '&.MuiListItem-root': {
      paddingBlock: '2px',
      paddingLeft: 0
    },
    '& .MuiListItemText-root': {
      marginBlock: 0
    },
    '& .MuiTypography-root': {
      fontSize: '0.9rem',
      color: '#666'
    }
  },
  controlItemIcon: {
    '&.MuiListItemIcon-root': {
      minWidth: 'auto',
      marginRight: '8px',
    },
    '& .MuiIcon-root': {
      fontSize: '1rem',
      color: '#bababa'
    }
  }
}))

// Status text based on loading value
// const LoadingStatus = (loading) => ({
//   prop: {
//     style: { flexGrow: 1, fontStyle: "italic", paddingLeft: 8 },
//   },
//   element: (
//     <Typography noWrap>
//       {loading("risk")
//         ? "Loading Risks..."
//         : loading('owner')
//           ? "Loading Owneres"
//           : ""}
//     </Typography>
//   ),
// });

const Dialog = ({
  hasAccess,
  open,
  closeHandler,
  isCreatePolicy,
  onFormSubmit,
}) => {

  // Loading status for dialog
  const [isFormLoading, setisFormLoading] = useState(false);

  // Get loading status
  const { isLoading } = useLoading();

  const validation = {
    title: { required: "This field is required" },
    description: { required: "This field is required" },
    applicable_frameworks: { required: "This field is required" }
  };

  const disabled = !hasAccess

  let formValues = {
    title: "",
    description: ""
  }

  // Get useForm Methods
  const { handleSubmit, control, reset, getValues } = useForm({
    defaultValues: formValues,
  });

  const [framework, setFramework] = useState(null);

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
          {isCreatePolicy ? 'Add New Policy' : 'Update Policy'}
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
                <FormInput
                  name="title"
                  label="Title"
                  disabled={!hasAccess}
                />
              </Grid>

              <Grid item xs={12}>
                <FormInput
                  name="description"
                  label="Description"
                  disabled={!hasAccess}
                  minRows={4}
                />
              </Grid>

              <Grid item xs={12}>
                <Box className={classes.controlListContainer}>
                  <AutocompleteControl
                    name='applicable_frameworks'
                    label='Applicable Frameworks'
                    control={control}
                    rules={validation}
                    multiple={true}
                    optionList={[
                      {
                        id: "hipaa",
                        label: "HIPAA"
                      },
                      {
                        id: "fedramp",
                        label: "FedRAMP"
                      },
                    ]}
                    disabled={false}
                    onValueChange={(newVal) => setFramework(newVal)}
                  />
                  {framework?.length > 0 ? (
                    <Box mt={2} px={1}>
                      <Box>
                        <Typography className={classes.controlListHead}>Corresponding controls:</Typography>
                      </Box>
                      <Box>
                        <List>
                          <ListItem className={classes.controlItem}>
                            <ListItemIcon className={classes.controlItemIcon}>
                              <Icon>fiber_manual_record</Icon>
                            </ListItemIcon>
                            <ListItemText primary="AC-1 Policy and Procedures" />
                          </ListItem>
                          <ListItem className={classes.controlItem}>
                            <ListItemIcon className={classes.controlItemIcon}>
                              <Icon>fiber_manual_record</Icon>
                            </ListItemIcon>
                            <ListItemText primary="AC-2 Account Management" />
                          </ListItem>
                        </List>
                      </Box>
                    </Box>
                  ) : (
                    <Box mt={2} px={1}>
                      <Typography fontSize='0.95rem' color='#888'>Select a framework to see applicable controls</Typography>
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid item xs={6}>
                <SelectControl
                  name="document_owner"
                  label="Document Owner"
                  variant="outlined"
                  options={[
                    {
                      val: 0,
                      text: "Affan Ansari"
                    },
                    {
                      val: 1,
                      text: "Saif Mulla"
                    },
                    {
                      val: 0,
                      text: "Irshad Siddiqui"
                    },
                  ]}
                  styleProps={{ fullWidth: true, }}
                  disabled={!hasAccess}
                />
              </Grid>

              <Grid item xs={6}>
                <SelectControl
                  name="policy_owner"
                  label="Policy Owner"
                  variant="outlined"
                  options={[
                    {
                      val: 0,
                      text: "Affan Ansari"
                    },
                    {
                      val: 1,
                      text: "Saif Mulla"
                    },
                    {
                      val: 0,
                      text: "Irshad Siddiqui"
                    },
                  ]}
                  styleProps={{ fullWidth: true, }}
                  disabled={!hasAccess}
                />
              </Grid>
            </Grid>
          </Form>
        </Box>
      }
      actions={[
        // LoadingStatus(isLoading),
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
            disabled={!hasAccess || isFormLoading}
          >
            {isCreatePolicy ? 'ADD' : 'UPDATE'}
          </Button>,
        </Tooltip>
      ]}
    >

    </DialogBox>
  )
}

export default Dialog