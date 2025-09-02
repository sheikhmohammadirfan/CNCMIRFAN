import React, { useState, useEffect, useCallback } from "react";
import {
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import {
  Box,
  Button,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  Typography,
  Paper,
  Popover,
  makeStyles,
  Divider,
  Tooltip,
  Menu,
} from "@material-ui/core";
import Chip from "@mui/material/Chip";
import { TextControl } from "../../Utils/Control";
import DataTable from "../../Utils/DataTable/DataTable";
import OptionDropdown from "../../RiskManagement/RiskRegister/OptionDropdown";
import MenuItem from "@mui/material/MenuItem";
import { tableMockData } from "../Accounts/AccountsColumns";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Tab from "@mui/material/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import SystemCards from "./SystemCards";
import DoughnutChart from "./DoughnutChart";
import CompletedStatusContent from "./ReviewStatusPages/CompletedStatusContent";
import InReviewStatusContent from "./ReviewStatusPages/InReviewStatusContent";
import DraftStatusContent from "./ReviewStatusPages/DraftStatusContent";
import { getEntities, getReviewEntities, startReview, submitReview, uploadAccessFile } from "../../../Service/AccessManagement/Reviews";
import { notification } from "../../Utils/Utils";
import { getUser } from "../../../Service/UserFactory";
import RestrictedPage from "../../Rbac/RestrictedPage";
import checkPermissionById from "../../Utils/checkPermission";

const useStyle = makeStyles((theme) => ({
  usersContainer: {
    maxHeight: `calc(100vh - ${theme.headerHeight}px)`,
    overflow: "auto",
    paddingTop: "0",
    padding: theme.spacing(2),
    msOverflowStyle: "none",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  exp_Del_Button: {
    color: theme.palette.primary.main,
    textTransform: "none",
  },
  systemsContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  tableStyle: {
    "& tbody td": { background: "#fff" },
    "& tbody td:not(:first-child)": { overflow: "hidden" },
    "& [checkbox]": { position: "sticky !important", left: 0, zIndex: 2 },
    "& [poam-id]": {
      position: "sticky !important",
      left: 50,
      zIndex: 1,
    },
    "& [header]": {
      zIndex: "3 !important",
      "&[poam-id]": { zIndex: "2 !important" },
    },
    "& thead th:not(:first-child)": {
      "&::before, &::after": {
        position: "absolute",
        fontFamily: "Material Icons",
        right: 0,
        fontSize: 18,
        width: 10,
      },
      "&::before": {
        content: "'\\2193'",
        color: theme.palette.grey[400],
        display: "flex",
        top: 8,
        right: 3,
      },
      "&::after": {
        content: "'\\2191'",
        color: theme.palette.grey[400],
        top: 8,
        right: 10,
      },
      "&.asc::before": {
        content: "'\\2193'",
        color: theme.palette.primary.main,
      },
      "&.dsc::after": {
        content: "'\\2191'",
        color: theme.palette.primary.main,
      },
    },
    "& tr.Mui-selected td:nth-child(1)": {
      boxShadow: `inset 4px 0 0 0 ${theme.palette.primary.main}`,
    },
    "& tr.Mui-selected td": {
      background: "#e6f6f4 !important",
    },
    "& thead th:nth-child(2)": { borderRight: `1px solid #d9d9d9` },
    "& tbody td:nth-child(2)": {
      borderRight: `1px solid ${theme.palette.grey[300]}`,
    },
    "& tbody td[data-searched='true']": { border: `2px solid ${theme.palette.primary.main}` },

    cursor: "pointer",
  },
  dataTableContainer: {
    "& > div": { maxHeight: "50vh" },
    "&.zoomed > div": { maxHeight: "83vh" },
  },
  menuText: {
    color: theme.palette.primary.main,
    fontSize: "0.875rem",
  },
  menuIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
    fontSize: "1rem",
  },
}));

const getStatusChip = (status) => {
  switch (status) {
    case "Completed":
      return (
        <Chip
          variant="outlined"
          label="Completed"
          style={{ minWidth: "100px" }}
          icon={<Icon style={{ color: "green" }}>radio_button_checked</Icon>}
        />
      );
    case "In Review":
      return (
        <Chip
          variant="outlined"
          label="In Review"
          style={{ minWidth: "100px" }}
          icon={<Icon style={{ color: "yellow" }}>radio_button_checked</Icon>}
        />
      );
    case "Draft":
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

const steps = ["Draft", "In review", "Completed"];

// <----------------------------- COMPONENT ----------------------------->
function UserDetails() {

  const requiredViewEntityPermissionId = 10;
  const userHasViewEntityPermission = checkPermissionById(requiredViewEntityPermissionId);

  const requiredEditReviewEntityPerm = 9;
  const userHasEditReviewEntityPerm = checkPermissionById(requiredEditReviewEntityPerm);

  const classes = useStyle();
  const location = useLocation();
  const history = useHistory();
  const { id } = useParams();
  const { data, owner, entities } = location.state || { data: {}, owner: {}, entities: {} };

  const getRowReviewer = (id) => {
    if (!id) return "";
    const reviewer = owner.find(u => u.id === id);
    if (!reviewer) return "";
    return `${reviewer.first_name} ${reviewer.last_name}`;
  }

  const getRowEntity = (id, _entities) => {
    if (!id) return "";
    const entity = _entities.find(u => u.id === id);
    if (!entity) return "";
    return entity.app_name;
  }

  const [loading, setLoading] = useState(false);
  const [reviewAccessData, setReviewAccessData] = useState([]);


  const fetchEntities = useCallback(async () => {
    const { data, status } = await getEntities();
    if (status) return data;
    return [];
  }, []);

  const fetchReviewEntities = useCallback(async (id) => {
    setLoading(true);
    let _entities = entities;
    if (!_entities?.length) {
      _entities = await fetchEntities();
    }
    const { data, status } = await getReviewEntities(id);
    if (status) {
      setReviewAccessData(data.map(en => ({
        ...en,
        reviewer_id: en.reviewer,
        reviewer: getRowReviewer(en.reviewer),
        entity_id: en.entity,
        entity: getRowEntity(en.entity, _entities)
      })))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchReviewEntities(data.id)
  }, [fetchReviewEntities])

  const fetcher = () => fetchReviewEntities(data.id)

  let activeStep = 0;
  if (data) {
    if (data.status === 0) {
      activeStep = 0;
    } else if (data.status === 1) {
      activeStep = 1;
    } else if (data.status === 2) {
      activeStep = 2;
    }
  }

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMoreClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  const uploadAccess = async (e, row) => {
    e.stopPropagation();
    const fileExtension = e.target.files[0].name.split(".").pop();
    if (!["xls", "xlsx", "xlsm", "csv"].includes(fileExtension)) {
      notification('id', "Please select an excel file", 'error')
      return;
    }

    let formData = new FormData();
    formData.append('entity_id', row.entity_id);
    formData.append('file', e.target.files[0]);

    const { status } = await uploadAccessFile(formData);
    if (status) {
      notification('success_id', "Successfully uploaded access file", 'success');
      return fetcher();
    }
  }

  const moveReview = async () => {
    if (data.status === 0) {
      const payload = {
        review_id: parseInt(id)
      }
      const { status } = await startReview(payload);
      if (status) {
        history.replace(`/access-management/reviews/in-review/${id}`, { data: { ...data, status: 1 } })
      }
    }

  }

  const renderContent = () => {
    switch (data.status) {
      case 2:
        return <CompletedStatusContent data={reviewAccessData} loading={loading} hasEditPermission={userHasEditReviewEntityPerm} uploadAccess={uploadAccess} />;
      case 1:
        return <InReviewStatusContent data={reviewAccessData} loading={loading} hasEditPermission={userHasEditReviewEntityPerm} uploadAccess={uploadAccess} />;
      case 0:
        return <DraftStatusContent data={reviewAccessData} loading={loading} hasEditPermission={userHasEditReviewEntityPerm} uploadAccess={uploadAccess} />;
      default:
        return null;
    }
  };

  const renderHeaderButtons = () => {
    if (data.status === 2) {
      return (
        <Box className={classes.buttonContainer}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Icon>delete</Icon>}
            className={classes.exp_Del_Button}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Icon>download</Icon>}
            className={classes.exp_Del_Button}
          >
            Export
          </Button>
        </Box>
      );
    } else if (data.status === 1) {
      return (
        <Box className={classes.buttonContainer}>
          <Tooltip
            placement="bottom-end"
            title={!userHasEditReviewEntityPerm && "You don't have edit access"}
          >
            <span>
              <Button
                onClick={handleMoreClick}
                variant="outlined"
                size="small"
                style={{ width: '100%' }}
                startIcon={<Icon>arrow_drop_down</Icon>}
                className={classes.exp_Del_Button}
                disabled={!userHasEditReviewEntityPerm}
              >
                More
              </Button>
            </span>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMoreClose}
          >
            <MenuItem onClick={handleMoreClose}>
              <Icon className={classes.menuIcon}>mail</Icon>
              <Typography className={classes.menuText}>
                Send reminders
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleMoreClose}>
              <Icon className={classes.menuIcon}>edit</Icon>
              <Typography className={classes.menuText}>Edit</Typography>
            </MenuItem>
            <MenuItem onClick={handleMoreClose}>
              <Icon className={classes.menuIcon}>download</Icon>
              <Typography className={classes.menuText}>Export</Typography>
            </MenuItem>
            <MenuItem onClick={handleMoreClose}>
              <Icon className={classes.menuIcon}>delete</Icon>
              <Typography className={classes.menuText}>Delete</Typography>
            </MenuItem>
          </Menu>
          <Tooltip
            placement="bottom-end"
            title={
              userHasEditReviewEntityPerm
                ? "To complete the review, please ensure all reviews are submitted and all remediation evidence is added under the 'Access changes' tab."
                : "You don't have edit access"
            }
          >
            <span>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Icon>check</Icon>}
                className={classes.exp_Del_Button}
                onClick={moveReview}
                disabled={!userHasEditReviewEntityPerm}
              >
                Complete
              </Button>
            </span>
          </Tooltip>
        </Box>
      );
    } else {
      return (
        <Box className={classes.buttonContainer}>
          <Button
            onClick={handleMoreClick}
            variant="outlined"
            size="small"
            startIcon={<Icon>arrow_drop_down</Icon>}
            className={classes.exp_Del_Button}
          >
            More
          </Button>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMoreClose}
          >
            <MenuItem onClick={handleMoreClose}>
              <Icon className={classes.menuIcon}>edit</Icon>
              <Typography className={classes.menuText}>Edit</Typography>
            </MenuItem>
            <MenuItem onClick={handleMoreClose}>
              <Icon className={classes.menuIcon}>download</Icon>
              <Typography className={classes.menuText}>Export</Typography>
            </MenuItem>
            <MenuItem onClick={handleMoreClose}>
              <Icon className={classes.menuIcon}>delete</Icon>
              <Typography className={classes.menuText}>Delete</Typography>
            </MenuItem>
          </Menu>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Icon>check</Icon>}
            className={classes.exp_Del_Button}
            onClick={moveReview}
          >
            Start review
          </Button>
        </Box>
      );
    }
  };

  return (
    <>
      {!userHasViewEntityPermission
        ? <RestrictedPage /> :
        <Box className={classes.usersContainer}>
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
                    {data.name} {data.dateStarted}{" "}
                    <Chip label={data.status} variant="outlined" />
                  </Typography>
                </Box>
                <Box sx={{ width: "40%" }}>
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
                {renderHeaderButtons()}
                {/* {renderHeaderButtons()} */}
              </Box>
            </Box>
          </Box>

          {renderContent()}
        </Box>
      }
    </>
  );
}

export default UserDetails;
