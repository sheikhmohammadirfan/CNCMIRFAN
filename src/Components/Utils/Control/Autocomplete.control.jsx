import { Autocomplete, TextField } from '@mui/material'
import React from 'react'
import { Controller } from 'react-hook-form'

const AutocompleteControl = ({
  name,
  label,
  control,
  rules,
  multiple,
  optionList,
  disabled,
  loading = false,
  onValueChange = () => { },
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules[name]}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const handleValueChange = (newVal) => {
          onValueChange(newVal);
          !disabled && onChange(newVal)
        }
        return (
          <Autocomplete
            size='medium'
            multiple={multiple}
            value={value || (multiple ? [] : null)}
            onChange={(e, newVal) => handleValueChange(newVal)}
            options={!disabled ? optionList : []}
            getOptionLabel={(option) => option.label || ''}
            filterSelectedOptions
            isOptionEqualToValue={(option, value) => option.id === value.id}
            loading={loading}
            loadingText={disabled ? "Can't be changed" : "Loading..."}
            renderInput={(params) => (
              <TextField
                error={Boolean(error)}
                helperText={error ? error.message : ""}
                size='medium'
                variant="outlined"
                label={label}
                {...params}
              />
            )}
            disabled={disabled}
            {...rest}
          />
        )
      }}
    />
  )
}

export default AutocompleteControl