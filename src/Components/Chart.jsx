import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles({
    chart: {
        margin: "0 auto",
        width: "80%",
        marginTop: "1.2rem",
        padding: "1.2rem",
  boxShadow: "0px 0px 15px -10px rgba(0, 0, 0, 0.75)",
    },

    chartTitle: {
        marginBottom: "1.2rem",
    }
});

export default function Chart({ title, data, dataKey, grid }) {
    const myClass = useStyle();
  return (
    <div className={myClass.chart}>
      <h3 className={myClass.chartTitle}>{title}</h3>
      <ResponsiveContainer width="100%" aspect={4 / 1}>
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#5550bd" interval={'preserveStartEnd'} />
          <Line type="monotone" dataKey={dataKey} stroke="#5550bd" />
          <Tooltip />
          {grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}