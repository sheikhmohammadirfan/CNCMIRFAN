import { makeStyles } from "@material-ui/core";
import { Icon, Stack, Box, Typography } from "@mui/material";

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
    fontSize: "0.8rem !important",
    // backgroundColor: "rgba(0, 0, 0, 0.05)",
    color: "rgba(0, 0, 0, 0.75)",
    border: "1px solid rgba(0, 0, 0, 0.2)",
    borderRadius: "50px",
  },

  dateCell: {
    overflow: 'hidden',
    whiteSpace: 'pre',
    textOverflow: 'ellipsis'
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
    <Box display="flex" gridGap={10} flexWrap='wrap'>
      {cellValue.length > 0 && cellValue.map((val, index) => (
        <Typography key={index} variant="body1" noWrap className={classes.cellLabel}>{val.text || "Keys not proper"}</Typography>
      ))}
    </Box>
  )
}

export function TextWrapCell({ cellValue }) {
  const classes = useStyle();
  return (
    <Stack spacing={1}>
      {cellValue.map((c, i) => (
        <Box
          key={i}
          display="flex"
          alignItems="center"
        >
          <Icon sx={{ "&.MuiIcon-root": { fontSize: '0.8rem', color: '#aaa', marginRight: 1 } }}>fiber_manual_record</Icon> {c}
          <Typography
            variant="body2"
            style={{ color: '#444' }}
          >
          </Typography>
        </Box>
      ))}
    </Stack>
  )
}

export function DateCell({ cellValue }) {
  const classes = useStyle()

  const dateObj = new Date(cellValue);
  const formatted = dateObj.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  const secondCommaIndex = formatted.split(',', 2).join(',').length;
  const finalFormatted = formatted.substring(0, secondCommaIndex) + ' at ' + formatted.substring(secondCommaIndex + 'at'.length)

  return (
    <Typography variant="body2" className={classes.dateCell}>{Boolean(cellValue) ? finalFormatted : ''}</Typography>
  )
}