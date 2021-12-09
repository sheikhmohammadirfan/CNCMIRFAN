import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Icon,
  InputAdornment,
  InputLabel,
  makeStyles,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Typography,
} from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import React, { useState } from "react";
import { TextControl } from "./Control";

const useStyle = makeStyles((theme) => ({
  form_root: {
    "& .MuiAccordion-root": {
      boxShadow: "none",
      border: `1px solid ${theme.palette.grey[400]}`,
    },
  },
}));

function FormDialog({ open, onClose, data }) {
  const classes = useStyle();

  const [selectedDate, handleDateChange] = useState(new Date());

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" scroll="paper">
      <DialogTitle>
        <Typography style={{ fontWeight: "bold" }}>
          {data ? "Edit Row" : "Create New Row"}
        </Typography>
      </DialogTitle>
      <Divider />
      <Box paddingX={2.5} paddingY={2} className={classes.form_root}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextControl
              variant="outlined"
              name="poam_id"
              label="POAM ID"
              disabled={true}
              removeGutter={true}
              value="P-001"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="controls-select-label">Controls</InputLabel>
              <Select
                labelId="controls-select-label"
                id="controls-select"
                label="Controls"
              >
                <MenuItem value={1}>AC-1</MenuItem>
                <MenuItem value={2}>AC-2</MenuItem>
                <MenuItem value={3}>AC-3</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary
                expandIcon={<Icon>arrow_drop_down</Icon>}
                aria-controls="weakness-content"
                id="weakness-header"
              >
                <Typography variant="h6" style={{ fontWeight: "bold" }}>
                  Weakness
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextControl
                      variant="outlined"
                      name="weakness_name"
                      label="Weakness Name"
                      removeGutter={true}
                      fullWidth
                      multiline
                      maxRows={20}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextControl
                      variant="outlined"
                      name="weakness_description"
                      label="Weakness Description"
                      removeGutter={true}
                      fullWidth
                      multiline
                      maxRows={20}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel id="weakness_source_identifier-select-label">
                        Weakness Source Identifier
                      </InputLabel>
                      <Select
                        labelId="weakness_source_identifier-select-label"
                        id="weakness_source_identifier-select"
                        label="Weakness Source Identifier"
                      >
                        <MenuItem value={1}>Nessus</MenuItem>
                        <MenuItem value={2}>Qualys</MenuItem>
                        <MenuItem value={3}>Webinspect</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextControl
                      variant="outlined"
                      name="Weakness_source_identifier"
                      label="Weakness Source Identifier"
                      removeGutter={true}
                      fullWidth
                      multiline
                      maxRows={20}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12}>
            <TextControl
              variant="outlined"
              name="asset_identifier"
              label="Asset Identifier"
              removeGutter={true}
              fullWidth
              multiline
              maxRows={20}
            />
          </Grid>
          <Grid item xs={12}>
            <TextControl
              variant="outlined"
              name="point_of_contact"
              label="Point Of Contact"
              removeGutter={true}
              fullWidth
              multiline
              maxRows={20}
            />
          </Grid>
          <Grid item xs={12}>
            <TextControl
              variant="outlined"
              name="resources_required"
              label="Resources Required"
              removeGutter={true}
              fullWidth
              multiline
              maxRows={20}
            />
          </Grid>
          <Grid item xs={12}>
            <TextControl
              variant="outlined"
              name="overall_remediation_plan"
              label="Overall Remediation Plan"
              removeGutter={true}
              fullWidth
              multiline
              maxRows={20}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Original Detection Date"
                  name="original_detection_date"
                  variant="outlined"
                  inputVariant="outlined"
                  value={selectedDate}
                  onChange={handleDateChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon>calendar_today</Icon>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  name="schedule_completion_date"
                  label="Schedule Completion Date"
                  variant="outlined"
                  inputVariant="outlined"
                  value={selectedDate}
                  onChange={handleDateChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon>calendar_today</Icon>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary
                expandIcon={<Icon>arrow_drop_down</Icon>}
                aria-controls="milestone-content"
                id="milestone-header"
              >
                <Typography variant="h6" style={{ fontWeight: "bold" }}>
                  Milestone
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextControl
                      variant="outlined"
                      name="planned_milestone"
                      label="Planned Milestone"
                      removeGutter={true}
                      fullWidth
                      multiline
                      maxRows={20}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextControl
                      variant="outlined"
                      name="milestone_changes"
                      label="Milestone Changes"
                      removeGutter={true}
                      fullWidth
                      multiline
                      maxRows={20}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              name="status_date"
              label="Status Date"
              variant="outlined"
              inputVariant="outlined"
              value={selectedDate}
              onChange={handleDateChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>calendar_today</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary
                expandIcon={<Icon>arrow_drop_down</Icon>}
                aria-controls="vendor-content"
                id="vendor-header"
              >
                <Typography variant="h6" style={{ fontWeight: "bold" }}>
                  Vendor
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <FormLabel component="legend">
                        Vendor dependancy
                      </FormLabel>
                      <RadioGroup row aria-label="vendor">
                        <FormControlLabel
                          value="yes"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="no"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <DatePicker
                      name="last_vendor_checkin_date"
                      label="Last Vendor Check-in Date"
                      variant="outlined"
                      inputVariant="outlined"
                      value={selectedDate}
                      onChange={handleDateChange}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon>calendar_today</Icon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={7}>
                    <TextControl
                      variant="outlined"
                      name="vendor_dependant_product_name"
                      label="Vendor Dependant Product Name"
                      removeGutter={true}
                      fullWidth
                      multiline
                      maxRows={20}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary
                expandIcon={<Icon>arrow_drop_down</Icon>}
                aria-controls="risk-content"
                id="risk-header"
              >
                <Typography variant="h6" style={{ fontWeight: "bold" }}>
                  Risk
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <FormLabel component="legend">Risk Adjustment</FormLabel>
                      <RadioGroup row aria-label="risk">
                        <FormControlLabel
                          value="yes"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="no"
                          control={<Radio />}
                          label="No"
                        />
                        <FormControlLabel
                          value="pending"
                          control={<Radio />}
                          label="Pending"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box paddingX={1.5}>
                      <Typography>Original Risk Rating</Typography>
                      <Slider
                        defaultValue={50}
                        step={50}
                        marks={[
                          { value: 0, label: "Low" },
                          { value: 50, label: "Moderate" },
                          { value: 100, label: "High" },
                        ]}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box paddingX={1.5}>
                      <Typography>Adjusted Risk Rating</Typography>
                      <Slider
                        defaultValue={50}
                        step={50}
                        marks={[
                          { value: 0, label: "Low" },
                          { value: 50, label: "Moderate" },
                          { value: 100, label: "High" },
                        ]}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <FormLabel component="legend">False Positive</FormLabel>
              <RadioGroup row aria-label="positive">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
                <FormControlLabel
                  value="pending"
                  control={<Radio />}
                  label="Pending"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <FormLabel component="legend">Operational Requirement</FormLabel>
              <RadioGroup row aria-label="operational">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
                <FormControlLabel
                  value="pending"
                  control={<Radio />}
                  label="Pending"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="deviation-select-label">
                Deviation Rationale
              </InputLabel>
              <Select
                labelId="deviation-select-label"
                id="deviation-select"
                label="Deviation Rationale"
              >
                <MenuItem value={1}>AC-1</MenuItem>
                <MenuItem value={2}>AC-2</MenuItem>
                <MenuItem value={3}>AC-3</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <Typography style={{ fontWeight: "bold" }}>
                Supporting Documents
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                startIcon={<Icon>add</Icon>}
                style={{ marginLeft: "8px" }}
              >
                Upload
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextControl
              variant="outlined"
              name="comment"
              label="Comments"
              removeGutter={true}
              fullWidth
              multiline
              maxRows={20}
            />
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Box paddingX={2.5} paddingY={2} display="flex" justifyContent="end">
        <Button variant="contained" color="secondary" size="large">
          SUBMIT
        </Button>
      </Box>
    </Dialog>
  );
}

export default FormDialog;
