import React, { useState, useEffect } from "react";
import {
  TextField,
  IconButton,
  CircularProgress,
  Avatar,
  Tooltip,
  Zoom,
  Typography,
} from "@material-ui/core";
import { fetchAssignee } from "../../Service/Jira.service";
import { Add } from "@material-ui/icons";
import { AvatarGroup, Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";

export default function FetchAssignee({
  name,
  label,
  control,
  projectKey,
  preAssigned = "",
  selectedElements,
  setSelectedElements,
  multiple = true,
}) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const methods = useFormContext();

  useEffect(() => {
    async function preFetch() {
      if (preAssigned) {
        const { data, status } = await fetchAssignee(projectKey);
        if (!status) return;
        setSelectedElements?.([
          data.find((dt) => dt.displayName === preAssigned),
        ]);
      }
    }
    preFetch();
  }, [preAssigned]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange } }) => (
        <div style={{ position: "relative" }}>
          <Typography>{label}</Typography>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton
              color="primary"
              style={{
                border: "1px solid #aaa",
                // borderRadius: "6px",
                // boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
                marginRight: "2rem",
                fontSize: "1rem",
              }}
              onClick={async () => {
                setShow(!show);
                setLoading(true);
                if (show && options.length === 0) return;
                const { data, status } = await fetchAssignee(projectKey);
                if (!status) return;
                setLoading(false);
                setOptions(data);
              }}
            >
              <Add />
            </IconButton>
            {selectedElements && (
              <div style={{ display: "flex" }} className="avatar">
                {selectedElements.map((assignee) => (
                  <AvatarGroup max={4}>
                    <Tooltip
                      TransitionComponent={Zoom}
                      title={assignee.displayName}
                    >
                      <Avatar
                        style={{ backgroundColor: "palegreen" }}
                        src={assignee.avatarUrls}
                      />
                    </Tooltip>
                  </AvatarGroup>
                ))}
              </div>
            )}
          </div>
          <div
            // className={classes.popup}
            onBlur={() => setShow(false)}
            style={{
              zIndex: "10",
              opacity: "1",
              backgroundColor: "#fff",
              borderRadius: "6px",
              boxShadow: "0 6px 10px rgba(0,0,0,0.3)",
              padding: "0.5rem 1rem",
              position: "absolute",
              top: "3.2rem",
              left: "1rem",
              transform: show ? "scaleX(1)" : "scaleX(0)",
              transition: "transform 0.3s",
            }}
          >
            <Autocomplete
              {...methods.register("assignee")}
              id="assignee"
              freeSolo
              onChange={(event, value) => {
                if (!value) return;
                if (selectedElements.includes(value)) return;
                setSelectedElements([...selectedElements, value]);
                console.log(selectedElements);
                console.log(methods.getValues(name));
                // methods.setValue(name, JSON.stringify(selectedElements));
                onChange([...selectedElements, value]);
              }}
              options={options}
              getOptionLabel={(option) => option.displayName}
              renderOption={(option) => (
                <React.Fragment key={option.id}>
                  <Avatar src={option.avatarUrls} />
                  {option.displayName}
                </React.Fragment>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={label}
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loading ? (
                          <CircularProgress color="primary" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
              style={{ width: 270 }}
            />
          </div>
        </div>
      )}
    />
  );
}
