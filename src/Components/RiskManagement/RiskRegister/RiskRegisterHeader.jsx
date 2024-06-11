import { Box, Button, Icon, IconButton, InputAdornment, Tooltip, makeStyles, useMediaQuery, useTheme } from '@material-ui/core'
import React, { useState } from 'react'
import { TextControl } from '../../Utils/Control';
import OptionDropdown from './OptionDropdown';
import FilterDropdown from './FilterDropdown';
import jira from "../../../assets/img/jira-brands.svg"
import RiskRegisterFilters from '../../../assets/data/RiskManagement/RiskRegisterFilters';
import { risk_register_columns } from '../../../assets/data/RiskManagement/RiskRegisterColumns';
import ManageRegisterColumns from './ManageRegisterColumns';

// Generate Styles
const useStyle = makeStyles((theme) => ({
  searchInput: {
    width: 300,
    '@media (max-width: 960px)': {
      flexGrow: 1,
    },
    backgroundColor: 'white',
    borderRadius: 7,
    borderRight: 0,
    "& .MuiOutlinedInput-adornedStart": {
      paddingLeft: 8,
      paddingRight: 8,
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: 7,
      // borderTopRightRadius: 0,
      // borderBottomRightRadius: 0,
      height: 35
    },
    // overflow: "hidden"
  },
  actionButton: {
    '&.Mui-disabled': {
      color: "rgba(68, 119, 206, 0.5) !important"
    },
    '&.Mui-disabled img': {
      opacity: 0.4
    },
    maxHeight: 34,
    backgroundColor: 'white',
    color: "#4477CE",
    border: '1px solid rgba(0, 0, 0, 0.2)',
    paddingInline: 10,
    textTransform: 'none',
  },
  dropdownButton: {
    maxHeight: 32
  }
}))

