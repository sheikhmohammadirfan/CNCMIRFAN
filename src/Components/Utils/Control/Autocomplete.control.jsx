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
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules[name]}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        return (
          <Autocomplete
            size='medium'
            multiple={multiple}
            value={value || null}
            onChange={(e, newVal) => !disabled && onChange(newVal)}
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