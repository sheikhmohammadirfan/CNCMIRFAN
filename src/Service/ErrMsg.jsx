import React from "react";

function ErrMsg({ data }) {
  return (
    <div>
      {Object.keys(data).map((key) =>
        data[key].map((val, index) => <div key={index}>⚫ {val}</div>)
      )}
    </div>
  );
}

export default ErrMsg;
