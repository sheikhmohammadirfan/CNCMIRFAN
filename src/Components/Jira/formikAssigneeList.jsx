import {
  Avatar,
  Tooltip,
  Zoom,
  Typography,
  withStyles,
  Badge,
  Box,
  TextField,
  FormHelperText,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import CloseButton from "../Utils/CloseButton";
import { Button } from "@mui/material";

// Custom badge to show remove button on hover
const AvatarBadge = withStyles((theme) => ({
  root: {
    margin: `${theme.spacing(1 / 2)}px 0`,
    border: `${theme.spacing(1 / 4)}px solid white`,
    borderRadius: "50%",
    "&.valid:hover": {
      borderColor: theme.palette.primary.dark,
      "& > .MuiBadge-badge": { opacity: 1, pointerEvents: "all" },
    },
  },
  badge: {
    "& .material-icons": { fontSize: 20, color: theme.palette.primary.dark },
    "& .MuiIconButton-label": {
      borderRadius: "50%",
      padding: 1,
      background: "white",
    },
    opacity: 0,
    pointerEvents: "none",
    transition: "opacity 0.1s linear",
  },
}))(({ props, ...rest }) => (
  <Badge
    overlap="circular"
    className={props ? "valid" : ""}
    badgeContent={props && <CloseButton size="small" click={props.onDelete} />}
    {...rest}
  />
));

// Render option label to show user img & name
const RenderLabel = (option) => {
  const isFalcon = option.is_falcon_user;
  return (
    <Box width={1} display="flex" alignItems="center">
      <Avatar
        src={option.avatarUrls}
        alt={option.displayName}
        style={{ width: 32, height: 32 }}
      />
      <Typography style={{ paddingLeft: 8, flexGrow: 1 }}>
        {option.label}
      </Typography>
      {!isFalcon && (
        <Button
          variant="outlined"
          size="small"
          sx={{
            fontSize: "0.7rem",
            textTransform: "none",
            padding: "2px 6px",
            minWidth: "auto",
          }}
          onClick={(e) => {
            e.stopPropagation();
            alert(`Invite sent to ${option.emailAddress}`);
          }}
        >
          Invite and Add
        </Button>
      )}
    </Box>
  );
};

// Render selected options, show user icon with close option
const RenderTagList = (value, props) =>
  value.map((option, index) => (
    <Tooltip
      arrow
      key={index}
      TransitionComponent={Zoom}
      title={option.displayName}
    >
      <Box>
        <AvatarBadge props={props?.({ index })}>
          <Avatar src={option.avatarUrls} alt={option.displayName} />
        </AvatarBadge>
      </Box>
    </Tooltip>
  ));

export default function FormikSelectAssignee({
  field,
  form,
  label,
  options,
  multiple = false,
  ...rest
}) {
  const error = form.touched[field.name] && form.errors[field.name];
  return (
    <>
      <Autocomplete
        value={
          multiple
            ? options.filter((opt) => (field.value || []).includes(opt.value))
            : options.find((opt) => opt.value === field.value) || null
        }
        onChange={(e, newVal) => {
          if (multiple) {
            form.setFieldValue(
              field.name,
              newVal.map((opt) => opt.value)
            );
          } else {
            form.setFieldValue(field.name, newVal ? newVal.value : "");
          }
        }}
        options={options}
        multiple={multiple}
        filterSelectedOptions
        getOptionSelected={(option, test) => {
          return option.value === test.value;
        }}
        getOptionLabel={(option) => option.label || ""}
        renderOption={(option) => RenderLabel(option)}
        renderTags={(value, props) => RenderTagList(value, props)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant="outlined"
            error={!!error}
          />
        )}
        {...rest}
      />
      {error && (
        <FormHelperText style={{ marginLeft: "14px" }} error>
          {error}
        </FormHelperText>
      )}
    </>
  );
}
