import {
  Button,
  Fade,
  Checkbox,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  makeStyles,
  TableFooter,
  TablePagination,
  Box,
  IconButton,
  Icon,
  CircularProgress,
} from "@material-ui/core";
import React from "react";
import { useState } from "react";
import { deleteFiles, getFiles } from "../../Service/upload.service";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: `${theme.spacing(1)}px 0`,
    border: `2px solid ${theme.palette.grey[300]}`,
    borderRadius: theme.shape.borderRadius,
  },
}));

const WarningToast = ({ deleteMethod }) => {
  return (
    <Box>
      Are you sure to delete selected files?
      <Box marginTop={0.5}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => {
            deleteMethod();
            toast.dismiss("delete-toast");
          }}
        >
          Yes
        </Button>
        <Button
          size="small"
          variant="contained"
          style={{ marginLeft: 8 }}
          onClick={() => toast.dismiss("delete-toast")}
        >
          No
        </Button>
      </Box>
    </Box>
  );
};

function FileDataGrid({ files, loading, setLoading, refreshFiles }) {
  const classes = useStyles();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const updateFiles = (index, id, e) => {
    if (e.target.checked) setSelectedFiles((val) => [...val, files[index]]);
    else setSelectedFiles((val) => val.filter((file) => file.id !== id));
  };
  const updateAllFiles = (e) => {
    if (e.target.checked)
      setSelectedFiles([...files.slice(currIn, currIn + rowsPerPage)]);
    else setSelectedFiles([]);
  };

  const rowsPerPage = 4;
  const [page, setPage] = useState(0);
  const [currIn, setCurr] = useState(0);
  const updatePage = (_, index) => {
    setPage(index);
    setCurr(index * rowsPerPage);
    setSelectedFiles([]);
  };
  const getCurrMax = () =>
    currIn + rowsPerPage > files.length ? files.length - currIn : rowsPerPage;

  const deleteSelectedFiles = async () => {
    if (selectedFiles.length > 0) {
      setLoading(true);
      const status = await deleteFiles([...selectedFiles]);
      if (status) {
        setSelectedFiles([]);
        await refreshFiles();
        setLoading(false);
      }
    }
  };

  const showWarning = () => {
    toast(<WarningToast deleteMethod={deleteSelectedFiles} />, {
      toastId: "delete-toast",
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      type: "error",
    });
  };

  return (
    <TableContainer className={classes.root}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                indeterminate={
                  selectedFiles.length > 0 &&
                  selectedFiles.length < getCurrMax()
                }
                checked={
                  !loading &&
                  selectedFiles.length > 0 &&
                  selectedFiles.length === getCurrMax()
                }
                onClick={updateAllFiles}
              />
            </TableCell>
            <TableCell>ID</TableCell>
            <TableCell>FileName</TableCell>
            <TableCell align="right">Last Activity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.slice(currIn, currIn + rowsPerPage).map((file, index) => (
            <TableRow key={index}>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedFiles.map((s) => s.id).includes(file.id)}
                  onChange={(e) => updateFiles(currIn + index, file.id, e)}
                />
              </TableCell>
              <TableCell>{currIn + index + 1}</TableCell>
              <TableCell>{file.file_name}</TableCell>
              <TableCell align="right">{file.file.split("/")[5]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <caption style={{ padding: 8 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center">
              <Fade
                in={!loading && selectedFiles.length > 0}
                mountOnEnter
                unmountOnExit
              >
                <div>
                  <IconButton onClick={showWarning}>
                    <Icon>delete</Icon>
                  </IconButton>
                  <Button color="primary" variant="contained">
                    Verify
                  </Button>
                </div>
              </Fade>
              <Fade in={loading} mountOnEnter unmountOnExit>
                <CircularProgress size={32} />
              </Fade>
            </Box>
            <TablePagination
              rowsPerPageOptions={[]}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={updatePage}
              count={files.length}
              component={Box}
            />
          </Box>
        </caption>
      </Table>
    </TableContainer>
  );
}

export default FileDataGrid;
