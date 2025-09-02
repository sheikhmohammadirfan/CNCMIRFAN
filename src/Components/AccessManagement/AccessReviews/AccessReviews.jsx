import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  Typography,
  Divider,
  Chip,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { TextControl } from "../../Utils/Control";
import DataTable from "../../Utils/DataTable/DataTable";
import OptionDropdown from "../../RiskManagement/RiskRegister/OptionDropdown";
import DoughnutChart from "./DoughnutChart";
import { getEntities, getReviews, postReview } from "../../../Service/AccessManagement/Reviews";
import { obj_to_yyyy_mm_dd } from "../../Utils/DateFormatConverter";
import SkeletonBox from "../../Utils/SkeletonBox";
import { useStyle } from "./AccessReviewsUtils";
import CreateReviewDialog from "./CreateReviewDialog";
import { REVIEW_STATUS_MAP } from "../../../assets/data/AccessManagement/ReviewDecisions/ValuesMap";
import { getOwners } from "../../../Service/RiskManagement/RiskManagement.service";
import { notification } from "../../Utils/Utils";
import { Tooltip } from "@mui/material";
import checkPermissionById from "../../Utils/checkPermission";

const getStatusChip = (status) => {
  switch (status) {
    case 'Completed':
      return (
        <Chip
          variant="outlined"
          label="Completed"
          style={{ minWidth: "100px" }}
          icon={<Icon style={{ color: "green" }}>radio_button_checked</Icon>}
        />
      );
    case 'In Review':
      return (
        <Chip
          variant="outlined"
          label="In Review"
          style={{ minWidth: "100px" }}
          icon={<Icon style={{ color: "yellow" }}>radio_button_checked</Icon>}
        />
      );
    case 'Draft':
      return (
        <Chip
          variant="outlined"
          label="Draft"
          style={{ minWidth: "100px" }}
          icon={<Icon style={{ color: "gray" }}>radio_button_checked</Icon>}
        />
      );
    default:
      return <Chip label={status} />;
  }
};

