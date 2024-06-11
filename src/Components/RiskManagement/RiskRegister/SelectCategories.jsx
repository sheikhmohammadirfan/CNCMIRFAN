import { TextField } from '@material-ui/core'
import { Autocomplete } from '@mui/material'
import React from 'react'
import { Controller } from 'react-hook-form'

const SelectCategories = ({ name, label, control, rules, multiple, optionList, ...rest }) => {

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
            value={value || []}
            onChange={(e, newVal) => onChange(newVal)}
            options={optionList}
            getOptionLabel={(option) => option.text}
            filterSelectedOptions
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
            {...rest}
          />
        )
      }}
    />
  )
}

export default SelectCategories