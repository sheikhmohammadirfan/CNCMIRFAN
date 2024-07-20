import React, { useState, useEffect } from "react";
import {
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
import CompletedStatusContent from "./CompletedStatusContent";
import InReviewStatusContent from "./InReviewStatusContent";
import DraftStatusContent from "./DraftStatusContent";

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
        color: "#4477CE",
      },
      "&.dsc::after": {
        content: "'\\2191'",
        color: "#4477CE",
      },
    },
    "& tr.Mui-selected td:nth-child(1)": {
      boxShadow: "inset 4px 0 0 0 #4477CE",
    },
    "& tr.Mui-selected td": {
      background: "#e6f6f4 !important",
    },
    "& thead th:nth-child(2)": { borderRight: `1px solid #d9d9d9` },
    "& tbody td:nth-child(2)": {
      borderRight: `1px solid ${theme.palette.grey[300]}`,
    },
    "& tbody td[data-searched='true']": { border: "2px solid #4477CE" },

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

const CompletedContent = ({ classes }) => (
  <>
    <Box className={classes.systemsContainer} width="100%">
      <SystemCards
        iconName="fact_check"
        title="# of systems reviewed"
        count="1"
      />
      <SystemCards
        iconName="how_to_reg"
        title="# of accounts reviewed"
        count="163"
      />
      <SystemCards iconName="warning" title="# of accounts flagged" count="0" />
      <SystemCards
        iconName="manage_accounts"
        title="# of access changes"
        count="12"
      />
    </Box>
  </>
);

const InReviewContent = ({ data }) => (
  <Grid container spacing={2}>
    <Grid item xs={6} md={6} lg={6}>
      <Box border={1} p={2}>
        <Typography variant="h6">Access review progress</Typography>
      </Box>
      <Box borderBottom={1} borderRight={1} borderLeft={1} p={2}>
        <DoughnutChart data={data} />
      </Box>
    </Grid>
    <Grid item xs={6} md={6} lg={6}>
      <Box border={1} p={2}>
        <Typography variant="h6">Accounts flagged by Falcon</Typography>
      </Box>
      <Box
        borderBottom={1}
        borderRight={1}
        borderLeft={1}
        p={2}
        overflow="auto"
        height="183px"
      >
        <Button fullWidth>
          <Box
            display="flex"
            alignContent="center"
            justifyContent="space-between"
            width="100%"
            sx={{ textTransform: "none" }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              flexDirection="column"
            >
              <Box>
                <Typography align="left">Project Sigma</Typography>
              </Box>
              <Box>
                <Typography>hanz@cncmllc.com</Typography>
              </Box>
            </Box>
            <Box p={2}>
              <Typography>Owner terminated</Typography>
            </Box>
          </Box>
        </Button>
        <Divider />
        <Button fullWidth>
          <Box
            display="flex"
            alignContent="center"
            justifyContent="space-between"
            width="100%"
            sx={{ textTransform: "none" }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              flexDirection="column"
            >
              <Box>
                <Typography align="left">Project Sigma</Typography>
              </Box>
              <Box>
                <Typography>hanz@cncmllc.com</Typography>
              </Box>
            </Box>
            <Box p={2}>
              <Typography>Owner group changed</Typography>
            </Box>
          </Box>
        </Button>
        <Divider />
        <Button fullWidth>
          <Box
            display="flex"
            alignContent="center"
            justifyContent="space-between"
            width="100%"
            sx={{ textTransform: "none" }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              flexDirection="column"
            >
              <Box>
                <Typography align="left">Project Sigma</Typography>
              </Box>
              <Box>
                <Typography>hanz@cncmllc.com</Typography>
              </Box>
            </Box>
            <Box p={2}>
              <Typography>Owner group changed</Typography>
            </Box>
          </Box>
        </Button>
      </Box>
    </Grid>
  </Grid>
);

const DraftContent = ({ data }) => (
  <Grid container>
    <Grid item xs={12} md={12} lg={12}>
      <Box border={1} p={2}>
        <Typography variant="h6">Access review progress</Typography>
      </Box>
      <Box borderBottom={1} borderRight={1} borderLeft={1} p={2}>
        <DoughnutChart data={data} />
      </Box>
    </Grid>
  </Grid>
);

function UserDetails() {
  const classes = useStyle();
  const location = useLocation();
  const { id } = useParams();
  const { data } = location.state || {};

  let activeStep = 0;
  if (data) {
    if (data.status === "Draft") {
      activeStep = 0;
    } else if (data.status === "In Review") {
      activeStep = 1;
    } else if (data.status === "Completed") {
      activeStep = 2;
    }
  }

  const [value, setValue] = useState("1");
  const [searchValue, setSearchValue] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [reviewerOpen, setReviewerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedReviewer, setSelectedReviewer] = useState("");
  const [systemOpen, setSystemOpen] = useState(false);
  const [selectedSystem, setSelectedSytem] = useState("");
  const [filteredData, setFilteredData] = useState(tableMockData);
  const [anchorEl, setAnchorEl] = useState(null);



  const handleMoreClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDropdownChange = (setter) => (value) => {
    setter(value);
  };
  const handleFilter = () => {
    let data = tableMockData;
    if (selectedStatus)
      data = data.filter((item) => item.status.includes(selectedStatus));
    if (searchValue)
      data = data.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    setFilteredData(data);
  };

  // const handleRowClick = (rowId) => {
  //   console.log("Row Clicked");
  //   const selectedItem = filteredData[rowId];
  //   history.push(`/access_management/reviews/user-details//${rowId}`, {
  //     data: selectedItem,
  //   });
  // };

  useEffect(() => {
    handleFilter();
  }, [selectedStatus, searchValue]);

  const renderContent = () => {
    switch (data.status) {
      case "Completed":
        return <CompletedStatusContent />;
      case "In Review":
        const data = {
          labels: ["Not started", "In progress", "Completed"],
          datasets: [
            {
              data: [0, 1, 0],
              backgroundColor: ["#A9A9A9", "#FF6384", "#4BC0C0"],
              borderColor: ["#A9A9A9", "#FF6384", "#4BC0C0"],
              borderWidth: 1,
            },
          ],
        };
        return <InReviewStatusContent />;
      case "Draft":
        const data2 = {
          labels: [
            "Systems requiring access file",
            "Systems requiring connection",
            "Systems ready to review",
          ],
          datasets: [
            {
              data: [4, 3, 7],
              backgroundColor: ["#A9A9A9", "#FF6384", "#4BC0C0"],
              borderColor: ["#A9A9A9", "#FF6384", "#4BC0C0"],
              borderWidth: 1,
            },
          ],
        };
        return <DraftStatusContent />;
      default:
        return null;
    }
  };

  const renderHeaderButtons = () => {
    if (data.status == "Completed") {
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
    } else if (data.status == "In review") {
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
          <Tooltip title="To complete the review, please ensure all reviews are submitted and all remediation evidence is added under the 'Access changes' tab.">
            <span>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Icon>check</Icon>}
                disabled
                className={classes.exp_Del_Button}
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
            disabled
            className={classes.exp_Del_Button}
          >
            Start review
          </Button>
        </Box>
      );
    }
  };

  return (
    <>
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
              {renderHeaderButtons()}
            </Box>
          </Box>
        </Box>

        {renderContent()}
      </Box>
    </>
  );
}

export default UserDetails;
