import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
  Paper,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Tooltip,
} from "@material-ui/core";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import XLSX from "xlsx";

const useStyles = makeStyles({
  button: {
    textTransform: "none",
    width: "100%",
  },
});

const InfoIconWithTooltip = ({ title }) => (
  <Tooltip title={title} placement="top" arrow>
    <InfoIcon fontSize="small" color="primary" cursor="pointer" />
  </Tooltip>
);

const UploadFileDialog = ({ open, onClose, onImport }) => {
  const classes = useStyles();

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [sheets, setSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [showSheetSelector, setShowSheetSelector] = useState(false);
  const [workbook, setWorkbook] = useState(null);
  const [data, setData] = useState([]);

  const requiredColumns = ["Name"];
  const optionalColumns = [
    "Website",
    "Category",
    "Risk level",
    "Internal security owner",
    "Internal business owner",
    "Account manager name",
    "Account manager email",
    "Services provided",
    "Additional notes",
    "Visible to auditor",
  ];

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        Name: "",
        Website: "",
        Category: "",
        "Risk level": "",
        "Internal security owner": "",
        "Internal business owner": "",
        "Account manager name": "",
        "Account manager email": "",
        "Services provided": "",
        "Additional notes": "",
        "Visible to auditor": "",
      },
    ];
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "template.xlsx");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (
      file &&
      (file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.name.endsWith(".csv"))
    ) {
      setUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetNames = workbook.SheetNames;
        setSheets(sheetNames);
        setUploading(false);
        setWorkbook(workbook);
        if (sheetNames.length > 1) {
          setSelectedSheet(sheetNames[0]);
          setShowSheetSelector(true);
        } else {
          setSelectedSheet(sheetNames[0]);
          handleSheetSelection(sheetNames[0], workbook);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setError(true);
    }
  };

  const handleSheetSelection = (sheetName, workbook) => {
    setShowSheetSelector(false);
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    setData(jsonData);
    handleImport(jsonData);
  };

  const handleImport = (data) => {
    const headers = data[0];
    const rows = data.slice(1).map((row) => {
      const rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index];
      });
      return rowData;
    });
    onImport(rows);
    onClose();
  };

  const renderContent = () => {
    if (uploading) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="300px"
        >
          <CircularProgress />
          <Box mt={2}>
            <Typography variant="h6">Uploading your file</Typography>
          </Box>

          <Typography variant="body2" color="textSecondary">
            Larger files can take longer than usual, depending on your
            connection speed
          </Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="300px"
        >
          <Typography variant="h6" color="error">
            File upload failed
          </Typography>
          <Typography variant="body2" color="textSecondary">
            There was an unexpected error while uploading this file. Make sure
            there is a stable internet connection for the duration of the
            upload.
          </Typography>
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setError(false)}
            >
              Upload a different file
            </Button>
          </Box>
        </Box>
      );
    }

    if (showSheetSelector) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="300px"
        >
          <Box mb={2}>
            <Typography variant="h6">Select a worksheet</Typography>
          </Box>
          <FormControl component="fieldset">
            <FormLabel>
              Select the specific worksheet you want to import.
            </FormLabel>
            <RadioGroup
              defaultValue={selectedSheet}
              onChange={(e) => setSelectedSheet(e.target.value)}
            >
              {sheets.map((sheet, index) => (
                <FormControlLabel
                  key={index}
                  value={sheet}
                  control={<Radio />}
                  label={sheet}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <DialogActions>
            <Button onClick={() => setShowSheetSelector(false)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleSheetSelection(selectedSheet, workbook);
              }}
              color="primary"
              variant="contained"
              disabled={!selectedSheet}
            >
              Confirm
            </Button>
          </DialogActions>
        </Box>
      );
    }

    return (
      <Box display="flex" flexDirection="row">
        <Box width="50%">
          <Paper elevation={3}>
            <Box display="flex" alignItems="center" m={1} mb={2}>
              <InfoIcon color="info" />
              <Box ml={1}>
                <Typography variant="body2">
                  Make sure your file includes the following required columns:
                </Typography>
              </Box>
            </Box>
          </Paper>
          <Typography variant="subtitle1">Required Columns:</Typography>
          <Divider />
          <List dense>
            {requiredColumns.map((column, index) => (
              <ListItem key={index}>
                <ListItemText primary={column} />
                <InfoIconWithTooltip title={`Name of the vendor`} />
              </ListItem>
            ))}
          </List>
          <Typography variant="subtitle1">Optional Columns:</Typography>
          <Divider />
          <List dense>
            {optionalColumns.map((column, index) => (
              <ListItem key={index}>
                <ListItemText primary={column} />
                <InfoIconWithTooltip
                  title={
                    column === "Website"
                      ? `URL of the vendor's website`
                      : column === "Category"
                      ? "Vendor category - if category is provided and risk level is not, this vendor will be autoscored."
                      : column === "Risk level"
                      ? "Vendor risk level"
                      : column === "Internal security owner"
                      ? "Email address of this vendor's security owner. Must be a user in Vanta"
                      : column === "Internal business owner"
                      ? "Email address of this vendor's security owner. Must be a user in Vanta"
                      : column === "Account manager name"
                      ? "Name of the manager of the account"
                      : column === "Account manager email"
                      ? "Email of the manager of the account"
                      : column === "Services provided"
                      ? "Services that the vendor provide"
                      : column === "Additional notes"
                      ? "Notes about the vendor"
                      : column === "Visible to auditor"
                      ? "If visible to auditor then true otherwise false"
                      : ""
                  }
                />
              </ListItem>
            ))}
          </List>
          <DialogActions>
            <Box mr={6}>
              <Button
                onClick={handleDownloadTemplate}
                color="primary"
                variant="contained"
                className={classes.button}
              >
                Download Excel Template
              </Button>
            </Box>
          </DialogActions>
        </Box>
        <Box display="flex" justifyContent="center" width="100%" ml={2} mb={1}>
          <Button
            component="label"
            startIcon={<CloudUploadIcon />}
            variant="outlined"
            fontSize="1rem"
            height="100%"
            className={classes.button}
          >
            Upload File
            <input type="file" hidden onChange={handleFileUpload} />
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <CloudUploadIcon />
            <Box ml={1}>
              <Typography variant="h6">Upload a File</Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>{renderContent()}</DialogContent>
    </Dialog>
  );
};

export default UploadFileDialog;
