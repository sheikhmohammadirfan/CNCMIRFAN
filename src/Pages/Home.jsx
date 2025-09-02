import React from "react";
import { userData } from "../assets/data/dummyData";
import Chart from "../Components/Chart";
import { useLayoutEffect, useState } from "react";
import DocumentTitle from "../Components/DocumentTitle";
import Drive from "../Components/Drive";

/* Add event listener on window width */
function useWindowSize() {
  // height & width resize listener
  const [size, setSize] = useState([0, 0]);

  // Add event on mounting & remvoe on unmounting
  useLayoutEffect(() => {
    const updateSize = () => setSize([window.innerWidth]);

    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

/* Home component */
export default function Home(props) {
  // Get width
  const [width] = useWindowSize();

  DocumentTitle(props.title);

  return (
    <div>
      <Chart
        data={width > 800 ? userData : userData.slice(0, 4)}
        title="Analytics"
        grid
        dataKey="Active User"
      />
      <Drive />
    </div>
  );
}
