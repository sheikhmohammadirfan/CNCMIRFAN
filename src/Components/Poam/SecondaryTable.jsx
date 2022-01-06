import { Box, makeStyles, Slide, Typography, Zoom } from "@material-ui/core";
import React from "react";
import CloseButton from "../Utils/CloseButton";
import DataTable from "../Utils/DataTable/DataTable";

function SecondaryTable({
  data,
  columnsList,
  currentRow,
  closeTable,
  maxHeight,
}) {
  // Cell component
  const Cell = ({ text }) => (
    <Typography
      variant="caption"
      component="div"
      style={{ whiteSpace: "pre-line" }}
    >
      {text}
    </Typography>
  );

  // Map header name and data to table row format
  const mapDataToRow = () =>
    columnsList.map((header) => ({
      data: [
        // Title
        {
          text: <Cell text={header} />,
          css: {
            width: "40%",
            paddingTop: "6px",
            paddingBottom: "6px",
            background: "rgba(234, 234, 234, 0.3)",
            verticalAlign: "top",
          },
        },
        // Data
        {
          text: <Cell text={data[header][currentRow]} />,
          css: {
            width: "60%",
            paddingTop: "6px",
            paddingBottom: "6px",
            verticalAlign: "top",
            wordBreak: "break-all",
          },
        },
      ],
    }));

  // Create header of the table
  const header = () => ({
    data: [
      {
        text: (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="button">Secondary Table</Typography>
            <CloseButton size="small" click={closeTable} />
        </Box>
        ),
        params: { colSpan: 2 },
        css: { paddingTop: "6px", paddingBottom: "6px" },
      },
    ],
  });

  // Wrap mapped rows in rowData
  const rows = () => ({ rowData: mapDataToRow() });

  return (
    <Zoom in={currentRow !== -1}>
      <DataTable
        verticalBorder={true}
        header={header()}
        rowList={rows()}
        serialNo={false}
      />
    </Zoom>
  );
}

export default SecondaryTable;
