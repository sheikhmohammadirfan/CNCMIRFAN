import React, { useState, useRef, forwardRef } from "react";
import {
  Box,
  Chip,
  Icon,
  TextField,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { toast } from "react-toastify";
import sendMail from "../Service/email.service";
import useScrollBox from "../Components/ScrollBar/useScrollBar";
import DocumentTitle from "../Components/DocumentTitle";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  form: {
    "& > *:not(:first-child)": {
      margin: "0.4rem 0",
      backgroundColor: "rgba(218,250,211, 0.4)",
    },
  },

  heading: {
    margin: "0 0 1.5rem",
    borderBottom: "1px solid #ccc",
    boxShadow: "0 8px 6px -6px rgba(0,0,0,0.3)",
    paddingBottom: "1rem",
  },

  headingText: {
    fontFamily: "inherit",
    fontWeight: "550",
    marginBottom: "4px",
  },

  labelColor: {
    color: theme.palette.primary.main,
    fontWeight: "550",
  },

  messageText: {
    minHeight: "4rem",
    padding: "0.4rem 0.4rem",
    "&::placeholder": {
      color: theme.palette.primary.main,
    },
  },
  bottomRight: {
    position: "absolute",
    bottom: "0.5rem",
    right: "0.5rem",
  },

  formatBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: "4px",
    padding: "2px",
    position: "absolute",
    left: "0.5rem",
    bottom: "0.5rem",
    fontSize: "0.8rem",
  },

  fieldLabel: {
    padding: "4px",
    width: "32px",
    textTransform: "capitalize",
    color: theme.palette.primary.main,
    fontWeight: 600,
  },

  tagsInput: {
    display: "flex",
    alignItems: "flex-start",
    flexWrap: "wrap",
    minHeight: "3rem",
    width: "480px",
    padding: "0 8px",
    border: "1px solid rgb(214, 216, 218)",
    borderRadius: "6px",
    "&:focus-within": {
      border: `2px solid ${theme.palette.primary.main}`,
    },
    "& input": {
      flex: "1",
      marginBottom: "4px",
      border: "none",
      height: "3rem",
      padding: "4px",
      background: "none",
      borderRadius: "6px",
      backgroundColor: "rgba(218,250,211, 0.2)",
      minWidth: "60%",
      width: "100%",
      fontSize: "14px",
      // padding: '4px 0 0 0',
      "&:focus": {
        outline: "transparent",
        backgroundColor: "rgba(218,250,211, 0.6)",
      },
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },

  tagCloseIcon: {
    textAlign: "center",
    fontSize: "0.85rem",
    color: theme.palette.primary.dark,
    borderRadius: "50%",
    cursor: "pointer",
    "&:hover": {
      background: theme.palette.secondary.dark,
      color: "#fff",
    },
  },

  fileList: {
    "&:not(:last-of-type)": {
      marginRight: 4,
    },
  },

  scrollBox: {
    position: "relative",
    width: "100%",
    overflow: "hidden",
  },

  scrollBoxWrapper: {
    width: "100%",
    overflowX: "scroll",
    overflowY: "hidden",
    overflow: "-moz-scrollbars-none",

    "&::-webkit-scrollbar": {
      display: "none",
    },
  },

  scrollBoxContainer: {
    height: "auto",
    display: "inline-flex",
  },

  gradientBtn: {
    background: "linear-gradient(45deg, #44ea76 30%, #39fad7 90%)",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(100, 205, 100, .3)",
    color: "white",
    "&:hover": {
      boxShadow: "0 3px 5px 2px rgba(100, 205, 100, .3)",
    },
    // outline: "none",
    // border: "none",
    // borderRadius: "6px",
    // color: "#fff",
    // textTransform: "uppercase",
    // fontSize: "1rem",
    // width: "100%",
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
    // background:
    //   "linear-gradient(to right, #44ea76 0%, #39fad7 80%, #39fad7 100%)",
    // boxShadow: "0 5px 10px #44ea76",
  },
}));

const textfields = [
  {
    name: "to",
    type: "email",
  },
  {
    name: "cc",
    type: "email",
  },
  {
    name: "bcc",
    type: "email",
  },
];

