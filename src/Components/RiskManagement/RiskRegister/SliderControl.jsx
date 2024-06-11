import { Box, Divider, Slider, Typography } from '@material-ui/core'
import React from 'react'
import { Controller } from 'react-hook-form'

const SliderControl = ({ name, control, rules, marks, classes, handleError, ...props }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules?.[name]}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        error && handleError(error);
        return (
          <Box display="flex" gridColumnGap={30}>
            <Slider
              step={null}
              marks={marks}
              value={value || 0}
              onChange={(e, val) => onChange(val)}
              style={{ width: "70%" }}
              className={classes.customSlider}
            />
            <Divider flexItem orientation='vertical' className={classes.sliderDivider} />
            <Box flex={1} className={classes.sliderValueCaption}>
              {error
                ?
                <Typography style={{ color: "red" }}>{error.message}</Typography>
                :
                <>
                  <Typography>
                    {marks.find(x => x.value === value)?.label}
                  </Typography>
                  <Typography>
                    {marks.find(x => x.value === value)?.name}
                  </Typography>
                </>
              }
            </Box>
          </Box>
        )
      }}
    />
  )
}

export default SliderControl