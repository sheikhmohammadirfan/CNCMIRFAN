import React from "react";
import { Icon, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  gradientBtn: {
    outline: "none",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    textTransform: "uppercase",
    fontSize: "1rem",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(to right, #44ea76 0%, #39fad7 80%, #39fad7 100%)",
    boxShadow: "0 5px 10px #44ea76",
  },
}));

export default function GradientButton(props) {
  return (
    <button
      type={props.type}
      style={{
        background: `linear-gradient(to right, ${props.colorFrom} 0%, ${props.colorTo} 80%, ${props.colorTo} 100%)`,
        color: props.textColor,
        boxShadow: `0 5px 10px ${props.colorFrom}`,
      }}
    >
      {props.name}{" "}
      {props.isLoading ? (
        <CircularProgress
          size={20}
          style={{ color: "#fff", marginLeft: "6px" }}
        />
      ) : (
        <Icon style={{ marginLeft: "4px", fontSize: "18px" }}>
          {props.icon_name}
        </Icon>
      )}
    </button>
  );
}
