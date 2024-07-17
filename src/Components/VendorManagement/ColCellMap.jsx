import { Box, Icon, Typography } from "@material-ui/core";
import { useStyle, RiskColorMap } from "./Utils";

const NameCategoryCell = ({ cellValue }) => {
  const classes = useStyle();

  if (!cellValue || !cellValue.name) {
    return (
      <Box>
        <Typography variant="body1" noWrap className={classes.cellLabel}>
          No Data
        </Typography>
        <Typography variant="body2" noWrap className={classes.cellCategory}>
          No Data
        </Typography>
      </Box>
    );
  }

  const { name, category } = cellValue;

  return (
    <Box>
      <Typography variant="body1" noWrap className={classes.cellLabel}>
        {name}
      </Typography>
      <Typography variant="body2" noWrap className={classes.cellCategory}>
        {category}
      </Typography>
    </Box>
  );
};

const SourceCell = ({ cellValue }) => {
  const classes = useStyle();

  if (!cellValue) {
    return (
      <Box>
        <Typography variant="body1" noWrap className={classes.cellLabel}>
          No Data
        </Typography>
      </Box>
    );
  }

  return (
    <Typography variant="body2" noWrap className={classes.sourceCell}>
      {cellValue}
    </Typography>
  );
};

const RiskCell = ({ cellValue }) => {
  const classes = useStyle();

  if (!cellValue) {
    return (
      <Box>
        <Typography variant="body1" noWrap className={classes.cellLabel}>
          No Data
        </Typography>
      </Box>
    );
  }

  const RiskBackgroundColor =
    RiskColorMap[cellValue] || RiskColorMap["default"];
  return (
    <Typography
      variant="body2"
      noWrap
      className={classes.riskScore}
      style={{ backgroundColor: RiskBackgroundColor }}
    >
      {cellValue}
    </Typography>
  );
};

const AccountsCell = ({ cellValue }) => {
  const classes = useStyle();

  if (!cellValue) {
    return (
      <Box>
        <Typography variant="body1" noWrap className={classes.cellLabel}>
          No Data
        </Typography>
      </Box>
    );
  }

  return (
    <Typography variant="body2" noWrap className={classes.accountsCell}>
      {cellValue}
    </Typography>
  );
};

const DateDiscoveredCell = ({ cellValue }) => {
  const classes = useStyle();

  if (!cellValue) {
    return (
      <Box>
        <Typography variant="body1" noWrap className={classes.cellLabel}>
          No Data
        </Typography>
      </Box>
    );
  }

  return (
    <Typography variant="body2" noWrap className={classes.dateCell}>
      {cellValue}
    </Typography>
  );
};

const SecurityReviewCell = ({ cellValue }) => {
  const classes = useStyle();

  if (!cellValue) {
    return (
      <Box>
        <Typography variant="body1" noWrap className={classes.cellLabel}>
          No Data
        </Typography>
      </Box>
    );
  }

  const { status, due_date } = cellValue;

  return (
    <Box>
      <Typography variant="body2" noWrap className={classes.securityReviewCell}>
        {status}
      </Typography>
      {due_date && (
        <Typography variant="body2" noWrap className={classes.cellCategory}>
          Due {due_date}
        </Typography>
      )}
    </Box>
  );
};

const SecurityOwnerCell = ({ cellValue }) => {
  const classes = useStyle();

  if (!cellValue) {
    return (
      <Box>
        <Typography variant="body1" noWrap className={classes.cellLabel}>
          No Data
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="body2" noWrap className={classes.cellLabel}>
        {cellValue}
      </Typography>
    </Box>
  );
};

const LastReviewedCell = ({ cellValue }) => {
  const classes = useStyle();

  if (!cellValue) {
    return (
      <Box>
        <Typography variant="body1" noWrap className={classes.cellLabel}>
          No Data
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="body2" noWrap className={classes.cellLabel}>
        {cellValue}
      </Typography>
    </Box>
  );
};

const columnToCellMap = {
  "NAME / CATEGORY": NameCategoryCell,
  SOURCE: SourceCell,
  "INHERENT RISK": RiskCell,
  "# OF ACCOUNTS": AccountsCell,
  "DATE DISCOVERED": DateDiscoveredCell,
  "SECURITY REVIEW": SecurityReviewCell,
  "SECURITY OWNER": SecurityOwnerCell,
  "LAST REVIEWED": LastReviewedCell,
};

export default columnToCellMap;
