import React, { useState } from 'react'
import DialogBox from '../../Utils/DialogBox'
import { makeStyles, Typography } from '@material-ui/core'
import { Box, Button, Grid, Tooltip } from '@mui/material';
import { Form, TextControl } from '../../Utils/Control';
import { useForm } from 'react-hook-form';
import useLoading from '../../Utils/Hooks/useLoading';

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
  };

  const disabled = !hasAccess

  let formValues = {
    title: "",
    description: ""
  }

  // Get useForm Methods
  const { handleSubmit, control, reset } = useForm({
    defaultValues: formValues,
  });


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
                  minRows={6}
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