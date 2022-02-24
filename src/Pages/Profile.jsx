import {
  Button,
  Box,
  Grid,
  Typography,
  InputAdornment,
  Icon,
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
import enLocale from "i18n-iso-countries/langs/en.json";
import { makeStyles } from "@material-ui/styles";
import { getUser, setUser } from "../Service/UserFactory";
import { useForm } from "react-hook-form";
import { isPasswordValid } from "../Components/Utils/Utils";
import { updateProfile } from "../Service/UserFactory";
import { Profile as defaultValues } from "../assets/data/DefaultValue";

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
}));

/* PROFILE COMPONENT */
export default function Profile({ title }) {
  DocumentTitle(title);
  // Get styles
  const classes = useStyles();

  // Setup contry dropdown list
  countries.registerLocale(enLocale);
  const countryObj = countries.getNames("en", { select: "official" });
  const countryArray = Object.values(countryObj).map((value) => ({
    text: value,
    val: value,
  }));

  // Validation to be the profile form fields
  const validation = {
    contact_no: {
      pattern: { value: /^\d{10}$/, message: "Contact no. is invalid." },
    },
    date_of_birth: {
      validate: {
        invalid: (date) =>
          new Date(date) < new Date() || "Invalid Date of Birth.",
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
    const formatDate = (date) =>
      typeof date === "string" ? date : date?.format("YYYY-MM-DD");
    const { data, status } = await updateProfile({
      ...formData,
      date_of_birth: formatDate(formData.date_of_birth),
    });
    if (!status) return;
    setUser({ ...getUser(), ...data });
    reset(data);
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
                  <TextControl
                    variant="outlined"
                    size="small"
                    name="contact_no"
                    label="Contact No."
                    gutter={false}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon>call</Icon>
                        </InputAdornment>
                      ),
                    }}
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
              <Button variant="outlined" color="primary" type="submit">
                Update Details
              </Button>
            </Grid>
          </Grid>
        </Form>
      </Box>
    </Box>
  );
}
