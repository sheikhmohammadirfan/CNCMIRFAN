import { Box, Grid, Typography, Zoom } from "@material-ui/core";
import React from "react";
import CloseButton from "../Utils/CloseButton";
import DataTable from "../Utils/DataTable/DataTable";

const Link = ({ text, href = "#" }) => <a href={href}>{text}</a>;
const Seperator = () => <span>,&nbsp;</span>;
const Span = ({ text }) => <span>{text}</span>;

/* SECONDARY TALBE COMPONENT */
function SecondaryTable({ data, columnsList, currentRow, closeTable }) {
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
  const mapDataToRow = () => {
    const rowList = [...columnsList, "jira_issues"];

    return rowList.map((header) => {
      const isJiraCol = header === "jira_issues";
      const title = isJiraCol ? "JIRA Issues" : header;
      const text = (() => {
        if (!isJiraCol) {
          return data[header][currentRow];
        }
        const jiraDetails = data[header][currentRow];
        let txt = [];
        for (let jiraId in jiraDetails) {
          txt.push(<Seperator />);
          txt.push(
            jiraDetails[jiraId] ? (
              <Link text={jiraId} />
            ) : (
              <Span text={jiraId} />
            )
          );
        }
        return txt.slice(1);
      })();

      return {
        data: [
          // Title
          {
            text: <Cell text={title} />,
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
            text: <Cell text={text} />,
            css: {
              width: "60%",
              paddingTop: "6px",
              paddingBottom: "6px",
              verticalAlign: "top",
              wordBreak: "break-all",
            },
          },
        ],
      };
    });
  };

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
    <Grid item xs={3}>
      <Zoom in={currentRow !== -1}>
        <DataTable
          verticalBorder={true}
          header={header()}
          rowList={rows()}
          serialNo={false}
        />
      </Zoom>
    </Grid>
  );
}

export default function SecondaryTableWrapper(props) {
  return props.currentRow !== -1 ? <SecondaryTable {...props} /> : null;
}
