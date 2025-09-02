import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { makeStyles, Typography } from "@material-ui/core";

/**
 * CSS class generator
 */
const useStyle = makeStyles((theme) => ({
  // Style for chart
  chart: {
    margin: "0 auto",
    width: "80%",
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    boxShadow: theme.shadows[4],
  },
}));

/**
 * Chart Component
 */
export default function Chart({ title, data, dataKey, grid }) {
  // GEt styles
  const classes = useStyle();

  return (
    <div className={classes.chart}>
      <Typography variant="h5">{title}</Typography>
      <ResponsiveContainer width="100%" aspect={4 / 1}>
        <LineChart data={data}>
          <XAxis
            dataKey="name"
            stroke="#5550bd"
            interval={"preserveStartEnd"}
          />
          <Line type="monotone" dataKey={dataKey} stroke="#5550bd" />
          <Tooltip />
          {grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
