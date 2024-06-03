import * as React from "react";
import { countriesList } from "../../assets/data/countriesList"
import Box from "@mui/material/Box";
import { makeStyles } from "@material-ui/core";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useState, useEffect, useCallback } from "react";

const useStyles = makeStyles((theme) => ({
  form: {
    flex: 1, 
    maxHeight: 50, 
    maxWidth: 110
  },
  signUp_select: {
    marginBottom: 0,
    padding: 0,
    bottom: 20,
  },
  settings_select: {
    mb: 0,
    bottom: 10,
    maxHeight: "2.426rem",
    display: "flex",
    alignItems: "center",
  },
  select_display: {
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    pl: 1
  },
  select_menuItems: {
    pl: 3
  },
  select_menuBox: {
    display: "flex", 
    alignItems: "center", 
    pl: 1,
  },
}));

export default function CountrySelect({ variant, value, onChange, onBlur }) {

  const countries = countriesList;

  useEffect(() => {
    if (value != null) {
      //Value is coming from user if they already have a country set from making a account
      const newDefaultCountry = countries.find((country) => country.code === value);
      setSelectedCountry(newDefaultCountry);
    }
  }, [value]);

  const defaultCountry = countries[0];
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);

  const memoizedOnChange = useCallback(onChange, []);

  useEffect(() => {
    if (selectedCountry) {
      memoizedOnChange(selectedCountry.code);
    }
  }, [selectedCountry, memoizedOnChange]);

  const handleCountryChange = (event) => {
    const selectedCountryCode = event.target.value;
    const selectedCountry = countries.find(country => country.code === selectedCountryCode);
    setSelectedCountry(selectedCountry);
    onChange(selectedCountry.code);
  };

  const classes = useStyles();

  const selectStyle = variant != null ? classes.settings_select : classes.signUp_select;

  return (
        <FormControl
          variant="standard"
          className={classes.form}
        >
          <InputLabel id="country-select-label"></InputLabel>
          <Select
            variant={variant}
            className = {selectStyle}
            labelId="country-select-label"
            id="country-select"
            value={selectedCountry ? selectedCountry.code : ''}
            onChange={handleCountryChange}
            onBlur={onBlur}
            renderValue={(value) => {
              const selectedCountry = countries.find(
                (country) => country.code === value
              );
              return selectedCountry ? (
                <Box className={classes.select_display}>
                  <img
                    loading="lazy"
                    width="20"
                    srcSet={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png 2x`}
                    src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`}
                    alt={selectedCountry.label}
                    style={{ marginRight: "10px" }}
                  />
                  {`+${selectedCountry.phone}`}
                </Box>
              ) : null;
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 270,
                  maxWidth: 300,
                },
              },
            }}
          >
            {countries.map((country) => (
              <MenuItem key={country.code} value={country.code} className={classes.select_menuItems}>
                <Box className={classes.select_menuBox}>
                  <img
                    loading="lazy"
                    width="20"
                    srcSet={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png 2x`}
                    src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                    alt={country.label}
                    style={{ marginRight: "10px" }}
                  />
                  {country.label} ({country.code}) +{country.phone}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
  );
}