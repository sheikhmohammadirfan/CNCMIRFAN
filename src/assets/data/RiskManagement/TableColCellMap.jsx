import { Box, Icon, Tooltip, Typography } from "@material-ui/core";
import { useStyle } from "../../../Components/RiskManagement/RiskRegister/RiskRegisterUtils";
import { cia_categories } from "./RiskRegister/RiskRegisterFilters";
import colorShader from "../../../Components/Utils/ColorShader";
import { TREATMENT_ID_NAME_MAP } from "./RiskTreatments";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const CategoriesCell = ({ cellValue }) => {
  const classes = useStyle();
  return (
    <Box display="flex" gridColumnGap={5}>
      {cellValue.length > 0 && cellValue.map((val, index) => (
        <Typography key={index} variant="body1" noWrap className={classes.cellLabel}>{val.category_name}</Typography>
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
        {TREATMENT_ID_NAME_MAP[JSON.parse(cellValue).type]}
      </Typography>
      <Typography variant="body2" noWrap className={classes.treatmentStatus}>
        {/* Displaying icon based on treatment status */}
        {JSON.parse(cellValue).status === 0
          ? <Icon style={{ color: colorShader("#000000", 0.5), fontSize: "1rem", marginRight: "5px" }}>error</Icon>
          : <Icon style={{ color: colorShader("#000000", 0.5), fontSize: "1rem", marginRight: "5px" }}>check_circle</Icon>
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
        backgroundColor: cellValue && cellValue.colour
      }}
    >
      {cellValue.value > 0 && cellValue.value}
    </Typography>
  )
}

const IsApprovedCell = ({ cellValue }) => {
  const classes = useStyle();
  const approved = cellValue || cellValue === 1;
  return (
    <Typography variant="body2" noWrap className={classes.statusCell}>
      <span style={{
        minHeight: "10px",
        minWidth: "10px",
        borderRadius: "50%",
        display: "inline-block",
        backgroundColor: approved ? "#4caf50" : "#ffd54f"
      }}>
      </span>
      {approved ? "Approved" : "Pending"}
    </Typography>
  )
}

const TaskCell = ({ cellValue }) => {
  const classes = useStyle();
  const history = useHistory();
  return (
    <Typography variant="body2" noWrap className={classes.actionContainer} >
      {cellValue
        .map((c, i) => 
          <Tooltip  key={i} title={c.task.length > 17 ? c.task : ""}>
            <button
              onClick={() => history.push("/risk-management/action-tracker?id="+c.id)}>
                {c.task}
            </button>
          </Tooltip>
        )}
    </Typography>
  )
}

const SourceCell = ({ cellValue }) => {
  const classes = useStyle();
  return (
    <Typography className={classes.cellLabel}>{cellValue}</Typography>
  )
}

const RangeCell = ({ cellValue: { value, color } }) => {
  return (
    <Box style={{ backgroundColor: color, padding: '6px', borderRadius: '5px' }}>
      <Typography style={{fontSize: '0.85rem'}}>{value}</Typography>
    </Box>
  )
}

const columnToCellMap = {
  Categories: CategoriesCell,
  CIA: CategoriesCiaCell,
  Treatment: TreatmentCell,
  "Inherent Risk": RiskScoreCell,
  "Residual Risk": RiskScoreCell,
  Approved: IsApprovedCell,
  Source: SourceCell,
  Range: RangeCell,
  status: IsApprovedCell,
  Tasks: TaskCell
}

export default columnToCellMap;