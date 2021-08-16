import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import UploadService from "../Service/upload.service";

// styles for the verify section
const styles = (theme) => ({
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
    cursor: "pointer",
    transition: "color 0.3s",
    "&:hover" : {
      color: "red",
    },
  },

  fileList: {
    // height: "35rem",
    width: "55vw",
    margin: "0 auto 1.5rem"
  },

});

// upload class for handling upload services
class UploadPreview extends React.Component {
  // initializing our fields
  constructor(props) {
    super(props);
    this.selectFile = this.selectFile.bind(this);
    this.upload = this.upload.bind(this);

    this.state = {
      selectedFiles: undefined,
      currentFile: undefined,
      progress: 0,
      message: "",
      timerID: null,  

      fileInfos: [],
    };
  }

  // reset message after 5 second
  resetMessage() {
    this.timerId = setTimeout(() => {
      this.setState({progress: 0, message: "" });
       this.timerId = null;
    }, 5000);
  }

  // checking if our component mounted
  componentDidMount() {
    UploadService.getFiles().then((response) => {
      this.setState({
        fileInfos: response.data,
      });
    });
  }

  // selecting the file from the user
  selectFile(event) {
    this.setState({
      selectedFiles: event.target.files,
    });
  }

  //upload function to handle file upload

  upload() {
    //select the current file and set progress to 0
    let currentFile = this.state.selectedFiles[0];

    this.setState({
      progress: 0,
      currentFile: currentFile,
    });
    
    // passing the selected file to the api and handling response
    UploadService.upload(currentFile, (event) => {
      this.setState({
        progress: Math.round((100 * event.loaded) / event.total),
      });
    })
      .then((response) => {
        this.setState({
          message: response.data.msg,
        });
        this.resetMessage();
        return UploadService.getFiles();
      })
      .then((files) => {
        this.setState({
          fileInfos: files.data,
        });
        console.log(this.state.fileInfos);
      })
      .catch(() => {
        this.setState({
          progress: 0,
          message: "Could not upload the file!",
          currentFile: undefined,
        });
      });
      // if the file was not selected
    this.setState({
      selectedFiles: undefined,
    });
  }

  render() {
    const { classes } = this.props;
    const {
      selectedFiles,
      currentFile,
      progress,
      message,
      fileInfos,
    } = this.state;

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
            <>
              <DeleteOutline
                className={classes.userListDelete}
              />
            </>
          );
        },
      }
    ];

    return (
      <div>
        <div className={classes.inpContainer}> 
          <label className={classes.customInp} htmlFor="upload">
            Choose file
          </label>
          <input
          multiple
            id="upload"
            type="file"
            onChange={this.selectFile}
            hidden
            />
          <Button className={classes.success} disabled={!selectedFiles} variant="contained" onClick={this.upload}>Upload</Button>
        </div>
        {currentFile && progress!==0 && (
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
            {id: `${index + 1}`, filename: file.file_name, lastModified: file.file.split("/")[5] }
          ))
        }
        autoHeight
        onCellEditCommit = {e => console.log(e)}
        columns = {columns}
        disableSelectionOnClick
        pageSize={8}
          checkboxSelection
        />
        </div>
      </div>
    );
  }
}
export default withStyles(styles, { withTheme: true })(UploadPreview);
