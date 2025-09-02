import React, { useCallback, useEffect, useState } from 'react'
import { useStyle } from './AccessReviewsUtils'
import { Box, Button, Chip, Dialog, DialogContent, DialogTitle, Grid, Icon, IconButton, InputAdornment, Typography } from '@material-ui/core';
import { Form, SelectControl, TextControl } from '../../Utils/Control';
import OptionDropdown from '../../RiskManagement/RiskRegister/OptionDropdown';
import DataTable from '../../Utils/DataTable/DataTable';
import { getEntities } from '../../../Service/AccessManagement/Reviews';
import { useForm } from 'react-hook-form';
import { Divider } from '@mui/material';

const getRiskChip = (risk) => {
  switch (risk) {
    case 'High':
      return (
        <Chip
          variant="outlined"
          label="High"
          style={{ minWidth: "100px" }}
          icon={<Icon style={{ color: "red" }}>keyboard_double_arrow_up</Icon>}
        />
      );
    case 'Medium':
      return (
        <Chip
          variant="outlined"
          label="Medium"
          style={{ minWidth: "100px" }}
          icon={<Icon style={{ color: "yellow" }}>remove</Icon>}
        />
      );
    case 'Low':
      return (
        <Chip
          variant="outlined"
          label="Low"
          style={{ minWidth: "100px" }}
          icon={<Icon style={{ color: "green" }}>keyboard_double_arrow_down</Icon>}
        />
      );
    default:
      return <Chip label={risk} />;
  }
};

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

const CreateReviewDialog = ({
  open,
  handleClose,
  reviewerOptions,
  handleDropdownChange,
  inherentRiskOptions,
  accessIntegrationOptions,
  filteredData,
  users,
  usersLoading,
  handleReviewSubmit,
  entities: _entities
}) => {

  // const [reviewerOpen, setReviewerOpen] = useState(false)
  // const [selectedReviewer, setSelectedReviewer] = useState("")
  const [inherentRiskOpen, setInherentRiskOpen] = useState(false)
  const [selectedInherentRisk, setSelectedInherentRisk] = useState("")
  const [accessIntegrationOpen, setAccessIntegrationOpen] = useState(false)
  const [selectedAccessIntegration, setSelectedAccessIntegration] = useState("")

  const [, setLoading] = useState(false);
  const [entities, setEntities] = useState(_entities || []);

  const fetchEntities = useCallback(async () => {
    setLoading(true);
    const { data, status } = await getEntities();
    if (status) setEntities(data)
    setLoading(false);
  }, [])

  useEffect(() => {
    fetchEntities();
  }, [fetchEntities])

  const { handleSubmit, control } = useForm();

  const validation = {
    name: { required: "This field is required." },
    reviewer: { required: "This field is required." }
  }

  const [selectedRows, setSelectedRows] = useState([]);

  const [searchValue, setSearchValue] = useState('');
  const updateSearch = (e) => setSearchValue(e.target.value);

  const onSubmit = (values) => {
    // send entities and selected entities in callback function
    handleReviewSubmit(values, entities, selectedRows)
  }

  const classes = useStyle();

  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      <Form
        id="review-form"
        control={control}
        rules={validation}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DialogTitle className={classes.dialogTitle}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box style={{ display: "flex", gap: "5px", alignItems: "center" }}>
              <Box className={classes.closeBox}>
                <Button onClick={handleClose}>
                  <Icon>close</Icon>
                </Button>
              </Box>

              <Typography variant="h6">Creating a Review</Typography>
              <Icon style={{ fontSize: "16px", color: "#4477ce" }}>info</Icon>
            </Box>
            <Box>
              <Button form="review-form" type='submit' variant="contained" color='primary' className={classes.createRevBtn} onClick={handleSubmit}>
                Create draft review
              </Button>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box className={classes.createRevContainer}>
            <Box sx={{ mb: 2 }} style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: "10px" }}>
              <FormInput
                name="name"
                label="Review Name"
                rows={1}
              />
            </Box>

            <Box
              sx={{ mb: 3 }}
            >
              <SelectControl
                name="reviewer"
                label="Reviewer"
                variant="outlined"
                options={users.map(o => ({ val: o.id, text: `${o.first_name} ${o.last_name}` }))}
                styleProps={{ fullWidth: true, }}
                loading={usersLoading}
              />
            </Box>

            <Divider />
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                margin: "20px 0",
                gap: "30px",
              }}
            >
              <Box display="flex" gridColumnGap={15} alignItems="center">
                <TextControl
                  variant="outlined"
                  placeholder="Search"
                  size="small"
                  gutter={false}
                  className={classes.searchInput}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton size="small">
                          <Icon>search</Icon>
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  value={searchValue}
                  onChange={updateSearch}
                />
              </Box>

              <Box display="flex" alignItems="center" gridColumnGap={10}>

                <OptionDropdown
                  open={inherentRiskOpen}
                  handleClose={() => setInherentRiskOpen(false)}
                  placement="bottom-start"
                  options={inherentRiskOptions.map((option) => ({
                    text: option.text,
                    clickHandler: () => handleDropdownChange(setSelectedInherentRisk)(option.value),
                  }))}
                >
                  <Button
                    size="medium"
                    endIcon={<Icon style={{ transform: 'rotate(90deg)' }}>arrow_forward_ios</Icon>}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#4477CE',
                      textTransform: 'none',
                      paddingInline: 10,
                      border: 'none',
                    }}
                    onClick={() => setInherentRiskOpen((prev) => !prev)}
                  >
                    {selectedInherentRisk || 'Inherent Risk'}
                  </Button>
                </OptionDropdown>

                <OptionDropdown
                  open={accessIntegrationOpen}
                  handleClose={() => setAccessIntegrationOpen(false)}
                  placement="bottom-start"
                  options={accessIntegrationOptions.map((option) => ({
                    text: option.text,
                    clickHandler: () => handleDropdownChange(setSelectedAccessIntegration)(option.value),
                  }))}
                >
                  <Button
                    size="medium"
                    endIcon={<Icon style={{ transform: 'rotate(90deg)' }}>arrow_forward_ios</Icon>}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#4477CE',
                      textTransform: 'none',
                      paddingInline: 10,
                      border: 'none',
                    }}
                    onClick={() => setAccessIntegrationOpen((prev) => !prev)}
                  >
                    {selectedAccessIntegration || 'Access Integration'}
                  </Button>
                </OptionDropdown>
              </Box>
            </Box>
            <Grid container spacing={1} className={classes.dataTableContainer}>
              <Grid item xs={12}>
                <DataTable
                  className={classes.tableStyle}
                  checkbox={true}
                  serialNo={false}
                  stickyHeader={true}
                  verticalBorder={true}
                  resizeTable={true}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  header={{
                    data: [
                      { text: "System" },
                      { text: "Reviewer" },
                      { text: "Inherent Risk" },
                      { text: "Integration Status" },
                    ],
                  }}
                  rowList={{
                    rowData: entities.map((item, index) => ({
                      data: [
                        { text: item.app_name },
                        { text: item.reviewer },
                        {
                          text: getRiskChip(item.inherentRisk)
                        },
                        { text: item.integrationStatus },
                      ]
                    })),
                  }}
                  minCellWidth={[350, 350, 350, 350]}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Form>
    </Dialog>
  )
}

export default CreateReviewDialog