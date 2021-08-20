import React from "react";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import UploadService from "../Service/upload.service";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { ErrorBoundary } from "./ErrorBoundary";

// styles for the verify section
const useStyles = makeStyles((theme) => ({
  // styling input field
  customInp: {
    border: "none",
    padding: ".5rem .8rem",
    backgroundColor: "darkblue",
    color: "#fff",
    cursor: "pointer",
    borderRadius: "4px",
  },

  // general class
  centerAlign: {
    textAlign: "center",
    margin: "1rem",
  },

  // file upload progress container
  progress: {
    borderRadius: "8px",
    margin: "0 auto",
    width: "80%",
    height: "1rem",
    backgroundColor: "lightgrey",
    boxShadow: "box-shadow: 1px 1px 2px 1px #b9b9b9 inset;",
    overflow: "hidden",
  },

  // file upload progress bar
  progressBar: {
    height: "inherit",
    backgroundColor: theme.palette.success.dark,
    color: theme.palette.common.white,
    boxShadow: "1px 1px 5px 2px #989882",
  },

  // alert message
  success: {
    cursor: "pointer",
    marginLeft: "3rem",
    backgroundColor: theme.palette.success.main,
    color: "#fff",
    "&:hover": {
      backgroundColor: theme.palette.success.dark,
    }
  },
  
  inpContainer: {
    display: "flex",
    justifyContent: "center",
    padding: "1.5rem",
  },

  alert: {
    width: "60%",
    borderRadius: "4px",
    height: "auto",
    margin: "1rem auto",
    fontSize: "1.3rem",
    color: "#004085",
    backgroundColor: "#cce5ff",
    borderColor: "#b8daff",
  },

  userListDelete: {
    backgroundColor: "#eee",
    transition: "color 0.2s, backgroundColor: 0.2s",
    "&:hover, &:focus" : {
      backgroundColor: "#fff",
      color: "red",
    },
  },

  fileList: {
    // height: "35rem",
    width: "55vw",
    margin: "0 auto 1.5rem"
  },


  wrongFile: {
    color: "red",
  },
}));

// upload class for handling upload services
function UploadPreview() {
  // initializing our fields
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [fileInfos, setFileInfos] = useState([]);
  

  const classes = useStyles();

  // reset message after 5 second
  const resetMessage = () => {
    setTimeout(() => {
      setProgress(0);
      setMessage("");
      setSelectedFileName("");
      setSelectedFiles(undefined);
    }, 5000);
  }

  // checking if our component mounted
  useEffect(() => {
    UploadService.getFiles().then((response) => {
      setFileInfos(response.data);
    });
  }, []);


  // selecting the file from the user
  const selectFile = (event) => {
    setSelectedFiles(event.target.files[0]);
    setSelectedFileName(event.target.files[0].name);

    if(!event.target.files[0].name.match(/\.(docx|doc|pdf|jpg|jpeg)$/)){
      setSelectedFileName("Please select a valid file");
      setSelectedFiles(undefined);
    }
  };

  //upload function to handle file upload
  const upload = () => {

    setProgress(0);
    // passing the selected file to the api and handling response
    UploadService.upload(selectedFiles, (event) => setProgress(
      Math.round((100 * event.loaded) / event.total),
    ))
      .then((response) => {
        setMessage(response.data.message);
        resetMessage();
        return UploadService.getFiles();
      })
      .then((files) => 
        setFileInfos(files.data)
      )
      .catch((e) => {
        setProgress(0);
        setMessage("Could not upload the file!");
      });
      // if the file was not selected
  };

  const columns = [
      { field: 'id', headerName: 'ID', width: 100 },
      {
        field: 'filename',
        headerName: 'File Name',
        description: 'Double tap on your filename to edit them',
        width: 180,
        editable: true,
      },
      {
        field: 'lastModified',
        headerName: 'Last Modified',
        headerAlign: 'start',
        type: 'number',
        align: 'left',
        width: 180,
      },
      {
        field: "action",
        headerName: "Action",
        width: 150,
        sortable: false,
        renderCell: (params) => {
          return (
            <Button variant="outlined" className={classes.userListDelete}><DeleteOutline
          /></Button>
          );
        },
      }
    ];

    return (
      <div>
        <ErrorBoundary>
        <div className={classes.inpContainer}> 
          <label className={classes.customInp} htmlFor="upload">
            Choose file
          </label>
          <input
          multiple
            id="upload"
            type="file"
            accept=" application/msword, application/pdf, image/*,.doc, .docx"
            onChange={selectFile}
            hidden
            />
          <Button className={classes.success} disabled={!selectedFiles} variant="contained" onClick={upload}>Upload</Button>
        </div>

        <p className={selectedFiles!== undefined ? classes.rightFile : classes.wrongFile}>
          {selectedFileName}
        </p>

        {selectedFiles && progress!==0 && (
          <div className={classes.progress}>
            <div
              className={classes.progressBar}
              style={{ width: progress + "%" }}
            >
              {progress}%
            </div>
          </div>
        )}

        <div className={classes.alert}> 
          {message}
        </div>
        <div className={classes.fileList}>

        <DataGrid
            rows={fileInfos && fileInfos.map((file, index) => 
          (
            {id: index + 1, filename: file.file_name, lastModified: file.file.split("/")[5] }
          ))
        }
        autoHeight
        onCellEditCommit = {e => console.log(e)}
        onCellClick =  {e => UploadService.deleteFile(fileInfos[e.row.id - 1].id).then(
          (res) => {
            setFileInfos(fileInfos.filter((_, index) => 
            index !== e.row.id - 1
          ));
        }
        )}
        columns = {columns}
        disableSelectionOnClick
        pageSize={8}
        loading = {fileInfos === []}
        checkboxSelection
        />
        </div>
      </ErrorBoundary>
      </div>
    );
  }

export default UploadPreview;
