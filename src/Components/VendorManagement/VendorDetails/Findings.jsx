import { useState, useRef, useEffect } from "react";
import {
  Box,
  Icon,
  IconButton,
  InputAdornment,
  makeStyles,
  Typography,
  Divider,
  TextField,
  Button,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { TextControl } from "../../Utils/Control";

const useStyle = makeStyles((theme) => ({
  searchInput: {
    width: 270,
    "@media (max-width: 960px)": {
      flexGrow: 1,
    },
    backgroundColor: "white",
    borderRadius: 7,
    borderRight: 0,
    "& .MuiOutlinedInput-adornedStart": {
      paddingLeft: 8,
      paddingRight: 8,
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: 7,
      height: 40,
    },
  },
  addFindingInput: {
    width: "270px",
    height: "130px",
    overflow: "auto",
    backgroundColor: "white",
    borderRadius: 7,
    padding: 8,
  },
  button: {
    textTransform: "none",
    marginTop: 10,
  },
}));

const Findings = ({ findings = [], setFindingsRows }) => {
  const classes = useStyle();
  const [searchValue, setSearchValue] = useState("");
  const [addFindingVisible, setAddFindingVisible] = useState(false);
  const [newFinding, setNewFinding] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const updateSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const searchFindings = (rows, searchValue) => {
    return rows.filter((row) => {
      const matchesSearch = searchValue
        ? row.description.toLowerCase().includes(searchValue.toLowerCase())
        : true;
      return matchesSearch;
    });
  };

  const handleAddFinding = async () => {
    const res = await setFindingsRows("add", newFinding);
    setNewFinding("");
    if (res && res.status) {
      setAddFindingVisible(false);
    }
  };

  const handleMenuOpen = (event, finding) => {
    setAnchorEl(event.currentTarget);
    setSelectedFinding(finding);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditFinding = () => {
    setNewFinding(selectedFinding.description);
    setIsEditing(true);
    setEditingIndex(findings.indexOf(selectedFinding));
    handleMenuClose();
  };

  const handleSaveEdit = async () => {
    const res = await setFindingsRows("edit", { id: selectedFinding.id, description: newFinding, review: selectedFinding.review});
    if (res && res.status) {
      setNewFinding("");
      setIsEditing(false);
      setEditingIndex(null);
    }
  };

  const handleCancelEdit = () => {
    setNewFinding("");
    setIsEditing(false);
    setEditingIndex(null);
  };

  const handleDeleteFinding = async () => {
    await setFindingsRows("delete", selectedFinding.id);
    handleMenuClose();
  };

  const searchedFindings = searchFindings(findings, searchValue);

  return (
    <Box
      display="flex"
      height="55vh"
      flexDirection="column"
      alignItems="center"
    >
      {findings.length > 0 ? (
        <>
          <Box display="flex" mt={2}>
            <TextControl
              variant="outlined"
              placeholder="Search findings"
              size="small"
              gutter={false}
              label=" "
              className={classes.searchInput}
              value={searchValue}
              onChange={updateSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {searchValue ? (
                      <IconButton
                        size="small"
                        color="#4477CE"
                        onClick={() => {
                          updateSearch({ target: { value: "" } });
                        }}
                      >
                        <Icon>close</Icon>
                      </IconButton>
                    ) : (
                      <Icon color="primary">search</Icon>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box m={2} display="flex" flexDirection="column" alignItems="center">
            <TextField
              inputRef={inputRef}
              variant="outlined"
              placeholder="Type to add a finding"
              value={newFinding}
              onChange={(e) => setNewFinding(e.target.value)}
              onFocus={() => setAddFindingVisible(true)}
              className={classes.addFindingInput}
              multiline
              rows={4}
            />
            {addFindingVisible && (
              <>
                {isEditing ? (
                  <Box display="flex" flexDirection="row">
                    <Box>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveEdit}
                        className={classes.button}
                        disabled={!newFinding.trim()}
                      >
                        Save
                      </Button>
                    </Box>
                    <Box ml={2}>
                      <Button
                        variant="contained"
                        onClick={handleCancelEdit}
                        className={classes.button}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddFinding}
                    className={classes.button}
                    disabled={!newFinding.trim()}
                  >
                    Add Finding
                  </Button>
                )}
              </>
            )}
          </Box>

          <Box
            overflow="auto"
            display="flex"
            flexDirection="column"
            width="90%"
          >
            {searchedFindings.map((finding, index) => (
              <Box key={index} mt={2} display="flex" flexDirection="column">
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">{finding.author}</Typography>
                  <IconButton
                    size="small"
                    onClick={(event) => handleMenuOpen(event, finding)}
                  >
                    <Icon>more_horiz</Icon>
                  </IconButton>
                </Box>
                <Box display="flex" mt={2} mb={2} maxWidth="274px">
                  <Typography
                    variant="body1"
                    style={{
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {finding.description}
                  </Typography>
                </Box>
                <Divider />
              </Box>
            ))}
          </Box>
        </>
      ) : (
        <Box m={2} display="flex" flexDirection="column" alignItems="center">
          <TextField
            inputRef={inputRef}
            variant="outlined"
            placeholder="Type to add a finding"
            value={newFinding}
            onChange={(e) => setNewFinding(e.target.value)}
            onFocus={() => setAddFindingVisible(true)}
            className={classes.addFindingInput}
            multiline
            rows={4}
          />
          {addFindingVisible && (
            <>
              {isEditing ? (
                <Box display="flex" flexDirection="row">
                  <Box>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSaveEdit}
                      className={classes.button}
                      disabled={!newFinding.trim()}
                    >
                      Save
                    </Button>
                  </Box>
                  <Box ml={2}>
                    <Button
                      variant="contained"
                      onClick={handleCancelEdit}
                      className={classes.button}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddFinding}
                  className={classes.button}
                  disabled={!newFinding.trim()}
                >
                  Add Finding
                </Button>
              )}
            </>
          )}
          <Box mt={2}>
            <Typography>No findings yet</Typography>
          </Box>
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditFinding}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteFinding}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default Findings;
