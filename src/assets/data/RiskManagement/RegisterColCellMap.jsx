import { Box, Icon, Typography } from "@material-ui/core";
import { useStyle } from "../../../Components/RiskManagement/RiskRegister/RiskRegisterUtils";
import { cia_categories } from "./RiskRegisterFilters";

const CategoriesCell = ({ cellValue }) => {
  const classes = useStyle();
  return (
    <Box display="flex" gridColumnGap={5}>
      {cellValue.map((val, index) => (
        <Typography key={index} variant="body1" noWrap className={classes.cellLabel}>{val.text}</Typography>
      ))}
    </Box>
  )
}

const CategoriesCiaCell = ({ cellValue }) => {
  const classes = useStyle();
  return (
    <Box display="flex" gridColumnGap={5}>
      {cia_categories
        .filter(cia => cellValue.includes(cia.id))
        .map((cia, elementIndex) => (
          <Typography key={elementIndex} variant="body1" noWrap className={classes.cellLabel}>{cia.text}</Typography>
        ))
      }
    </Box>
  )
}

const TreatmentCell = ({ cellValue }) => {
  const classes = useStyle();
  return (
    <Box display="flex" flexDirection="column" gridRowGap={5}>
      <Typography variant="body2" noWrap className={classes.treatmentAction}>
        {JSON.parse(cellValue).type === 1 ? "Mitigate" : "Avoid"}
      </Typography>
      <Typography variant="body2" noWrap className={classes.treatmentStatus}>
        {/* Displaying icon based on treatment status */}
        {JSON.parse(cellValue).status === 0
          ? <Icon style={{ color: "rgba(0, 0, 0, 0.5)", fontSize: "1rem", marginRight: "5px" }}>error</Icon>
          : <Icon style={{ color: "rgba(0, 0, 0, 0.5)", fontSize: "1rem", marginRight: "5px" }}>check_circle</Icon>
        }
        {JSON.parse(cellValue).status === 0 ? "Incomplete" : "OK"}
      </Typography>
    </Box>
  )
}

const RiskScoreCell = ({ cellValue }) => {
  const classes = useStyle();
  return (
    <Typography
      variant="body2"
      noWrap
      className={classes.riskScore}
      style={{
        backgroundColor: cellValue && (cellValue <= 9 ? "#81c784" : (cellValue > 9 && cellValue < 15 ? "#ffd54f" : "#e57373"))
      }}
    >
      {cellValue}
    </Typography>
  )
}

const IsApprovedCell = ({ cellValue }) => {
  const classes = useStyle();
  return (
    <Typography variant="body2" noWrap className={classes.statusCell}>
      <span style={{
        minHeight: "10px",
        minWidth: "10px",
        borderRadius: "50%",
        display: "inline-block",
        backgroundColor: cellValue === true ? "#4caf50" : "#ffd54f"
      }}>
      </span>
      {cellValue === true ? "Approved" : "Pending"}
    </Typography>
  )
}

const columnToCellMap = {
  Categories: CategoriesCell,
  CIA: CategoriesCiaCell,
  Treatment: TreatmentCell,
  "Inherent Risk": RiskScoreCell,
  "Residual Risk": RiskScoreCell,
  Approved: IsApprovedCell,
}

export default columnToCellMap;