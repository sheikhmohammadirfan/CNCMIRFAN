import { Box, makeStyles, Typography } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  statusCell: {
    padding: "4px 8px",
    border: "1px solid rgba(0, 0, 0, 0.2)",
    fontSize: "0.8rem",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "5px"
  },

  cellLabel: {
    padding: "3px 10px",
    fontSize: "0.875rem",
    // backgroundColor: "rgba(0, 0, 0, 0.05)",
    color: "rgba(0, 0, 0, 0.75)",
    border: "1px solid rgba(0, 0, 0, 0.2)",
    borderRadius: "50px",
  },
}))

export function PillCell({ showColorDot, dotColor, cellValue }) {
  const classes = useStyle();
  return (
    <Typography variant="body2" noWrap className={classes.statusCell}>
      {showColorDot &&
        <span style={{
          minHeight: "10px",
          minWidth: "10px",
          borderRadius: "50%",
          display: "inline-block",
          backgroundColor: dotColor
        }}>
        </span>
      }
      {cellValue || "Provide cell value"}
    </Typography>
  )
}

export function MultipePills({ cellValue }) {
  const classes = useStyle();
  return (
    <Box display="flex" gridColumnGap={5}>
      {cellValue.length > 0 && cellValue.map((val, index) => (
        <Typography key={index} variant="body1" noWrap className={classes.cellLabel}>{val.text || "Keys not proper"}</Typography>
      ))}
    </Box>
  )
}