function Email({ title }) {
  DocumentTitle(title);
  const current = new Date();
  const date = `${current.toLocaleString("en-us", {
    month: "short",
  })} ${current.getDate()} , ${current.toLocaleString("en-us", {
    year: "numeric",
  })}`;
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [mailAcknowledgement, setMailAcknowledgement] = useState(false);
  const [loader, setLoader] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [tags, setTags] = useState({ to: [], cc: [], bcc: [] });
  const scrollWrapperRef = useRef();
  const { isDragging } = useScrollBox(scrollWrapperRef);

  const addTags = (event) => {
    const value = event.target.value.trim();
    if (value !== "" && emailValidation(value)) {
      const name = event.target.name;
      setTags({
        ...tags,
        [name]: [...tags[name], value],
      });
      event.target.value = "";
    } else if (event.target.value !== "" && !emailValidation(value)) {
      notification("Invalid Mail", "error");
    }
  };

  const removeTags = (indexToRemove, itemName) => {
    setTags({
      ...tags,
      [itemName]: tags[itemName].filter((_, index) => index !== indexToRemove),
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    resetFields();
    setMailAcknowledgement(false);
  };

  const resetFields = () => {
    setOpen(false);
    setTags({ to: [], cc: [], bcc: [] });
    setSubject("");
    setMessage("");
    setLoader(false);
    setFiles([]);
  };

  const emailValidation = (email) => {
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!email || regex.test(email) === false) {
      return false;
    }
    return true;
  };

  const notification = (msg, type) => {
    toast(msg, { type, toastId: "upload-toast", position: "top-center" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(subject, tags.to, tags.cc, tags.bcc, message);
    setLoader(true);
    if (tags.to.length === 0 && message.length === 0) {
      notification(
        "Please fill the required 'To' and 'Message' fields",
        "warning"
      );
      setLoader(false);
    } else if (tags.to.length === 0) {
      notification("'To' field cannot be empty!", "warning");
      setLoader(false);
    } else if (message.length === 0) {
      notification("'Message' field cannot be empty!", "warning");
      setLoader(false);
    } else {
      // console.log(subject, tags.to, tags.cc, tags.bcc, message);
      sendMail(subject, tags.to, tags.cc, tags.bcc, message, files)
        .then(() => {
          setMailAcknowledgement(true);
          resetFields();
        })
        .catch((err) => notification(err, "error"));
    }
  };

  const uploadFiles = (e) => {
    let selectedFiles = Array.from(e.target.files);
    selectedFiles.forEach((file) => {
      const isValidFile = Math.round(file.size / 1024) <= 15360;
      if (!isValidFile) {
        notification(
          "Please upload file with file size less than 25MB",
          "error"
        );
        return;
      }
      setFiles((state) => [...state, file]);
    });
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, idx) => idx !== index));
  };

  return (
    <div>
      <Button
        style={{
          marginTop: "25%",
          marginLeft: "45%",
        }}
        color="primary"
        variant="outlined"
        onClick={handleClickOpen}
      >
        Send Mail
      </Button>

      <Dialog
        open={mailAcknowledgement}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Mail Sent Successfully!"}</DialogTitle>
        <DialogContent
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon style={{ fontSize: "60px" }} color="primary">
            check_circle
          </Icon>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={handleClose}
          >
            Okay
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Email</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Write Mails To Clients Effectively.
          </DialogContentText>
          <Box component="form" className={classes.form}>
            <Box className={classes.heading}>
              <TextField
                autoFocus
                style={{ fontWeight: "bold" }}
                fullWidth
                name="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                label="Subject"
                variant="standard"
                InputProps={{
                  className: classes.headingText,
                }}
              />
              <div style={{ color: "#777", fontWeight: "550" }}>{date}</div>
            </Box>

            {textfields.map((item, index) => (
              <div
                key={index}
                className={classes.tagsInput}
                style={{ width: "100%" }}
              >
                <span className={classes.fieldLabel}>
                  {item.name}
                  {index === 0 ? "*" : ""}
                </span>
                <div key={index} style={{ width: "calc(100% - 32px)" }}>
                  <div className={classes.scrollBox}>
                    <div
                      className={classes.scrollBoxWrapper}
                      ref={scrollWrapperRef}
                    >
                      <div
                        className={classes.scrollBoxContainer}
                        role="list"
                        style={{
                          pointerEvents: isDragging ? "none" : undefined,
                        }}
                      >
                        {tags[item.name].map((tag, idx) => (
                          <Chip
                            style={{ overflow: "hidden", margin: "2px" }}
                            color="primary"
                            key={idx}
                            label={tag}
                            variant="outlined"
                            deleteIcon={
                              <span className={classes.tagCloseIcon}>x</span>
                            }
                            onDelete={() => removeTags(idx, item.name)}
                          />
                        ))}
                      </div>
                    </div>
                    <input
                      name={item.name}
                      type="text"
                      onKeyUp={(event) =>
                        event.key === "Enter" || event.key === " "
                          ? addTags(event)
                          : null
                      }
                      onBlur={addTags}
                      placeholder="example@example.com"
                    />
                  </div>
                </div>
              </div>
            ))}

            <TextField
              style={{ marginTop: "1.5rem", position: "relative" }}
              variant="outlined"
              fullWidth
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter the message here*"
              InputProps={{
                classes: { input: classes.messageText },
              }}
              multiline
            />

            {files.map((file, i) => (
              <Chip
                style={{ overflow: "hidden" }}
                className={classes.fileList}
                color="primary"
                key={i}
                label={file.name}
                variant="outlined"
                deleteIcon={<span className={classes.tagCloseIcon}>x</span>}
                onDelete={() => removeFile(i)}
              />
            ))}
            <ButtonGroup
              fullWidth
              color="primary"
              variant="outlined"
              aria-label="outlined primary button group"
            >
              <Button
                type="file"
                component="label"
                style={{
                  background: "#fff",
                  border: "1px solid #aaa",
                }}
              >
                Choose file
                <Icon
                  style={{
                    marginLeft: "4px",
                    fontSize: "18px",
                  }}
                >
                  attachment
                </Icon>
                <input multiple type="file" onChange={uploadFiles} hidden />
              </Button>
              <Button
                type="submit"
                variant="contained"
                className={classes.gradientBtn}
                onClick={handleSubmit}
              >
                Send
                {loader ? (
                  <CircularProgress
                    size={20}
                    style={{ color: "#fff", marginLeft: "6px" }}
                  />
                ) : (
                  <Icon style={{ marginLeft: "4px", fontSize: "18px" }}>
                    send
                  </Icon>
                )}
              </Button>
            </ButtonGroup>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Email;
