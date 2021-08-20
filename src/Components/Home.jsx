import React from 'react';
import { makeStyles } from '@material-ui/core';
import { userData } from "../assets/dummyData";
import Chart from "./Chart";
import { useLayoutEffect, useState } from "react";
import DocumentTitle from "./DocumentTitle";

function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth]);
      }
      window.addEventListener("resize", updateSize);
      updateSize();
      return () => window.removeEventListener("resize", updateSize);
    }, []);
    return size;
  }


const useStyles = makeStyles((theme) => ({
    rightSide: {
        wordBreak: "break-word",
    },
}));

export default function Home(props) {
    const classes = useStyles();
    const [width] = useWindowSize();
    const titlePrefix = 'CNCM | '
    DocumentTitle(`${titlePrefix}${props.title}`);
    return (
        <div className={classes.rightSide}>
                      <Chart
                        data={width > 800 ? userData : userData.slice(0, 4)}
                        title="Analytics"
                        grid
                        dataKey="Active User"
                      />
        </div>
    )
}
