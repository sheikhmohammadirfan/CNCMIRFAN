import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  ClickAwayListener,
  Icon,
  IconButton,
  makeStyles,
  Slide,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import {
  poam_header,
  poam_rows,
  secondaryColumns,
} from "../assets/data/PoamData";
import DocumentTitle from "../Components/DocumentTitle";
import FormDialog from "../Components/FormDialog";
import DataTable from "../Components/Utils/DataTable";

const useStyle = makeStyles((theme) => ({
  selection_checkbox: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  selected_row: {
    background: "rgba(56,163,165,0.2)",
  },
  secondaryTable_root: {
    width: "300px",
    position: "absolute",
    bottom: 0,
    left: theme.spacing(3 / 4),
    zIndex: 5000,
    padding: 0,
  },
}));

const SecondaryTable = ({ currentRow, closeTable }) => {
  const classes = useStyle();

  return (
    <Slide in={currentRow != -1} direction="right" mountOnEnter unmountOnExit>
      <Box className={classes.secondaryTable_root}>
        <Box>
          <DataTable
            style={{ background: "white" }}
            showIndex={true}
            verticalBorder={true}
            rows={[
              {
                data: [
                  {
                    text: (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography variant="button">
                          Secondary Table
                        </Typography>
                        <IconButton size="small" onClick={closeTable}>
                          <Icon>cancel</Icon>
                        </IconButton>
                      </Box>
                    ),
                    props: {
                      style: { paddingTop: "6px", paddingBottom: "6px" },
                      colSpan: 2,
                    },
                  },
                ],
              },
              ...[...secondaryColumns].map((index) => ({
                data: [
                  {
                    text: (
                      <Typography
                        noWrap={true}
                        variant="caption"
                        component="div"
                      >
                        {poam_header[index]}
                      </Typography>
                    ),
                    props: {
                      style: {
                        maxWidth: "180px",
                        paddingTop: "6px",
                        paddingBottom: "6px",
                        background: "rgba(234, 234, 234, 0.3)",
                      },
                    },
                  },
                  {
                    text: (
                      <Typography
                        noWrap={true}
                        variant="caption"
                        component="div"
                      >
                        {poam_rows[currentRow == -1 ? 0 : currentRow][index]}
                      </Typography>
                    ),
                    props: {
                      style: {
                        maxWidth: "110px",
                        paddingTop: "6px",
                        paddingBottom: "6px",
                      },
                    },
                  },
                ],
              })),
            ]}
          />
        </Box>
      </Box>
    </Slide>
  );
};

function Poam({ title }) {
  DocumentTitle(title);

  const [alignment, setAlignment] = useState("left");
  const handleAlignment = (e, newAlignment) => {
    setAlignment(newAlignment);
  };

  const [selectedRow, setSelectedRow] = useState([]);
  const handleSelection = (e, index) => {
    if (e.target.checked) {
      setSelectedRow((row) => [...row, index]);
    } else {
      setSelectedRow((row) => row.filter((i) => i != index));
    }
  };

  const [currentRow, setcurrentRow] = useState(-1);

  const [formOpen, setFormOpen] = useState(true);
  const closeFormDialog = () => setFormOpen(false);

  const classes = useStyle();

  return (
    <Box padding={1} textAlign="center">
      <Box width="90%" maxWidth={900} marginX="auto">
        <Box
          display="flex"
          justifyContent="space-between"
          paddingTop={1}
          paddingBottom={1}
        >
          <Typography variant="h4" style={{ fontWeight: "bold" }}>
            File name
          </Typography>
          <ButtonGroup
            color="default"
            size="small"
            aria-label="outlined primary button group"
          >
            <Tooltip arrow title="Move to Close POAM">
              <Button>
                <Icon>edit_note</Icon>
              </Button>
            </Tooltip>
            <Tooltip arrow title="Delete row">
              <Button disabled={selectedRow.length !== 1}>
                <Icon>delete_forever</Icon>
              </Button>
            </Tooltip>
            <Tooltip arrow title="Edit row">
              <Button disabled={selectedRow.length !== 1}>
                <Icon>edit</Icon>
              </Button>
            </Tooltip>
            <Button
              startIcon={<Icon>add</Icon>}
              variant="contained"
              disableElevation
              style={{
                background: "black",
                color: "white",
                fontWeight: "bold",
              }}
              onClick={() => setFormOpen(true)}
            >
              Create New
            </Button>
          </ButtonGroup>
        </Box>
        <ClickAwayListener onClickAway={() => setcurrentRow(-1)}>
          <Box>
            <DataTable
              showIndex={true}
              verticalBorder={true}
              header={{
                data: [
                  {
                    text: (
                      <Typography
                        noWrap={true}
                        style={{ fontWeight: "bold" }}
                        variant="body1"
                      >
                        Sr. no.
                      </Typography>
                    ),
                  },
                  ...poam_header
                    .filter((val, index) => !secondaryColumns.has(index))
                    .map((txt) => ({
                      text: (
                        <Typography
                          noWrap={true}
                          style={{ fontWeight: "bold" }}
                          variant="body1"
                        >
                          {txt}
                        </Typography>
                      ),
                    })),
                ],
              }}
              rows={poam_rows.map((rowData, row_index) => ({
                data: [
                  {
                    text: (
                      <>
                        <Typography variant="body2" align="center">
                          {row_index}
                        </Typography>
                        <Checkbox
                          className={classes.selection_checkbox}
                          size="small"
                          onChange={(e) => handleSelection(e, row_index)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </>
                    ),
                    props: {
                      style: {
                        paddingTop: "6px",
                        paddingBottom: "4px",
                        position: "relative",
                      },
                    },
                  },
                  ...rowData
                    .filter((val, index) => !secondaryColumns.has(index))
                    .map((cellData) => ({
                      text: <Typography variant="body2">{cellData}</Typography>,
                      props: {
                        style: { paddingTop: "6px", paddingBottom: "4px" },
                      },
                    })),
                ],
                props: {
                  className:
                    selectedRow.includes(row_index) || currentRow == row_index
                      ? classes.selected_row
                      : "",
                  style: { cursor: "pointer" },
                  onClick: () => setcurrentRow(row_index),
                },
              }))}
            />
          </Box>
        </ClickAwayListener>
      </Box>
      <SecondaryTable
        currentRow={currentRow}
        closeTable={() => setcurrentRow(-1)}
      />
      <FormDialog open={formOpen} onClose={closeFormDialog} data={""} />
    </Box>
  );
}

export default Poam;
