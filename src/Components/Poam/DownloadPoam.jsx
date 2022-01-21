import {
  Box,
  Button,
  Checkbox,
  Grid,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React from "react";
import { poam_header } from "../../assets/data/PoamData";
import XLSX from "xlsx";
import { getData } from "../../Service/Poam.service";
import DialogBox from "../Utils/DialogBox";
import { RadioControl, CheckboxControl } from "../Control";
import { useState } from "react";

const useStyle = makeStyles((theme) => ({
  // Apply style for radio elements
  radioStyle: {
    // align items to top
    "& .MuiFormControlLabel-root:last-child": { alignItems: "flex-start" },
  },
  // Reduce size of checkbox
  checkboxInput: {
    "& .MuiCheckbox-root": {
      padding: theme.spacing(1 / 2),
      paddingRight: theme.spacing(1),
    },
    "& .MuiSvgIcon-root": { fontSize: theme.spacing(2.25) },
  },
}));

// Method to convert data into downladable excel or csv
function DownloadPoam({
  data,
  isOpenPoam,
  open,
  close,
  allColumns,
  hiddenColumns,
}) {
  const classes = useStyle();

  // State to save radio input
  const [radioInput, setRadioInput] = useState("All Columns");

  // State to select list of selected collumns
  const [selectCols, setselectCols] = useState([]);
  // Check given columns
  const check = (index) => setselectCols((val) => [...val, index]);
  // uncheck given columns
  const uncheck = (index) =>
    setselectCols((val) => val.filter((v) => v !== index));
  // Select all columns
  const selectAll = () =>
    setselectCols(Array.from({ length: allColumns.length }, (v, k) => k));
  // Deselect all columns
  const deselectAll = () => setselectCols([]);
  // Check if all columns is selected
  const isAllSelected = () => selectCols.length === allColumns.length;
  // Check if some columns is selected
  const isSomeSelected = () =>
    selectCols.length > 0 && selectCols.length < allColumns.length;

  // Map data into XLSX util object
  const mapData = () =>
    Object.keys(data["POAM ID"]).map((id) => {
      const temp = {};
      let i = 0;
      for (let name of poam_header) {
        // Map select columns
        if (
          radioInput === "All Columns" ||
          (radioInput === "Default Columns" && !hiddenColumns.includes(name)) ||
          (radioInput === "Hidden Columns" && hiddenColumns.includes(name)) ||
          (radioInput === "Selected Columns" && selectCols.includes(i))
        )
          temp[name] = data[name][id];

        i++;
      }
      return temp;
    });

  // Fetch open & close sheet data and convert into XLSX format
  const getTableData = async () => {
    let openData;
    let closeData;

    if (isOpenPoam) {
      openData = mapData(data);
      const { data: fData, status: fStatus } = await getData(!isOpenPoam);
      if (fStatus) closeData = mapData(fData);
      else return;
    } else {
      closeData = mapData(data);
      const { data: fData, status: fStatus } = await getData(!isOpenPoam);
      if (fStatus) openData = mapData(fData);
      else return;
    }
    return { openData, closeData };
  };

  // Method to export file of given name and type
  const exportFile = async (fileName, type) => {
    if (radioInput === "Selected Columns" && selectCols.length === 0) return;

    // Get mapped data
    const tableData = await getTableData();
    if (!tableData) return console.log("Error occurred");

    // Generate XLSX sheets
    const sheetOpen = XLSX.utils.json_to_sheet(tableData.openData);
    const sheetClose = XLSX.utils.json_to_sheet(tableData.closeData);

    // Create a empty xlsx file
    const book = XLSX.utils.book_new();

    // Append sheets
    XLSX.utils.book_append_sheet(book, sheetOpen, "OPEN");
    XLSX.utils.book_append_sheet(book, sheetClose, "CLOSE");

    // Save & download file
    XLSX.write(book, { bookType: type, type: "binary" });
    XLSX.writeFile(book, `${fileName}.${type}`);
  };

  const exportAsXLSX = () => exportFile("POAM FILE", "xlsx");
  const exportAsCSV = () => exportFile("POAM FILE", "csv");

  // Create component to show text & caption
  const OptionText = ({ text, caption }) => (
    <Box paddingY={1}>
      <Typography style={{ lineHeight: 1 }}>{text}</Typography>
      <Typography variant="caption">
        <i>'{caption}'</i>
      </Typography>
    </Box>
  );

  // Component to select columns
  const SelectColumns = () => (
    <Box>
      <OptionText
        text={
          <span>
            Select Columns
            <Tooltip
              arrow
              color="default"
              placement="right"
              title={isAllSelected() ? "Deselect all" : "Select all"}
            >
              <Checkbox
                size="small"
                style={{ padding: 0, paddingLeft: "8px" }}
                disabled={radioInput !== "Selected Columns"}
                indeterminate={isSomeSelected()}
                checked={isAllSelected()}
                onChange={(e) =>
                  e.target.checked ? selectAll() : deselectAll()
                }
              />
            </Tooltip>
          </span>
        }
        caption="The file will include only columns selected from following list."
      />
      {radioInput === "Selected Columns" && (
        <Grid container spacing={1}>
          {allColumns.map((name, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <CheckboxControl
                name={name}
                label={
                  <Typography noWrap variant="body1">
                    {name}
                  </Typography>
                }
                className={classes.checkboxInput}
                checked={selectCols.includes(index)}
                onChange={(e) => {
                  e.target.checked ? check(index) : uncheck(index);
                  console.log(e.target.checked);
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  // List of all options to download
  const optionList = [
    {
      val: "All Columns",
      text: (
        <OptionText
          text="All Columns"
          caption="The file will include all columns i.e. FeDRMP specified and additional columns."
        />
      ),
    },
    {
      val: "Default Columns",
      text: (
        <OptionText
          text="Default Columns"
          caption="The file will include only FeDRMP specified columns."
        />
      ),
    },
    {
      val: "Hidden Columns",
      text: (
        <OptionText
          text="Hidden Columns"
          caption="The file will include only additional columns."
        />
      ),
    },
    { val: "Selected Columns", text: <SelectColumns /> },
  ];

  return (
    <DialogBox
      maxWidth="sm"
      fullWidth
      open={open}
      onClose={close}
      bottomSeperator={true}
      title="Download POAM file"
      content={
        <Box>
          <RadioControl
            className={classes.radioStyle}
            value={radioInput}
            onChange={(e) => setRadioInput(e.target.value)}
            options={optionList}
          />
        </Box>
      }
      actions={[
        <Button
          variant="outlined"
          size="large"
          fullWidth
          color="primary"
          onClick={close}
        >
          CANCEL
        </Button>,
        <Button variant="contained" size="large" fullWidth color="primary">
          .pdf
        </Button>,
        <Button
          variant="contained"
          size="large"
          fullWidth
          color="primary"
          onClick={exportAsCSV}
        >
          .csv
        </Button>,
        <Button
          variant="contained"
          size="large"
          fullWidth
          color="primary"
          onClick={exportAsXLSX}
        >
          .xlsx
        </Button>,
      ]}
    />
  );
}

export default DownloadPoam;
