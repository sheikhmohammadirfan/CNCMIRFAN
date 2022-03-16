import {
  Button,
  Box,
  Grid,
  Typography,
  InputAdornment,
  Icon,
  CircularProgress,
} from "@material-ui/core";
import DocumentTitle from "../Components/DocumentTitle";
import countries from "i18n-iso-countries";
import {
  DateControl,
  SelectControl,
  PasswordControl,
  TextControl,
  Form,
} from "../Components/Utils/Control";
// Importing desired language
import { makeStyles } from "@material-ui/styles";
import { getUser, setUser } from "../Service/UserFactory";
import { Controller, useForm } from "react-hook-form";
import { isPasswordValid } from "../Components/Utils/Control/ControlsUtils";
import { updateProfile } from "../Service/UserFactory";
import { Profile as defaultValues } from "../assets/data/DefaultValue";
import enLocale from "i18n-iso-countries/langs/en.json";
import countryCodes from "country-codes-list";
import useLoading from "../Components/Utils/Hooks/useLoading";
import { stringToMoment } from "../Components/Utils/Utils";

/* GENERATE STYLES */
const useStyles = makeStyles((theme) => ({
  container: {
    width: "60%",
    margin: `${theme.spacing(2)}px auto`,
    padding: theme.spacing(2),
    borderRadius: 6,
  },
  subtitle: {
    fontWeight: "bold",
    borderBottom: `${theme.spacing(2 / 3)}px solid ${theme.palette.grey[300]}`,
  },
  countryDropdown: {
    minWidth: 80,
    marginLeft: theme.spacing(1 / 2),
    "& .MuiInput-formControl": {
      margin: 0,
      "&::before": { content: "", border: "none" },
    },
    "& .MuiInput-underline": { "&::after": { content: "", border: "none" } },
    "& .MuiSelect-root": {
      background: "transparent",
    },
  },
}));

// Custom test input for countact number with country code dropdown selector
const ContactNumControl = ({ name, label, control, rules }) => {
  // Generate styles
  const classes = useStyles();

  // Get mapping of countryCode with callingCode
  const callingCodes = countryCodes.customList(
    "countryCode",
    "+{countryCallingCode}"
  );

  // Map countryCode to options
  const options = Object.entries(callingCodes).map(([val, text]) => ({
    val,
    text: `${val} ${text}`,
  }));

  return (
    <Controller
      name={name}
      control={control}
      rules={rules[name]}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        // Extract callingcode & number
        const [code, num] = value.split("-");

        // Extract countryCode from callingCode to populate Select input
        const getCountryCode = () => {
          if (!code) return "";
          for (let countryCode in callingCodes)
            if (callingCodes[countryCode] === code) return countryCode;
          return "";
        };

        // Country code selection input
        const Adornment = () => (
          <InputAdornment position="start">
            <Icon>call</Icon>
            <SelectControl
              name="option"
              label=" "
              styleProps={{ className: classes.countryDropdown }}
              options={options}
              value={getCountryCode()}
              onChange={(e) =>
                onChange(`${callingCodes[e.target.value]}-${num || ""}`)
              }
            />
          </InputAdornment>
        );

        return (
          <TextControl
            name={name}
            label={label}
            error={error?.message}
            noControls={true}
            variant="outlined"
            size="small"
            gutter={false}
            fullWidth
            value={num === undefined ? "" : num}
            onChange={(e) => onChange(`${code}-${e.target.value}`)}
            InputProps={{ startAdornment: <Adornment /> }}
          />
        );
      }}
    />
  );
};

