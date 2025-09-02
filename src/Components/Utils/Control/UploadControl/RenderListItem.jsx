import {
  Icon,
  IconButton,
  ListItem,
  makeStyles,
  Typography,
} from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  fileListItem: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    border: `1px solid ${theme.palette.grey[400]}`,
    borderBottom: "none",
    "&:last-child": { borderBottom: `1px solid ${theme.palette.grey[400]}` },
    "&:hover": {
      borderColor: theme.palette.grey[600],
      "& + *": { borderTopColor: theme.palette.grey[600] },
    },
    "& .MuiTypography-root": { flexGrow: 1 },
    "& .MuiIcon-root": { fontSize: "1.2rem" },
  },
}));

// Method to render list item
export const RenderListItem = ({ listItem, fileName, index, removeFile }) => {
  const classes = useStyle();

  return listItem ? (
    listItem(fileName, index, removeFile)
  ) : (
    <ListItem className={classes.fileListItem} button dense  data-test="listitem-container">
      <Typography variant="body2" noWrap>
        {fileName}
      </Typography>
      <IconButton size="small" onClick={removeFile} data-test="listitem-remove-btn">
        <Icon>clear</Icon>
      </IconButton>
    </ListItem>
  );
};
