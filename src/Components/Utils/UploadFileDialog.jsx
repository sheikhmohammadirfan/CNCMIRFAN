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
import colorShader from "./ColorShader";

const useStyles = makeStyles((theme) => ({
  note: {
    backgroundColor: colorShader(theme.palette.primary.main, 0.15),
  },
  button: {
    textTransform: "none",
    width: "100%",
  },
  listHead: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: "0.8rem",
    fontWeight: "bold",
    color: colorShader("#000000", 0.7),
  },
  columnNamesList: {
    maxHeight: "200px",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: colorShader(theme.palette.primary.main, 0.15),
      borderRadius: "10px",
    },

    "&::-webkit-scrollbar-thumb": {
      borderRadius: "10px",
      backgroundColor: colorShader(theme.palette.primary.main, 0.6),
    },
    paddingInline: "10px",
    "& .MuiListItem-root": {
      padding: "2px 0",
    },
  },
}));

const InfoIconWithTooltip = ({ title }) => (
  <Tooltip title={title} placement="top" arrow>
    <InfoIcon fontSize="small" color="primary" cursor="pointer" />
  </Tooltip>
);

const UploadFileDialog = ({
  open,
  onClose,
  onImport,
  requiredColumns,
  optionalColumns = [],
  col_TooltipDesc_Map,
  getPlainFile = false,
}) => {
  const classes = useStyles();

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [sheets, setSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [showSheetSelector, setShowSheetSelector] = useState(false);
  const [workbook, setWorkbook] = useState(null);
  const [data, setData] = useState([]);

  const handleDownloadTemplate = () => {
    const allCols = [...requiredColumns, ...optionalColumns];
    const templateData = [{}];
    allCols.forEach((col) => (templateData[0][col] = ""));

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "template.xlsx");
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (
      file &&
      (file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.name.endsWith(".csv"))
    ) {
      setUploading(true);
      if (getPlainFile) {
        const res = await onImport(file);
        if (res !== undefined && !res) setError(true);
        setUploading(false);
        return;
      }
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
    let jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    jsonData = jsonData.filter((row) => row.some((cell) => cell !== undefined));
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
        <Box width="50%" className={classes.requiredColumnsRoot}>
          <Paper elevation={0} className={classes.note}>
            <Box display="flex" alignItems="center" p={1}>
              <InfoIcon color="info" />
              <Box ml={1}>
                <Typography
                  variant="body2"
                  style={{
                    color: colorShader("#000000", 0.6),
                    fontSize: "0.8rem",
                  }}
                >
                  Make sure your file includes the following required columns:
                </Typography>
              </Box>
            </Box>
          </Paper>
          <Typography
            variant="body2"
            className={classes.listHead}
            style={{ marginTop: 15 }}
          >
            REQUIRED COLUMNS
          </Typography>
          <Divider />
          <List className={classes.columnNamesList} dense>
            {requiredColumns.map((column, index) => (
              <ListItem key={index} disableGutters>
                <ListItemText primary={column} />
                <InfoIconWithTooltip
                  title={col_TooltipDesc_Map[column] || ""}
                />
              </ListItem>
            ))}
          </List>
          {optionalColumns.length > 0 && (
            <>
              <Typography variant="body2" className={classes.listHead}>
                OPTIONAL COLUMNS
              </Typography>
              <Divider />
              <List className={classes.columnNamesList} dense>
                {optionalColumns.map((column, index) => (
                  <ListItem key={index} disableGutters>
                    <ListItemText primary={column} />
                    <InfoIconWithTooltip
                      title={col_TooltipDesc_Map[column] || ""}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
          <Divider style={{ marginTop: 10 }} />
          <DialogActions style={{ justifyContent: "start", paddingLeft: 0 }}>
            <Box>
              <Button
                size="small"
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
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (
          !uploading &&
          reason !== "backdropClick" &&
          reason !== "escapeKeyDown"
        ) {
          onClose();
        }
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle style={{ paddingBlock: 0 }}>
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
      <DialogContent style={{ paddingTop: "16px" }}>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default UploadFileDialog;