const RiskRegisterHeader = ({
  moreOptionsHandlers,
  shareOptionsHandlers,
  addScenarioOptionsHandlers,
  tableFilters,
  activeFilters,
  changeFilters,
  clearFilters,
  selectedRows,
  editHandler,
  cols: { allColumns }
}) => {

  const classes = useStyle();

  // State to control search value
  const [searchValue, setSearchValue] = useState(null);
  const updateSearch = (e) => {
    const searchedValue = e.target.value;
    setSearchValue(searchedValue);
  };

  // States to control the 3 dropdowns i.e. More, Share, Add Scenario.
  const [moreOpen, setMoreOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [isAddScenarioOpen, setIsAddScenarioOpen] = useState(false);
  const handleMoreClose = () => setMoreOpen(false);
  const handleShareClose = () => setShareOpen(false);
  const handleAddScenarioClose = () => setIsAddScenarioOpen(false);

  // More Options
  const moreOptions = [
    {
      startIcon: "visibility",
      text: "View Archived",
      clickHandler: () => {
        setMoreOpen(false);
        moreOptionsHandlers.viewArchived()
      } 
    },
    {
      startIcon: "visibility_off",
      text: "Hide Getting Started Guide",
      clickHandler: () => {
        setMoreOpen(false);
        moreOptionsHandlers.hideGuide()
      }
    },
    {
      startIcon: "arrow_downward",
      text: "Export all risk scenarios",
      clickHandler: () => {
        setMoreOpen(false);
        moreOptionsHandlers.exportAllScenarios()
      } 
    }
  ]

  // Share Functions
  const shareOptions = [
    {
      text: "Create Snapshot",
      clickHandler: () => {
        setShareOpen(false);
        shareOptionsHandlers.createSnapshot();
      }
    },
    {
      text: "Generate Assessment Reoprt",
      clickHandler: () => {
        setShareOpen(false);
        shareOptionsHandlers.generateAssessmentReport();
      }
    },
    {
      text: "Configure Auditor View",
      clickHandler: () => {
        setShareOpen(false);
        shareOptionsHandlers.configAuditorView();
      }
    }
  ]

  // Add scenario Options
  const addScenarioOptions = [
    {
      text: "Manually",
      clickHandler: () => {
        setIsAddScenarioOpen(false)
        addScenarioOptionsHandlers.addManualScenario();
      }
    },
    {
      text: "Via Library",
      clickHandler: () => {
        setIsAddScenarioOpen(false)
        addScenarioOptionsHandlers.addScenarioViaLibrary();
      }
    },
    {
      text: "Via Import (.csv, .xlsx)",
      clickHandler: () => {
        setIsAddScenarioOpen(false)
        addScenarioOptionsHandlers.addScenarioViaImport();
      }
    }
  ]

  // State to toggle Manage Columns dropdown
  const [ismanageColsOpen, setManageColsOpen] = useState(false);
  const openManageColsDropdown = () => setManageColsOpen(true);
  const closeManageColsDropdown = () => setManageColsOpen(false);

  // State to manage md breakpoint
  const theme = useTheme();
  const aboveMd = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <>
      {/* ADD SCENARIO, EDIT, JIRA, SEARCH, MORE, SHARE */}
      {/* Contains two main boxes, Placed at two ends. */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        {/* Contains Add scenario button, and Edit Button, and Add to Action Button */}
        <Box
          display="flex"
          alignItems="center"
          gridColumnGap={10}
          justifyContent="space-between"
        >
          {/* Add Scenario dropdown */}
          <OptionDropdown
            open={isAddScenarioOpen}
            handleClose={handleAddScenarioClose}
            placement="bottom-start"
            options={addScenarioOptions}
          >
            <Button
              size='small'
              endIcon={<Icon style={{ rotate: '90deg' }}>arrow_forward_ios</Icon>}
              className={classes.dropdownButton}
              style={{
                backgroundColor: "#4477CE",
                color: "white",
                textTransform: "none",
                paddingInline: 10,
              }}
              onClick={() => setIsAddScenarioOpen(prev => !prev)}
            >
              Add Scenario
            </Button>
          </OptionDropdown>

          {/* Edit Button */}
          <Button
            // size='small'
            startIcon={<Icon style={{ fontSize: '1rem' }}>edit</Icon>}
            className={classes.actionButton}
            disabled={selectedRows.length !== 1}
            onClick={editHandler}
          >
            Edit
          </Button>

          {/* Jira Button */}
          <Button
            // size='small'
            startIcon={<Icon style={{ fontSize: '1rem' }}>add</Icon>}
            className={classes.actionButton}
            disabled={selectedRows.length !== 1}
          >
            Add Task
          </Button>
        </Box>

        {/* Contains search text field, and two dropdowns i.e. More and Share */}
        <Box
          display="flex"
          gridColumnGap={15}
          alignItems="center"
        >
          {/* Search field */}
          <TextControl
            variant="outlined"
            placeholder="Search here"
            size="small"
            gutter={false}
            label=" "
            className={classes.searchInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {searchValue ? (
                    <IconButton
                      size="small"
                      color="#4477CE"
                      onClick={() => {
                        updateSearch({ target: { value: "" } });
                      }}
                      style={{ color: "#4477CE" }}
                    >
                      <Icon>close</Icon>
                    </IconButton>
                  ) : (
                    <Icon style={{ color: "#4477CE" }}>search</Icon>
                  )}
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="absolute" style={{ position: 'absolute', right: -6 }}>
                  {searchValue && (
                    <>
                      <IconButton
                        size="small"
                        color="inherit"
                        disabled={false}
                      // onClick={() => setSelected((prev) => prev - 1)}
                      >
                        <Icon>arrow_left</Icon>
                      </IconButton>
                      <IconButton
                        size="small"
                        color="inherit"
                        disabled={false}
                      // onClick={() => setSelected((prev) => prev + 1)}
                      >
                        <Icon>arrow_right</Icon>
                      </IconButton>
                    </>
                  )}
                </InputAdornment>
              ),
            }}
          // value={}
          // onChange={}
          />

          {/* More dropdown */}
          <OptionDropdown
            open={moreOpen}
            handleClose={handleMoreClose}
            placement="bottom-end"
            options={moreOptions}
          >
            <Button
              size='small'
              endIcon={<Icon style={{ rotate: '90deg' }}>arrow_forward_ios</Icon>}
              className={classes.dropdownButton}
              style={{
                border: '1px solid #4477CE',
                color: '#4477CE',
                textTransform: "none",
                paddingInline: 10,
              }}
              onClick={() => setMoreOpen(prev => !prev)}
            >
              More
            </Button>
          </OptionDropdown>

          {/* Share Dropdown */}
          <OptionDropdown
            open={shareOpen}
            handleClose={handleShareClose}
            placement="bottom-end"
            options={shareOptions}
          >
            <Button
              size='small'
              endIcon={<Icon style={{ rotate: '90deg' }}>arrow_forward_ios</Icon>}
              className={classes.dropdownButton}
              style={{
                border: '1px solid #4477CE',
                color: '#4477CE',
                textTransform: "none",
                paddingInline: 10,
              }}
              onClick={() => setShareOpen(prev => !prev)}
            >
              Share
            </Button>
          </OptionDropdown>
        </Box>
      </Box>

      {/* FILTERS */}
      {/* Contains 2 Boxes, 1 for filters, and 2nd for a dropdown to show and hide columns */}
      <Box
        mt={2}
        display={'flex'}
        justifyContent={'space-between'}
        paddingY={1}
        paddingX={1}
        padding={1}
        border={1}
        sx={{
          borderRadius: 10,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          backgroundColor: '#fff',
          borderBottom: 'none',
          '& .MuiButton-startIcon': {
            marginRight: !aboveMd && 0,
            marginLeft: !aboveMd && 0
          },
          '& .MuiButton-root': {
            padding: aboveMd && '6px 16px',
          },
          borderColor: '#d9d9d9'
        }}
      >
        {/* Filters */}
        <Box
          display={"flex"}
          gridColumnGap={8}
        >
          {Object.values(tableFilters)
            .sort((a, b) => (a.order - b.order))
            .map((filter, index) => (
              <FilterDropdown
                key={index}
                filterName={filter.name}
                buttonText={filter.text}
                filterOptions={filter.options}
                activeFilters={activeFilters[filter.name]}
                changeFilters={changeFilters}
                clearFilters={clearFilters}
              />
            ))}
        </Box>

        {/* Dropdown to show and hide columns */}
        <Box>
          <ManageRegisterColumns
            open={ismanageColsOpen}
            handleClose={closeManageColsDropdown}
            cols={{ allColumns }}
          // addColumns={moveToSecondary}
          // removeColums={moveToPrimary}
          >
            <Button
              onClick={openManageColsDropdown}
              endIcon=<Icon>tune</Icon>
              className={classes.actionButton}
              style={{
                // color: '#4477CE',
                // textTransform: 'none',
                // backgroundColor: '#F0F8F7',
                // borderRadius: 10,
                // paddingInline: 15,
                width: !aboveMd && 50,
                fontSize: "0.8rem"
              }}
            >
              {aboveMd && 'Columns'}
            </Button>
          </ManageRegisterColumns>
        </Box>
      </Box>
    </>
  )
}

export default RiskRegisterHeader