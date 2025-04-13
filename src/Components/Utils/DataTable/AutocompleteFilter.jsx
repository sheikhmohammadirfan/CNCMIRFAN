import { Autocomplete, TextField } from '@mui/material'
import React from 'react'

const AutocompleteFilter = ({ name, value, options }) => {
  return (
    <Autocomplete
      multiple
      options={options}
      getOptionLabel={(option) => option.text}
      filterSelectedOptions
      renderInput={(params) => (
        <TextField
          {...params}
          size='small'
          variant="outlined"
          label={name}
          sx={{
            '& .MuiOutlinedInput-root': {
              padding: '3px'
            }
          }}
        />
      )}
      sx={{
        width: '100%',
      }}
      size='small'
    />
  )
}

export default AutocompleteFilter