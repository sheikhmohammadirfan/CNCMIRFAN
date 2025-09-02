import React, { useState, forwardRef } from "react";
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
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { toast } from "react-toastify";
import sendMail from "../Service/email.service";
import DocumentTitle from "../Components/DocumentTitle";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { EMAIL_REGEX } from "../assets/data/Other";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  form: {
    "& > *": {
      margin: "0.4rem 0",
      padding: "0.2rem 0 0",
    },
  },

  boxStyling: {
    color: "white",
    fontSize: "1rem",
    fontWeight: "500",
    margin: "-0.5rem 0",
    width: "100%",
  },

  dialogTitleStyle: {
    backgroundColor: theme.palette.primary.main,
  },

  closeIcon: {
    padding: "0.1rem",
    borderRadius: "50%",
    border: "1px solid transparent",
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
      transition: "0.2s ease-in",
    },
  },

  carbonCopyStyles: {
    fontSize: "small",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& div": {
      color: "black",
      display: "flex",
      gap: "0.3rem",
      cursor: "pointer",
    },
  },
  cc_bcc_Items: {
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },

  heading: {
    margin: "0 0 !important",
    padding: "0",
    borderBottom: `0.2px solid ${theme.palette.primary.light_grey}`,
  },

  headingText: {
    fontFamily: "inherit",
    fontWeight: "550",
    marginBottom: "4px",
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
    width: "480px",
    borderBottom: `0.2px solid ${theme.palette.primary.light_grey}`,
    "& input": {
      flex: "1",
      marginBottom: "4px",
      border: "none",
      height: "3rem",
      padding: "4px",
      background: "none",
      borderRadius: "6px",
      backgroundColor: "transparent",
      minWidth: "60%",
      width: "100%",
      fontSize: "14px",
      padding: "4px 0 0 0",
      "&:focus": {
        outline: "transparent",
        backgroundColor: "transparent",
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
    display: "block",
    borderRadius: "5px",
    padding: "5px",
    margin: "5px 0",
    fontWeight: "bold",
    position: "relative",
    "& .MuiChip-deleteIcon": {
      position: "absolute",
      right: "0",
      fontWeight: "normal",
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

    height: 0,
    "&.visible": {
      height: "unset",
    },
  },

  scrollBoxContainer: {
    display: "inline-flex",
  },

  scrollBoxContainer2: {
    display: "flex",
    flexWrap: "wrap",
  },
  sendContainer: {
    borderTop: `1px solid ${theme.palette.primary.light_grey}`,
    paddingTop: "0.2rem",
    marginBottom: "0.2rem",
    display: "flex",
    gap: "0.5rem",
  },

  sendButton: {
    color: "white",
    borderRadius: "50px",
    backgroundColor: theme.palette.primary.main,
    height: "2.2rem",
    width: "5rem",
    padding: "1rem",
    "&:hover": {
      backgroundColor: theme.palette.secondary.light,
    },
  },
  attachIcon: {
    height: "2.2rem",
    width: "2.2rem",
    padding: "0.8rem",
    color: theme.palette.primary.main,
  },

  chipcontainer: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "red",
  },
  dialogwidth: {
    "& .MuiDialog-paperFullWidth": {
      width: "calc(50rem - 64px)",
    },
  },
  footerDialog: {
    padding: "0 24px",
  },

  dialogContent: {
    "& .MuiDialogContent-root": {
      height: "500px",
    },
  },
  textArea: {
    "& .MuiInputBase-inputMultiline": {
      height: "370px",
    },
  },
}));