/* PROFILE COMPONENT */
export default function Profile({ title }) {
  DocumentTitle(title);
  // Get styles
  const classes = useStyles();
  // Loader
  const { isLoading, startLoading, stopLoading } = useLoading();

  countries.registerLocale(enLocale);
  const countryObj = countries.getNames("en", { select: "official" });
  const countryArray = Object.values(countryObj).map((value) => ({
    text: value,
    val: value,
  }));

  // Validation to be the profile form fields
  const validation = {
    first_name: { required: "This field is required." },
    last_name: { required: "This field is required." },
    contact_no: {
      validate: {
        invalid: (val) => {
          if (val === "") return true;
          const [code, num] = val.split("-");
          if (!num?.match(/^\d{10}$/)) return "Countact no. invalid.";
          if (code === "") return "Select Country code.";
          return true;
        },
      },
    },
    postal_code: {
      pattern: { value: /^\d{6}$/, message: "Pin code is invalid." },
    },
    "New Password": {
      validate: { invalid: (val) => val === "" || isPasswordValid(val) },
    },
    "Confirm New Password": {
      validate: {
        invalid: (pass) =>
          pass === getValues("New Password") || "Password do not match.",
      },
    },
  };

  // Get useFrom method to handle form
  const { handleSubmit, control, getValues, reset } = useForm({
    defaultValues: defaultValues(getUser),
  });

  // Call update api to update field, only if data is changed
  const onSubmit = async (formData) => {
    if (!isLoading()) {
      startLoading();
      const { data, status } = await updateProfile(formData);
      if (!status) return stopLoading();
      setUser({ ...getUser(), ...data });
      reset({ ...data, date_of_birth: stringToMoment(data.date_of_birth) });
      stopLoading();
    }
  };

  return (
    <Box>
      <Box className={classes.container}>
        <Form
          control={control}
          rules={validation}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid contrinar>
                <Typography variant="h6" className={classes.subtitle}>
                  Personal Details
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextControl
                    variant="outlined"
                    size="small"
                    name="first_name"
                    label="First Name"
                    gutter={false}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextControl
                    variant="outlined"
                    size="small"
                    name="last_name"
                    label="Last Name"
                    gutter={false}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={6}>
                  <ContactNumControl
                    name="contact_no"
                    label="Contact No."
                    control={control}
                    rules={validation}
                  />
                </Grid>

                <Grid item xs={6}>
                  <DateControl
                    name="date_of_birth"
                    label="Date Of Birth"
                    size="small"
                    variant="outlined"
                    format="Do MMMM yyyy"
                    fullWidth
                    disableFuture
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextControl
                    name="address"
                    label="Room/Flat no, Street"
                    variant="outlined"
                    size="small"
                    fullWidth
                    gutter={false}
                  />
                </Grid>

                <Grid item xs={4}>
                  <TextControl
                    name="city"
                    label="City"
                    variant="outlined"
                    size="small"
                    fullWidth
                    gutter={false}
                  />
                </Grid>

                <Grid item xs={8}>
                  <TextControl
                    name="state"
                    label="State"
                    variant="outlined"
                    size="small"
                    fullWidth
                    gutter={false}
                  />
                </Grid>

                <Grid item xs={4}>
                  <TextControl
                    name="postal_code"
                    label="Pincode"
                    variant="outlined"
                    size="small"
                    fullWidth
                    gutter={false}
                  />
                </Grid>

                <Grid item xs={8}>
                  <SelectControl
                    name="country"
                    label="Country"
                    options={countryArray}
                    variant="outlined"
                    styleProps={{ fullWidth: true, size: "small" }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid contrinar>
                <Typography variant="h6" className={classes.subtitle}>
                  User Credentials
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Typography>Email:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextControl
                    variant="outlined"
                    size="small"
                    name="email"
                    label=" "
                    gutter={false}
                    disabled
                    fullWidth
                    style={{ maxWidth: 400 }}
                  />
                </Grid>

                <Grid item xs={3}>
                  <Typography>New password:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <PasswordControl
                    variant="outlined"
                    size="small"
                    name="New Password"
                    label=" "
                    gutter={false}
                    fullWidth
                    style={{ maxWidth: 400 }}
                  />
                </Grid>

                <Grid item xs={3}>
                  <Typography>Confirm password:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <PasswordControl
                    variant="outlined"
                    size="small"
                    name="Confirm New Password"
                    label=" "
                    gutter={false}
                    fullWidth
                    forceHidden={true}
                    style={{ maxWidth: 400 }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} style={{ textAlign: "right" }}>
              <Button
                variant="outlined"
                color="primary"
                type="submit"
                endIcon={isLoading() && <CircularProgress size={20} />}
              >
                {isLoading() ? "Updating..." : "Update Details"}
              </Button>
            </Grid>
          </Grid>
        </Form>
      </Box>
    </Box>
  );
}
