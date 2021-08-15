import React from "react";

function ErrMsg({ data }) {
  return (
    <div>
      {data.map((val, index) => (
        <div key={index}>{val}</div>
      ))}
    </div>
  );
}

export default ErrMsg;