function Email({ title, close }) {
  DocumentTitle(title);
  const classes = useStyles();
  const [showcc, setShowcc] = useState(false);
  const [showbcc, setShowbcc] = useState(false);
  const [mailAcknowledgement, setMailAcknowledgement] = useState(false);
  useEffect(() => {
    if (mailAcknowledgement)
      setTimeout(() => setMailAcknowledgement(false), 1000);
  }, [mailAcknowledgement]);

  const [loader, setLoader] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [tags, setTags] = useState({ to: [], cc: [], bcc: [] });
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleClickCc = () => {
    setShowcc((prevShowCc) => !prevShowCc);
  };
  const handleClickBcc = () => {
    setShowbcc((prevShowBcc) => !prevShowBcc);
  };

  const handleIsFocused = () => {
    setIsInputFocused(true);
  };

  const handleIsBlurr = () => {
    setIsInputFocused(false);
  };

  const textfields = [
    {
      name: "to",
      type: "email",
      visible: true,
    },
    {
      name: "cc",
      type: "email",
      visible: showcc,
    },
    {
      name: "bcc",
      type: "email",
      visible: showbcc,
    },
  ];

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

  const handleClose = () => {
    setMailAcknowledgement(false);
    resetFields();
  };

  const resetFields = () => {
    close();
  };

  const emailValidation = (email) => {
    const regex = EMAIL_REGEX;
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
    <>
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
      </Dialog>

      <Dialog
        open={true}
        maxWidth=""
        fullWidth
        className={`${classes.dialogwidth} ${classes.dialogContent} ${classes.textArea} ${classes.footerDialog}`}
      >
        <DialogTitle className={classes.dialogTitleStyle}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            className={classes.boxStyling}
          >
            <span>Email</span>
            <CloseRoundedIcon
              onClick={handleClose}
              className={classes.closeIcon}
            />
          </Box>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <DialogContentText>
            <Box className={classes.carbonCopyStyles}>
              Write Mails Effectively.
              <div>
                <a onClick={handleClickCc} className={classes.cc_bcc_Items}>
                  Cc
                </a>
                <a onClick={handleClickBcc} className={classes.cc_bcc_Items}>
                  Bcc
                </a>
              </div>
            </Box>
          </DialogContentText>
          <Box>
            {textfields.map((item, index) =>
              item.visible ? (
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
                        className={`${classes.scrollBoxWrapper} ${
                          tags[item.name].length > 0 ? "visible" : ""
                        }`}
                      >
                        <div
                          className={`${
                            isInputFocused
                              ? classes.scrollBoxContainer2
                              : classes.scrollBoxContainer
                          }`}
                          role="list"
                        >
                          {tags[item.name].map((tag, idx) => (
                            <div>
                              <Chip
                                style={{ overflow: "hidden", margin: "2px" }}
                                color="primary"
                                key={idx}
                                label={tag}
                                variant="outlined"
                                size="small"
                                deleteIcon={
                                  <span className={classes.tagCloseIcon}>
                                    x
                                  </span>
                                }
                                onDelete={() => removeTags(idx, item.name)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <input
                        onFocus={handleIsFocused}
                        name={item.name}
                        type="text"
                        onKeyUp={(event) =>
                          event.key === "Enter" || event.key === " "
                            ? addTags(event)
                            : null
                        }
                        style={{ padding: 8, height: "2rem", margin: 0 }}
                        onBlur={(event) => {
                          addTags(event);
                          handleIsBlurr();
                        }}
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>
              ) : null
            )}

            <Box className={classes.heading}>
              <TextField
                fullWidth
                name="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                variant="standard"
                InputProps={{
                  className: classes.headingText,
                  disableUnderline: true,
                }}
              />
            </Box>

            <TextField
              style={{ position: "relative", background: "transparent" }}
              variant="standard"
              fullWidth
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Body"
              InputProps={{
                disableUnderline: true,
              }}
              multiline
              rows={4}
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
          </Box>
        </DialogContent>

        <DialogTitle className={classes.footerDialog}>
          <Box className={classes.sendContainer}>
            <Button
              type="submit"
              onClick={handleSubmit}
              className={classes.sendButton}
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                Send
                <CircularProgress
                  size={20}
                  style={{
                    color: "#fff",
                    marginLeft: "6px",
                    width: loader ? 20 : 0,
                  }}
                />
              </span>
            </Button>
            <IconButton
              className={classes.attachIcon}
              type="file"
              component="label"
            >
              <AttachFileIcon></AttachFileIcon>
              <input multiple type="file" onChange={uploadFiles} hidden />
            </IconButton>
          </Box>
        </DialogTitle>
      </Dialog>
    </>
  );
}

export default Email;