function AccessReviews() {

  const requiredEditReviewPermission = 13;
  const userHasEditReviewPermission = checkPermissionById(requiredEditReviewPermission);

  const classes = useStyle();
  const history = useHistory();
  // const createBtnRef = useRef(null);
  // const [openCreatePopper, setOpenCreatePropper] = useState(false);
  // const [createAccess, setCreateAccess] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  // const [showCreateReview, setShowCreateReview] = useState(false);
  const [open, setOpen] = useState(false);
  const [entities, setEntities] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const { data } = await getReviews();
    if (data) setFilteredData(data);
    setLoading(false);
  }, [])

  const [usersLoading, setUsersLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const fetchSetUsers = useCallback(async () => {
    setUsersLoading(true)
    const { data, status } = await getOwners();
    if (status) setUsers(data);
    setUsersLoading(false)
  }, [])

  useEffect(() => {
    fetchSetUsers()
  }, [fetchSetUsers])

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const fetchEntities = useCallback(async () => {
    const { data, status } = await getEntities();
    if (status) setEntities(data);
  }, []);

  useEffect(() => {
    fetchEntities();
  }, [fetchEntities])

  //Dropdown options data
  const reviewerOptions = [
    { text: 'Reviewer_1', value: 'Reviewer_1' },
    { text: 'Reviewer_2', value: 'Reviewer_2' },
    { text: 'Clear', value: '' },
  ];

  const inherentRiskOptions = [
    { text: 'Low', value: 'Low' },
    { text: 'Medium', value: 'Medium' },
    { text: 'High', value: 'High' },
    { text: 'Clear', value: '' },
  ];

  const accessIntegrationOptions = [
    { text: 'Yes', value: 'Yes' },
    { text: 'No', value: 'No' },
    { text: 'Clear', value: '' },
  ];

  const riskData = {
    labels: ["Critical", "High", "Medium", "Low", "Unscored"],
    datasets: [
      {
        data: [2, 16, 9, 1, 1],
        backgroundColor: ["red", "orange", "gold", "green", "#A9A9A9"],
        borderColor: ["red", "orange", "gold", "green", "#A9A9A9"],
        borderWidth: 1,
      },
    ],
  };

  const getRowOwner = (id) => {
    if (!id) return "";
    const owner = users.find(u => u.id === id);
    if (!owner) return "";
    return `${owner.first_name} ${owner.last_name}`;
  }

  // const handleFilter = () => {
  //   let data = tableMockData;
  //   if (selectedStatus)
  //     data = data.filter((item) => item.status.includes(selectedStatus));
  //   if (searchValue)
  //     data = data.filter((item) =>
  //       item.name.toLowerCase().includes(searchValue.toLowerCase())
  //     );
  //   setFilteredData(data);
  // };

  // useEffect(() => {
  //   handleFilter();
  // }, [selectedStatus, searchValue]);

  // const handleCreateAccessChange = (event) => {
  //   setCreateAccess(event.target.value);
  // };

  const handleDropdownChange = (setter) => (value) => {
    setter(value);
  };

  const handleRowClick = (reviewId) => {
    const selectedItem = filteredData.find(review => review.id === reviewId);
    let url = `/access-management/reviews/in-review/${reviewId}`

    if (selectedItem.status === 0) url = `/access-management/reviews/draft/${reviewId}`;
    else if (selectedItem.status === 1) url = `/access-management/reviews/in-review/${reviewId}`;
    else if (selectedItem.status === 2) url = `/access-management/reviews/completed/${reviewId}`

    history.push(url, {
      data: selectedItem,
      owner: users,
      entities
    });
  };

  // const handleShowCreateReview = () => {
  //   setShowCreateReview(true);
  // };

  // const handleHideCreateReview = () => {
  //   setShowCreateReview(false);
  // };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleReviewSubmit = async (formValues, entities, selectedEntities) => {

    if (selectedEntities.length === 0) {
      notification("any", "Select an Entity to Review", 'error');
      return;
    }

    let futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 2);

    const payload = {
      name: formValues.name,
      reviewer_id_list: Array(selectedEntities.length).fill(formValues.reviewer),
      status: 0,
      start_date: new Date(),
      end_date: futureDate,
      entity_id_list: selectedEntities.map(index => entities[index].id)
    }
    try {
      const res = await postReview(payload);
      if (res) handleClose();
      fetchReviews();
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <Box className={classes.reviewsContainer}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box width="100%">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            style={{
              borderBottom: "1px solid #989898",
              padding: "5px 0 20px 0",
            }}
          >
            <Box>
              <Typography noWrap variant="h5" className={classes.titleStyle}>
                Access Reviews
              </Typography>
            </Box>
            <Box className={classes.buttonContainer}>
              <Tooltip title={!userHasEditReviewPermission && "You don't have edit access"} placement="bottom-end">
                <span>
                  <Button
                    // onClick={handleShowCreateReview}
                    onClick={handleClickOpen}
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={<Icon>add</Icon>}
                    disabled={!userHasEditReviewPermission}
                  >
                    Create Review
                  </Button>
                </span>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box mt={2} style={{ display: "flex", justifyContent: "space-between" }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={6} lg={6}>
            <Box border={1} p={2}>
              <Typography variant="h6">Access review progress</Typography>
            </Box>
            <Box borderBottom={1} borderRight={1} borderLeft={1} p={2}>
              <DoughnutChart data={riskData} />
            </Box>
          </Grid>
          <Grid item xs={6} md={6} lg={6}>
            <Box border={1} p={2}>
              <Typography variant="h6">To-do list</Typography>
            </Box>
            <Box
              borderBottom={1}
              borderRight={1}
              borderLeft={1}
              overflowY="scroll"
              height="183px"
            >
              <Box
                display="flex"
                alignContent="center"
                justifyContent="space-between"
                width="100%"
                height="33%"
                sx={{ textTransform: "none" }}
              >
                <Box p={2}>
                  <Typography align="left">Complete access review</Typography>
                </Box>
                <Box p={2}>
                  <Typography>Due Apr 18</Typography>
                </Box>
              </Box>
              <Divider />
              <Box
                display="flex"
                alignContent="center"
                justifyContent="space-between"
                width="100%"
                height="33%"
                sx={{ textTransform: "none" }}
              >
                <Box p={2}>
                  <Typography align="left">Start review</Typography>
                </Box>
                <Box p={2}>
                  <Typography>Due Jun 3</Typography>
                </Box>
              </Box>
              <Divider />
              <Box
                display="flex"
                alignContent="center"
                justifyContent="space-between"
                width="100%"
                height="33%"
                sx={{ textTransform: "none" }}
              >
                <Box p={2}>
                  <Typography align="left">Complete review</Typography>
                </Box>
                <Box p={2}>
                  <Typography>Due Jun 17</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

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
            label=" "
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
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Box>

        <Box display="flex" alignItems="center" gridColumnGap={10}>
          <OptionDropdown
            open={statusOpen}
            handleClose={() => setStatusOpen(false)}
            placement="bottom-start"
            options={[
              {
                text: "Draft",
                clickHandler: () =>
                  handleDropdownChange(setSelectedStatus)("Draft"),
              },
              {
                text: "In review",
                clickHandler: () =>
                  handleDropdownChange(setSelectedStatus)("In review"),
              },
              {
                text: "Completed",
                clickHandler: () =>
                  handleDropdownChange(setSelectedStatus)("Completed"),
              },
              {
                text: "Clear",
                clickHandler: () => handleDropdownChange(setSelectedStatus)(""),
              },
            ]}
          >
            <Button
              size="medium"
              endIcon={
                <Icon style={{ rotate: "90deg" }}>arrow_forward_ios</Icon>
              }
              className={classes.dropdownButton}
              style={{
                backgroundColor: "transparent",
                color: "#4477CE",
                textTransform: "none",
                paddingInline: 10,
                border: "none",
              }}
              onClick={() => setStatusOpen((prev) => !prev)}
            >
              {selectedStatus || "Status"}
            </Button>
          </OptionDropdown>

          <OptionDropdown
            open={statusOpen}
            handleClose={() => setStatusOpen(false)}
            placement="bottom-start"
            options={[
              {
                text: "Draft",
                clickHandler: () =>
                  handleDropdownChange(setSelectedStatus)("Draft"),
              },
              {
                text: "Completed",
                clickHandler: () =>
                  handleDropdownChange(setSelectedStatus)("Completed"),
              },
              {
                text: "Clear",
                clickHandler: () => handleDropdownChange(setSelectedStatus)(""),
              },
            ]}
          >
            <Button
              size="medium"
              endIcon={
                <Icon style={{ rotate: "90deg" }}>arrow_forward_ios</Icon>
              }
              className={classes.dropdownButton}
              style={{
                backgroundColor: "transparent",
                color: "#4477CE",
                textTransform: "none",
                paddingInline: 10,
                border: "none",
              }}
              onClick={() => setStatusOpen((prev) => !prev)}
            >
              {selectedStatus || "Status"}
            </Button>
          </OptionDropdown>

          <OptionDropdown
            open={statusOpen}
            handleClose={() => setStatusOpen(false)}
            placement="bottom-start"
            options={[
              {
                text: "Draft",
                clickHandler: () =>
                  handleDropdownChange(setSelectedStatus)("Draft"),
              },
              {
                text: "Completed",
                clickHandler: () =>
                  handleDropdownChange(setSelectedStatus)("Completed"),
              },
              {
                text: "Clear",
                clickHandler: () => handleDropdownChange(setSelectedStatus)(""),
              },
            ]}
          >
            <Button
              size="medium"
              endIcon={
                <Icon style={{ rotate: "90deg" }}>arrow_forward_ios</Icon>
              }
              className={classes.dropdownButton}
              style={{
                backgroundColor: "transparent",
                color: "#4477CE",
                textTransform: "none",
                paddingInline: 10,
                border: "none",
              }}
              onClick={() => setStatusOpen((prev) => !prev)}
            >
              {selectedStatus || "Status"}
            </Button>
          </OptionDropdown>
        </Box>
      </Box>

      {loading ?
        <SkeletonBox text="Loading Reviews..." height="30vh" width="100%" /> :
        <Grid container spacing={1} className={classes.dataTableContainer}>
          <Grid item xs={12}>
            <DataTable
              className={classes.tableStyle}
              checkbox={false}
              serialNo={false}
              stickyHeader={true}
              verticalBorder={true}
              resizeTable={true}
              header={{
                data: [
                  { text: "Name" },
                  { text: "Owner" },
                  { text: "Date Started" },
                  { text: "Date Completed" },
                  { text: "Status" },
                ],
              }}
              rowList={{
                rowData: filteredData.map((item, index) => ({
                  data: [
                    { text: item.name },
                    { text: getRowOwner(item.creator) },
                    { text: item.start_date && obj_to_yyyy_mm_dd(new Date(item.start_date)) },
                    { text: item.end_date && obj_to_yyyy_mm_dd(new Date(item.end_date)) },
                    {
                      text: getStatusChip(REVIEW_STATUS_MAP[item.status])
                    },
                  ],
                  props: { onClick: () => handleRowClick(item.id) }, // Adding onClick here
                })),
              }}
              minCellWidth={[300, 200, 250, 250, 250]}
            />
          </Grid>
        </Grid>
      }

      <CreateReviewDialog
        open={open}
        handleClose={handleClose}
        reviewerOptions={reviewerOptions}
        handleDropdownChange={handleDropdownChange}
        inherentRiskOptions={inherentRiskOptions}
        accessIntegrationOptions={accessIntegrationOptions}
        filteredData={filteredData}
        users={users}
        usersLoading={usersLoading}
        handleReviewSubmit={handleReviewSubmit}
        entities={entities}
      />

    </Box>
  );
}

export default AccessReviews;
