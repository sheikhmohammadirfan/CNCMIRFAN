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
import { RadioControl, CheckboxControl } from "../Utils/Control";
import { useState } from "react";
import useCheck from "../Utils/Hooks/useCheck";

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
export default function DownloadPoam({
  data,
  open,
  close,
  allColumns,
  hiddenColumns,
}) {
  const classes = useStyle();

  // State to save radio input
  const [radioInput, setRadioInput] = useState("All Columns");

  // State to save checkbox input
  const [checkList, setCheckList] = useState([]);

  // Get method to check collection of checkboxes
  const {
    checkAtIndex,
    uncheckAtIndex,
    checkAll,
    uncheckAll,
    isCheckedAtIndex,
    isAllChecked,
    isSomeChecked,
  } = useCheck(checkList, setCheckList, allColumns.length);

  // Map data into XLSX util object
  const mapData = (sheet) =>
    Object.keys(sheet["POAM ID"]).map((id) => {
      const temp = {};
      let i = 0;
      for (let name of poam_header) {
        // Map select columns
        if (
          radioInput === "All Columns" ||
          (radioInput === "Default Columns" && !hiddenColumns.includes(name)) ||
          (radioInput === "Hidden Columns" && hiddenColumns.includes(name)) ||
          (radioInput === "Selected Columns" && isCheckedAtIndex(i))
        )
          temp[name] = sheet[name][id];

        i++;
      }
      return temp;
    });

  // Fetch open & close sheet data and convert into XLSX format
  const getTableData = async () => {
    let openData = mapData(data.open);
    let closeData = mapData(data.close);

    return { openData, closeData };
  };

  // Method to export file of given name and type
  const exportFile = async (fileName, type) => {
    if (radioInput === "Selected Columns" && checkList.length === 0) return;

    // Get mapped data
    const tableData = await getTableData();
    if (!tableData) return console.log("Error occurred");

    // Generate XLSX sheets
    const sheetOpen = XLSX.utils.json_to_sheet(tableData.openData);
    const sheetClose = XLSX.utils.json_to_sheet(tableData.closeData);

    // Create a empty xlsx file
    const book = XLSX.utils.book_new();

    // Append sheets
    XLSX.utils.book_append_sheet(book, sheetOpen, "Open POA&M Items");
    XLSX.utils.book_append_sheet(book, sheetClose, "Closed POA&M Items");

    // Save & download file
    XLSX.write(book, { bookType: type, type: "binary" });
    XLSX.writeFile(book, `${fileName}.${type}`);
  };

  const exportAsXLS = () => exportFile("POA&M FILE", "xls");
  const exportAsXLSX = () => exportFile("POA&M FILE", "xlsx");
  const exportAsXLSM = () => exportFile("POA&M FILE", "xlsm");
  const exportAsCSV = () => exportFile("POA&M FILE", "csv");

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
              title={isAllChecked() ? "Deselect all" : "Select all"}
            >
              <Checkbox
                size="small"
                style={{ padding: 0, paddingLeft: "8px" }}
                disabled={radioInput !== "Selected Columns"}
                indeterminate={isSomeChecked()}
                checked={isAllChecked()}
                onChange={(e) => (e.target.checked ? checkAll() : uncheckAll())}
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
                checked={isCheckedAtIndex(index)}
                onChange={(e) => {
                  e.target.checked
                    ? checkAtIndex(index)
                    : uncheckAtIndex(index);
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
      title="Download POA&M file"
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
        <Button
          variant="contained"
          size="large"
          fullWidth
          color="primary"
          onClick={exportAsXLS}
        >
          .xls
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
        <Button
          variant="contained"
          size="large"
          fullWidth
          color="primary"
          onClick={exportAsXLSM}
        >
          .xlsm
        </Button>,
        <Button
          variant="contained"
          size="large"
          fullWidth
          color="primary"
          onClick={exportAsXLSM}
        >
          OSCAL Format
        </Button>,
      ]}
    />
  );
}
