import { Box, Button, Icon, Stack, Tab, Tabs, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';


const CustomTab = ({ ...tabProps }) => (
  <Tab
    sx={{
      fontSize: '0.9rem',
      textTransform: 'none',
      padding: '8px 0',
      minWidth: 0,
      minHeight: 0
    }}
    disableRipple
    label="Item One"
    {...tabProps}
  />
)

const CustomTabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

const PolicyDetail = () => {

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const location = useLocation();
  const history = useHistory();
  const handleEditClick = () => {
    history.push(`${location.pathname}/editor`)
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" columnGap={1}>
        <Typography variant='h5' fontWeight={500}>Human Resource Security Policy</Typography>
        <Box display="flex" alignItems="center" columnGap={1} p="4px 8px" border="1px solid #ccc" borderRadius="16px">
          <Icon sx={{ color: 'green', fontSize: '1rem' }}>check_circle</Icon>
          <Typography fontSize="0.9rem">Ok</Typography>
        </Box>
      </Box>

      <Box width="50%" mt={1}>
        <Typography fontSize="0.95rem" color="#797979">To ensure that personnel and contractors meet security requirements, understand their responsibilities, and are suitable for their roles</Typography>
      </Box>

      <Box mt={2}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }} mb={2}>
          <Tabs sx={{ minHeight: 0, '& .MuiTabs-flexContainer': { columnGap: 4 } }} value={value} onChange={handleChange} aria-label="basic tabs example">
            <CustomTab label="Policy versions" {...a11yProps(0)} />
            <CustomTab label="Controls" {...a11yProps(1)} />
            <CustomTab label="Audits" {...a11yProps(2)} />
            <CustomTab label="Notes" {...a11yProps(3)} />
          </Tabs>
        </Box>

        <CustomTabPanel value={value} index={0}>
          <Box border="1px solid #ccc" borderRadius="10px" p={2} display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" columnGap={1}>
              <Icon sx={{ color: '#666' }}>description</Icon>
              <Stack>
                <Typography fontSize="0.9rem" fontWeight={500}>English</Typography>
                <Typography fontSize="0.8rem" color="#797979">Last edited by Affan Ansari</Typography>
              </Stack>
            </Box>
            <Box>
              <Button color='primary' variant='outlined' sx={{ textTransform: 'none' }} disableElevation onClick={handleEditClick}>
                Edit
              </Button>
            </Box>
          </Box>
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          HEY
        </CustomTabPanel>

        <CustomTabPanel value={value} index={2}>
          YOU
        </CustomTabPanel>

        <CustomTabPanel value={value} index={3}>
          THERE
        </CustomTabPanel>
      </Box>
    </Box>
  )
}

export default PolicyDetail