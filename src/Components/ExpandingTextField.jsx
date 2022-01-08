import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { TextField, IconButton, Avatar } from "@material-ui/core";
import { Add } from "@material-ui/icons";

export default function ExpandingTextField() {
  return (
    <div>
      {/* <Avatar>
            <Add/>
            </Avatar> */}
      <IconButton>
        <Add />
      </IconButton>
    </div>
  );
}
