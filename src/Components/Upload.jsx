import React from "react";
import {withStyles} from "@material-ui/core/styles";
import { Button } from '@material-ui/core';

const styles = theme => ({
    customInp: {
        border: "none",
        padding: ".5rem .8rem",
        backgroundColor: "darkblue",
        color: "#fff",
        cursor: "pointer",
        borderRadius: "4px",
        
      },

      centerAlign: {
        textAlign: "center", margin: "1rem"
      },

      styledImage: {
          width: "80%",
          boxShadow: "0 4px 6px rgba(0,0,0, .5)"
      }
});


class UploadPreview extends React.Component {
    constructor(props) {
      super(props);
      this.state = { file: null };
      this.onChange = this.onChange.bind(this);
      this.resetFile = this.resetFile.bind(this);
    }
    onChange(event) {
      this.setState({
        file: URL.createObjectURL(event.target.files[0])
      });
    }
  
    resetFile(event) {
      event.preventDefault();
      this.setState({ file: null });
    }
    render() {
      const { classes } = this.props;
      return (
        <div>
            <label 
            className={classes.customInp}
            htmlFor="upload">Choose file</label>
          <input id="upload" type="file" accept="image/*" onChange={this.onChange} hidden/>
          <br />
          {this.state.file && (
            <div className={classes.centerAlign}>
              <Button variant="outlined" onClick={this.resetFile}>Remove File</Button>
            </div>
          )}
          <img className={classes.styledImage} src={this.state.file} alt="" />
        </div>
      );
    }
  }
  export default withStyles(styles, { withTheme: true })(UploadPreview);